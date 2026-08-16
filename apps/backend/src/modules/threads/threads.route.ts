import {
    numberOrNumericStringSchema,
    ZCreatePostReactionSchema,
    ZCreateThreadReplySchema,
    ZCreateThreadSchema,
} from "@repo/shared";
import express from "express";
import { z } from "zod";
import { db, s } from "@/db/index.js";
import authGuard from "@/middleware/auth.js";
import { route } from "@/middleware/route.js";
import { PostReactionGateway, PostReactionService } from "@/modules/post-reactions/index.js";
import { UserGateway } from "../users/users.gateway.js";
import { ThreadsGateway } from "./threads.gateway.js";
import { ThreadsPolicy } from "./threads.policy.js";
import { ThreadsService } from "./threads.service.js";

const router = express.Router();
const userGateway = new UserGateway(db, s);

const threadGateway = new ThreadsGateway(db, s);
const threadService = new ThreadsService(threadGateway);
const threadPolicy = new ThreadsPolicy(threadGateway, userGateway);

const reactionGateway = new PostReactionGateway(db, s);
const reactionService = new PostReactionService(reactionGateway);

const postsIndexSchema = {
    query: z.object({
        page: numberOrNumericStringSchema.optional().default(1),
        limit: numberOrNumericStringSchema.optional().default(10),
    }),
};

const paramsIdSchema = {
    params: z.object({
        id: numberOrNumericStringSchema,
    }),
};

router.get(
    "/",
    ...route({
        validate: postsIndexSchema,
        handler: async (req, res) => {
            res.json(
                await threadService.getAllThreadsWithLatestReplyMetadata(
                    req.baseUrl,
                    req.query.page,
                    req.query.limit,
                ),
            );
        },
    }),
);

const parentIdSchema = {
    params: z.object({ parentId: numberOrNumericStringSchema }).required(),
};

router.get(
    "/:parentId/replies",
    ...route({
        validate: parentIdSchema,
        handler: async (req, res) => {
            res.json(await threadService.getAllReplies(req.params.parentId));
        },
    }),
);

const threadIdSchema = {
    params: z.object({ threadId: numberOrNumericStringSchema }).required(),
};
router.get(
    "/:threadId",
    ...route({
        validate: threadIdSchema,
        handler: async (req, res) => {
            res.json(await threadService.getOneById(req.params.threadId));
        },
    }),
);

const postThreadReplySchema = {
    params: z.object({ threadId: numberOrNumericStringSchema }).required(),
    body: ZCreateThreadReplySchema,
};
router.post(
    "/:threadId/reply",
    ...route({
        validate: postThreadReplySchema,
        handler: async (req, res) => {
            res.status(201).json(await threadService.createReply(req.user.id, req.body));
        },
    }),
);

router.post(
    "/",
    ...route({
        validate: {
            body: ZCreateThreadSchema,
        },
        handler: async (req, res) => {
            res.status(201).json(await threadService.createThread(req.user.id, req.body));
        },
    }),
);

// Get reactions for a post
router.get(
    "/:id/reactions",
    ...route({
        validate: paramsIdSchema,
        handler: async (req, res) => {
            res.status(200).json(await reactionService.getByPostId(req.params.id));
        },
    }),
);

router.get(
    "/:id/replies/reactions",
    ...route({
        validate: paramsIdSchema,
        handler: async (req, res) => {
            const replies = await threadService.getAllReplies(req.params.id);
            const replyIDs = replies.map((r) => r.id);
            res.json(await reactionService.getAllByPostIds(replyIDs.concat(req.params.id)));
        },
    }),
);

const postReactionsSchema = {
    params: z.object({ postId: z.string() }),
    body: ZCreatePostReactionSchema,
};
router.post(
    "/:postId/reactions",
    ...route({
        validate: postReactionsSchema,
        handler: async (req, res) => {
            await reactionService.toggle(req.user.id, req.body);
            res.status(201).send();
        },
    }),
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

const deleteThreadSchema = z.object({
    id: numberOrNumericStringSchema,
});

///////
router.delete(
    "/:id",
    ...route({
        validate: {
            params: deleteThreadSchema,
        },
        policy: () => threadPolicy.delete(),
        handler: async (req, res) => {
            void (await threadService.deleteThread(req.params.id));
            res.sendStatus(204);
        },
    }),
);

export { router as threadsRouter };
