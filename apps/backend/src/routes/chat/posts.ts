// posts.js
import express, { type Request, type Response } from "express";
import { z } from "zod";
import pool from "../../config/db.js";
import supabase from "../../lib/supabase.js";
import authMiddleware from "../../middleware/auth.js";
import { validatePathParams, validateQuery } from "../../middleware/validator.js";
import { createReplyNotification } from "../notifications.js";
import type { ApiResponse, PaginatedResponse } from "../../types/apiResponse.js";
import type { ForumMessageWithReplyDetails } from "../../types/resources.js";

const router = express.Router();

const postsIndexSchema = z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
});
type PostsIndexSchema = {
    page?: string;
    limit?: string;
};

// TODO: Migrate from /posts to /threads/allWithDetails or similar
router.get(
    "/",
    validateQuery(postsIndexSchema),
    async (
        req: Request<
            unknown,
            ApiResponse<PaginatedResponse<ForumMessageWithReplyDetails[]>>,
            unknown,
            PostsIndexSchema
        >,
        res,
    ) => {
        try {
            const { query: q } = req;
            const page = q.page ? parseInt(q.page, 10) : 1;
            const limit = q.limit ? parseInt(q.limit, 10) : 50;
            const offset = (page - 1) * limit;

            const { data: threads, count } = await supabase
                .from("forum_messages_with_last_reply")
                .select("*", { count: "exact" })
                .range(offset, offset + limit - 1);

            if (!threads) {
                return res.status(500).json({ message: "Internal error when getting messages." });
            }

            const posts = threads.map((post) => {
                const isImported = post.is_imported === true;
                const author_avatar = isImported ? post.imported_avatar_url : post.author_avatar;
                const author = isImported ? post.imported_author_name : post.author;

                return {
                    ...post,
                    reply_count: post.replyCount,
                    last_reply_at: post.latest_reply_date,
                    last_reply_by: post.latest_reply_author,
                    author_avatar,
                    author,
                };
            });

            return res.json({
                data: posts,
                pagination: {
                    page,
                    limit,
                    total: count ?? 0,
                    pages: Math.ceil((count ?? 0) / limit),
                },
            });
        } catch (error) {
            console.error("Error fetching posts:", error);
            res.status(500).json({ message: error.message });
        }
    },
);

const postsRepliesByParentIdSchema = z
    .object({
        parentId: z.string(),
    })
    .required();
type PostsRepliesByParentId = z.infer<typeof postsRepliesByParentIdSchema>;

router.get(
    "/replies/:parentId",
    validatePathParams(postsRepliesByParentIdSchema),
    async (req: Request<PostsRepliesByParentId>, res) => {
        const { parentId } = req.params;

        try {
            const { data, error } = await supabase
                .rpc("replies_by_thread", {
                    thread_id_in: parentId,
                })
                .order("created_at", { ascending: true });

            if (error) throw error;

            for (const reply of data) {
                if (reply.is_imported) {
                    reply.author = reply.imported_author_name;
                } else {
                    // TODO - consolidate into a single query, rather than O(n) queries
                    const author = await supabase
                        .from("users")
                        .select("username")
                        .eq("auth0_id", reply.auth0_id)
                        .limit(1)
                        .single();

                    reply.author = author.data?.username ?? "Unknown User";
                }
            }

            return res.json(data);
        } catch (e) {
            console.error("ERROR [/posts/replies/:parentId]:", e);
            return res.status(500).json({ message: "internal server error" });
        }
    },
);

router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        // Get the thread (main post)
        const { data, error: threadError } = await supabase
            .from("forum_messages")
            .select("*")
            .eq("id", parseInt(threadId, 10))
            .single();

        if (threadError) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(data);
    } catch (error) {
        console.error("Error in getThreadById:", error);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});

