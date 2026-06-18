import {
    ZCreatePostReactionSchema,
    ZCreateThreadReplySchema,
    ZCreateThreadSchema,
} from "@repo/shared";
import express, { type Request } from "express";
import { z } from "zod";
import { accessControl } from "@/access-control/middleware.js";
import { threadPolicy } from "@/access-control/policies/thread.js";
import pool from "@/config/db.js";
import { db, s } from "@/db/index.js";
import supabase from "@/lib/supabase.js";
import authGuard from "@/middleware/auth.js";
import { pipeMiddleware as middleware } from "@/middleware/pipe.js";
import { validatePathParams, validateRequest } from "@/middleware/validator.js";
import { PostReactionGateway, PostReactionService } from "@/modules/post-reactions/index.js";
import { UnauthorizedError } from "@/types/errors.js";
import { ThreadsGateway } from "./threads.gateway.js";
import { ThreadsService } from "./threads.service.js";

const router = express.Router();
const threadGateway = new ThreadsGateway(db, s);
const threadService = new ThreadsService(threadGateway);

const reactionGateway = new PostReactionGateway(db, s);
const reactionService = new PostReactionService(reactionGateway);

const postsIndexSchema = z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
});

router.get(
    "/",
    validateRequest({
        query: postsIndexSchema,
    }),
    async (req, res, next) => {
        try {
            const q = req.query;

            const page = q.page ? parseInt(q.page, 10) : 1;
            const limit = q.limit ? Math.min(20, parseInt(q.limit, 10)) : 10;
            const offset = (page - 1) * limit;

            const [threads, countResult] = await Promise.all([
                threadService.getAllThreadsWithLatestReplyMetadata(offset, limit),
                threadService.getThreadCount(),
            ]);

            if (countResult.length === 0) {
                return res.status(500).json({ message: "Internal error when getting messages." });
            }

            const count = countResult[0].value;
            const pages = Math.ceil(count / limit);
            const nextPage = `${req.baseUrl}?page=${page + 1}&limit=${limit}`;
            const prevPage = `${req.baseUrl}?page=${page - 1}&limit=${limit}`;

            return res.json({
                data: threads,
                pagination: {
                    page,
                    limit,
                    total: count,
                    pages,
                    nextPage: page < pages ? nextPage : null,
                    prevPage: page > 1 ? prevPage : null,
                },
            });
        } catch (error) {
            console.error("Error fetching posts:", error);
            next(error);
        }
    },
);

const validateParentId = validateRequest({
    params: z.object({ parentId: z.coerce.number() }).required(),
});

router.get(
    "/:parentId/replies",
    ...middleware(authGuard).pipe(validateParentId).build(),
    async (req, res, next) => {
        const { parentId } = req.params;
        try {
            const data = await threadService.getAllReplies(parentId);
            return res.json(data);
        } catch (e) {
            console.error("ERROR [/posts/replies/:parentId]:", e);
            next(e);
        }
    },
);

router.get(
    "/:threadId",
    ...middleware(authGuard)
        .pipe(validateRequest({ params: z.object({ threadId: z.coerce.number() }) }))
        .build(),
    async (req, res, next) => {
        const { threadId } = req.params;
        try {
            const data = await threadService.getOneById(threadId);
            res.json(data);
        } catch (error) {
            console.error("Error in getThreadById:", error);
            next(error);
        }
    },
);

router.post(
    "/:threadId/reply",
    ...middleware(authGuard)
        .pipe(
            validateRequest({
                params: z.object({ threadId: z.coerce.number() }).required(),
                body: ZCreateThreadReplySchema,
            }),
        )
        .build(),
    async (req, res) => {
        const auth0_id = req.user?.sub;
        if (!auth0_id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        try {
            const data = await threadService.createReply(req.body);
            res.status(201).json({ id: data.id });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
);

router.post(
    "/",
    ...middleware(authGuard)
        .pipe(validateRequest({ body: ZCreateThreadSchema }))
        .build(),
    async (req, res) => {
        // TODO: support for tags

        const auth0Id = req.user?.sub;
        if (!auth0Id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        console.log(typeof req.body.content);

        try {
            const thread = await threadService.createThread(req.body);
            res.status(201).json({ id: thread.id });
        } catch (error) {
            console.error("Error creating post:", error);
            res.status(500).json({ error: error.message });
        }
    },
);

// Get reactions for a post
router.get(
    "/:id/reactions",
    ...middleware(authGuard)
        .pipe(
            validateRequest({
                params: z.object({ id: z.coerce.number() }),
            }),
        )
        .build(),
    async (req, res, next) => {
        const { id } = req.params;
        try {
            const
                reactions = await reactionService.getByPostId(id);
            res.status(200).json(reactions);
        } catch (error) {
            next(error);
        }
    },
);

router.get(
    "/:id/replies/reactions",
    ...middleware(authGuard)
        .pipe(
            validateRequest({
                params: z.object({ id: z.coerce.number() }),
            }),
        )
        .build(),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const replies = await threadService.getAllReplies(id);
            const replyIDs = replies.map((r) => r.id);
            const reactions = await reactionService.getAllByPostIds(replyIDs.concat(id));

            res.json(reactions);
        } catch (e) {
            console.error(e);
            next(e);
        }
    },
);

const post_PostId_Reactions = {
    params: z.object({ postId: z.string() }),
    body: ZCreatePostReactionSchema,
};

router.post(
    "/:postId/reactions",
    ...middleware(authGuard).pipe(validateRequest(post_PostId_Reactions)).build(),
    async (req, res, next) => {
        try {
            if (!req.user) throw new UnauthorizedError("No user found");
            const userId = req.user.id;
            await reactionService.toggle(userId, req.body);
            return res.status(201).send();
        } catch (error) {
            console.error(error);
            next(error);
        }
    },
);

router.put("/edit/:id", authGuard, async (req, res) => {
    return res.status(501);
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
router.post("/:id/historical-reply", authGuard, async (req, res) => {
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
router.post("/tags", authGuard, async (req, res) => {
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
router.delete(
    "/:id",
    authGuard,
    validatePathParams(z.object({ id: z.string() })),
    accessControl(() => threadPolicy.delete),
    async (req: Request<{ id: string }>, res) => {
        // TODO:
        // - cumbersome delete logic could be handled by proper references & cascades in postgres

        const id = parseInt(req.params.id, 10);
        const auth0Id = req.user?.sub;

        if (!auth0Id || !req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        try {
            // Get the post to check ownership
            const { data: post, error: fetchError } = await supabase
                .from("forum_messages")
                .select("auth0_id, parent_id")
                .eq("id", id)
                .single();

            if (fetchError) throw fetchError;
            if (!post) return res.status(404).json({ error: "Post not found" });

            const roles = req.user["https://tcupboard.org/roles"];

            const isAdmin = roles.includes("admin");

            // Only allow deletion if user is post owner or admin
            if (post.auth0_id !== auth0Id && !isAdmin) {
                return res
                    .status(403)
                    .json({ message: "You are not allowed to delete this post." });
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
    },
);

// Add these routes to your existing posts.js file

// Import a thread from old forum content
router.post("/import-thread", authGuard, async (req, res) => {
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

export default router;
