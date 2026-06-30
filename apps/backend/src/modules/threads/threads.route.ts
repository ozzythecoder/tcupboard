import {
    ZCreatePostReactionSchema,
    ZCreateThreadReplySchema,
    ZCreateThreadSchema,
} from "@repo/shared";
import express from "express";
import { z } from "zod";
import { db, s } from "@/db/index.js";
import authGuard from "@/middleware/auth.js";
import { pipeMiddleware as middleware } from "@/middleware/pipe.js";
import { validateRequest } from "@/middleware/validator.js";
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
    page: z
        .string()
        .optional()
        .refine((v) => !v || parseInt(v, 10)),
    limit: z
        .string()
        .optional()
        .refine((v) => !v || parseInt(v, 10)),
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
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const id = req.user.id;

        try {
            const [data] = await threadService.createReply(id, req.body);
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
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        try {
            const [thread] = await threadService.createThread(req.user.id, req.body);
            res.status(201).json({ id: thread.id });
        } catch (error) {
            console.error("Error creating post:", error);
            res.status(500).json({ error: (error as any).message });
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
            const reactions = await reactionService.getByPostId(id);
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

router.put("/edit/:id", authGuard, async (_req, res) => {
    res.status(501).send();
    // const { id } = req.params;
    // const { title, content, tags, userId, createdAt, images } = req.body;

    // try {
    //     // Get user info
    //     const { rows: userRows } = await pool.query(
    //         "SELECT username FROM users WHERE auth0_id = $1",
    //         [userId],
    //     );

    //     if (!userRows.length) {
    //         return res.status(404).json({ error: "User not found" });
    //     }

    //     // Update post
    //     const { data: post, error } = await supabase
    //         .from("forum_messages")
    //         .update({
    //             title,
    //             content,
    //             auth0_id: userId,
    //             author: userRows[0].username,
    //             created_at: createdAt,
    //             is_edited: true,
    //             images: images || undefined,
    //         })
    //         .eq("id", id)
    //         .select()
    //         .single();

    //     if (error) throw error;

    //     // Update tags
    //     if (tags) {
    //         // Remove existing tags
    //         await supabase.from("post_tags").delete().eq("post_id", id);

    //         // Add new tags
    //         if (tags.length > 0) {
    //             await supabase.from("post_tags").insert(
    //                 tags.map((tagId) => ({
    //                     post_id: id,
    //                     tag_id: tagId,
    //                 })),
    //             );
    //         }
    //     }

    //     res.json(post);
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
});

////////
// router.post('/tags')

///////
// router.delete('/:id')

export { router as threadsRouter };