// Create new post
router.post("/", authMiddleware, async (req, res) => {
    const {
        title,
        content,
        tags,
        images,
        is_imported,
        imported_author_name,
        imported_date,
        imported_avatar_url, // <-- new field
    } = req.body;

    const auth0Id = req.user.sub;

    try {
        // First, verify the user
        const user = await pool.query(
            "SELECT email, username, avatar_url FROM users WHERE auth0_id = $1",
            [auth0Id],
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const { username, avatar_url } = user.rows[0];
        const finalAuthor = username || user.rows[0].email || "Anonymous";

        // If the post is imported and has a valid date, override created_at
        let finalCreatedAt;
        if (is_imported && imported_date) {
            const parsedDate = new Date(imported_date);
            if (!isNaN(parsedDate.valueOf())) {
                finalCreatedAt = parsedDate.toISOString();
            }
        }

        // Create the post
        const { data: post, error: postError } = await supabase
            .from("forum_messages")
            .insert([
                {
                    title,
                    content,
                    auth0_id: auth0Id, // The real "owner" in supabase
                    author: finalAuthor,
                    reply_count: 0,
                    is_thread_starter: true,
                    is_edited: false,
                    images: images || [],
                    // Imported fields
                    is_imported: is_imported || false,
                    imported_author_name: imported_author_name || null,
                    imported_date: imported_date || null,
                    imported_avatar_url: imported_avatar_url || null, // <--- store it
                    // If we parsed a valid date, override created_at
                    created_at: finalCreatedAt || new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (postError) throw postError;

        // Add tags
        if (tags?.length > 0) {
            await supabase.from("post_tags").insert(
                tags.map((tagId) => ({
                    post_id: post.id,
                    tag_id: tagId,
                })),
            );
        }

        // Fetch tags for response
        const { data: postTags } = await supabase
            .from("post_tags")
            .select("tag:tags(*)")
            .eq("post_id", post.id);

        // Return the new post data
        res.json({
            ...post,
            avatar_url, // The real user's avatar if not imported
            username,
            tags: postTags?.map((pt) => pt.tag) || [],
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: error.message });
    }
});

// Add reply to post
router.post("/:id/reply", authMiddleware, async (req, res) => {
    const { content, images, is_imported, imported_author_name, imported_date } = req.body;

    const { id: parentId } = req.params;
    const auth0Id = req.user.sub;

    try {
        // 1) Verify the user exists
        const user = await pool.query(
            "SELECT email, username, avatar_url FROM users WHERE auth0_id = $1",
            [auth0Id],
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // 2) Get original post's author (for notifications)
        const { data: parentPost } = await supabase
            .from("forum_messages")
            .select("auth0_id")
            .eq("id", parentId)
            .single();

        const { username, avatar_url } = user.rows[0];
        const finalAuthor = username || user.rows[0].email || "Anonymous";

        // 3) Update parent post's last_activity_at to "now"
        await supabase
            .from("forum_messages")
            .update({ last_activity_at: new Date() })
            .eq("id", parentId);

        // 4) If this reply is imported and has a valid date, override created_at
        let finalCreatedAt;
        if (is_imported && imported_date) {
            const parsedDate = new Date(imported_date);
            if (!isNaN(parsedDate.valueOf())) {
                finalCreatedAt = parsedDate.toISOString();
            }
        }

        // 5) Create the reply
        const { data: reply, error } = await supabase
            .from("forum_messages")
            .insert([
                {
                    content,
                    parent_id: parentId,
                    auth0_id: auth0Id,
                    author: finalAuthor,
                    images: images || [],
                    is_imported: is_imported || false,
                    imported_author_name: imported_author_name || null,
                    imported_date: imported_date || null,
                    created_at: finalCreatedAt || new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (error) throw error;

        // 6) Create a notification for the original post author (only if non-imported)
        if (!is_imported && parentPost?.auth0_id && parentPost.auth0_id !== auth0Id) {
            await createReplyNotification(parentId, auth0Id, parentPost.auth0_id, reply.id);
        }

        // 7) Return the new reply
        res.json({
            ...reply,
            avatar_url,
            username,
        });
    } catch (error) {
        console.error("Error adding reply:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get reactions for a post
router.get("/:postId/reactions", authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("post_reactions")
            .select("type, count")
            .eq("post_id", req.params.postId);

        if (error) throw error;

        const reactions = data.reduce((acc, curr) => {
            acc[curr.type] = curr.count;
            return acc;
        }, {});

        res.json(reactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add/update reaction
// In posts.js, update the route for adding reactions:
router.post("/:postId/reactions", authMiddleware, async (req, res) => {
    try {
        const { type } = req.body;
        const userId = req.user.sub; // from Auth0
        const postId = req.params.postId;

        // Get the post to check who authored it
        const { data: post, error: postError } = await supabase
            .from("forum_messages")
            .select("auth0_id")
            .eq("id", postId)
            .single();

        if (postError) throw postError;

        // Check if user already reacted
        const { data: existing } = await supabase
            .from("user_reactions")
            .select()
            .eq("post_id", postId)
            .eq("user_id", userId)
            .single();

        if (existing) {
            // Update existing reaction
            await supabase
                .from("user_reactions")
                .update({ type })
                .eq("post_id", postId)
                .eq("user_id", userId);
        } else {
            // Create new reaction
            await supabase.from("user_reactions").insert({
                post_id: postId,
                user_id: userId,
                type,
            });

            // Create notification for the post author (only for new reactions)
            if (post && post.auth0_id && post.auth0_id !== userId) {
                await createReactionNotification(postId, userId, post.auth0_id, type);
            }
        }

        // Rest of your code...
    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/posts/import
router.post("/import", authMiddleware, async (req, res) => {
    const { title, content, userId, createdAt, tags, parentThreadId } = req.body;

    try {
        const { rows: userRows } = await pool.query(
            "SELECT username FROM users WHERE auth0_id = $1",
            [userId],
        );

        if (!userRows.length) {
            return res.status(404).json({ error: "Specified user not found" });
        }

        const username = userRows[0].username;

        // Insert the post into Supabase using the correct column names
        const { data: post, error } = await supabase
            .from("forum_messages")
            .insert([
                {
                    title,
                    content,
                    auth0_id: userId, // Changed from user_id to auth0_id
                    author: username,
                    created_at: createdAt,
                    parent_id: parentThreadId || null,
                    is_thread_starter: !parentThreadId,
                },
            ])
            .select()
            .single();

        if (error) throw error;

        // Add tags if provided
        if (tags?.length) {
            const { error: tagError } = await supabase.from("post_tags").insert(
                tags.map((tagId) => ({
                    post_id: post.id,
                    tag_id: tagId,
                })),
            );

            if (tagError) throw tagError;
        }

        // Update thread stats if this is a reply
        if (parentThreadId) {
            const { error: updateError } = await supabase.rpc("update_thread_reply_stats", {
                thread_id: parentThreadId,
            });

            if (updateError) throw updateError;
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/edit/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, content, tags, userId, createdAt, images } = req.body;

    try {
        // Get user info
        const { rows: userRows } = await pool.query(
            "SELECT username FROM users WHERE auth0_id = $1",
            [userId],
        );

        if (!userRows.length) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update post
        const { data: post, error } = await supabase
            .from("forum_messages")
            .update({
                title,
                content,
                auth0_id: userId,
                author: userRows[0].username,
                created_at: createdAt,
                is_edited: true,
                images: images || undefined,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        // Update tags
        if (tags) {
            // Remove existing tags
            await supabase.from("post_tags").delete().eq("post_id", id);

            // Add new tags
            if (tags.length > 0) {
                await supabase.from("post_tags").insert(
                    tags.map((tagId) => ({
                        post_id: id,
                        tag_id: tagId,
                    })),
                );
            }
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add historical reply to historical thread
router.post("/:id/historical-reply", authMiddleware, async (req, res) => {
    try {
        const { id: parentId } = req.params;
        const { content, authorName, createdAt, avatarUrl } = req.body;

        // The "real" user performing the insert (likely the admin)
        const auth0Id = req.user.sub;

        // Make sure we can parse createdAt
        let finalCreatedAt = new Date();
        if (createdAt) {
            const parsed = new Date(createdAt);
            if (!isNaN(parsed.valueOf())) {
                finalCreatedAt = parsed;
            }
        }

        // Insert the new "imported" reply
        const { data: reply, error } = await supabase
            .from("forum_messages")
            .insert([
                {
                    parent_id: parentId,
                    content,
                    auth0_id: auth0Id, // The row-level “owner” can be you (admin)
                    author: null, // Regular author field is unused for imported
                    is_imported: true,
                    imported_author_name: authorName,
                    imported_date: createdAt, // or a display string
                    imported_avatar_url: avatarUrl, // <-- store in the new column
                    created_at: finalCreatedAt.toISOString(),
                },
            ])
            .select()
            .single();

        if (error) throw error;

        // Return the newly created reply directly
        res.json(reply);
    } catch (error) {
        console.error("Error adding historical reply:", error);
        res.status(500).json({ error: error.message });
    }
});

// Create a new tag
router.post("/tags", authMiddleware, async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Tag name is required" });
    }

    try {
        // Check if the tag already exists
        const { data: existingTag, error: fetchError } = await supabase
            .from("tags")
            .select("*")
            .ilike("name", name.trim()) // Case-insensitive match
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            throw fetchError;
        }

        if (existingTag) {
            return res.status(409).json({ error: "Tag already exists", tag: existingTag });
        }

        // Insert new tag
        const { data: newTag, error: insertError } = await supabase
            .from("tags")
            .insert([{ name: name.trim() }])
            .select()
            .single();

        if (insertError) throw insertError;

        res.status(201).json(newTag);
    } catch (error) {
        console.error("Error creating tag:", error);
        res.status(500).json({ error: error.message });
    }
});

// Delete post
router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const auth0Id = req.user.sub;

    try {
        // Get the post to check ownership
        const { data: post, error: fetchError } = await supabase
            .from("forum_messages")
            .select("auth0_id, parent_id")
            .eq("id", id)
            .single();

        if (fetchError) throw fetchError;
        if (!post) return res.status(404).json({ error: "Post not found" });

        // Get user roles to check for admin status
        const { rows: userRows } = await pool.query("SELECT role FROM users WHERE auth0_id = $1", [
            auth0Id,
        ]);

        const userRoles = userRows[0]?.role || [];
        const isAdmin = userRoles.includes("admin");

        // Only allow deletion if user is post owner or admin
        if (post.auth0_id !== auth0Id && !isAdmin) {
            return res.status(403).json({ error: "Unauthorized to delete this post" });
        }

        // If it's a thread (no parent_id), we need to delete all replies
        if (!post.parent_id) {
            // Delete all reactions to replies
            await supabase.rpc("delete_thread_reactions", { thread_id: id });

            // Delete all replies to this thread
            const { error: deleteRepliesError } = await supabase
                .from("forum_messages")
                .delete()
                .eq("parent_id", id);

            if (deleteRepliesError) throw deleteRepliesError;

            // Delete all tags associated with the thread
            const { error: deleteTagsError } = await supabase
                .from("post_tags")
                .delete()
                .eq("post_id", id);

            if (deleteTagsError) throw deleteTagsError;
        } else {
            // For replies, we need to update the parent thread's reply count
            const { data: parentThread } = await supabase
                .from("forum_messages")
                .select("id")
                .eq("id", post.parent_id)
                .single();

            if (parentThread) {
                await supabase.rpc("update_thread_reply_stats", { thread_id: post.parent_id });
            }
        }

        // Delete reactions to this post
        const { error: deleteReactionsError } = await supabase
            .from("user_reactions")
            .delete()
            .eq("post_id", id);

        if (deleteReactionsError) throw deleteReactionsError;

        // Finally delete the post itself
        const { error: deletePostError } = await supabase
            .from("forum_messages")
            .delete()
            .eq("id", id);

        if (deletePostError) throw deletePostError;

        res.json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: error.message });
    }
});

// Add these routes to your existing posts.js file

// Import a thread from old forum content
router.post("/import-thread", authMiddleware, async (req, res) => {
    const { title, posts } = req.body;
    const userId = req.auth.payload.sub; // current user's auth0_id

    try {
        // Start a transaction
        const { data: threadPost, error: threadError } = await supabase
            .from("forum_messages")
            .insert({
                title,
                content: posts[0].content,
                is_thread_starter: true,
                is_imported: true,
                imported_author_name: posts[0].author,
                imported_date: posts[0].date,
                auth0_id: userId, // Use the current admin's ID for backend functions
                created_at: new Date().toISOString(), // Use current date for created_at
            })
            .select();

        if (threadError) {
            console.error("Error creating imported thread:", threadError);
            return res.status(500).json({ error: "Failed to create thread", details: threadError });
        }

        const threadId = threadPost[0].id;

        // Add all the replies
        for (let i = 1; i < posts.length; i++) {
            const post = posts[i];
            const { error: replyError } = await supabase.from("forum_messages").insert({
                content: post.content,
                is_thread_starter: false,
                parent_id: threadId,
                is_imported: true,
                imported_author_name: post.author,
                imported_date: post.date,
                auth0_id: userId, // Use the current admin's ID for backend functions
                created_at: new Date().toISOString(), // Use current date for created_at
            });

            if (replyError) {
                console.error(`Error creating imported reply ${i}:`, replyError);
                return res
                    .status(500)
                    .json({ error: "Failed to create reply", details: replyError });
            }
        }

        res.status(201).json({ success: true, threadId });
    } catch (error) {
        console.error("Error in import thread route:", error);
        res.status(500).json({ error: "An unexpected error occurred", details: error.message });
    }
});

// Modify your existing thread endpoint to handle imported posts

export default router;
