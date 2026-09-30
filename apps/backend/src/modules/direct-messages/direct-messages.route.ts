import {
    numberOrNumericStringSchema,
    ZCreateConversationSchema,
    ZCreateDirectMessageSchema,
} from "@repo/shared";
import express from "express";
import z from "zod";
import { buildPolicies } from "@/access-control/policies/index.js";
import { db, s } from "@/db/index.js";
import { route } from "@/middleware/route.js";
import { UserGateway } from "../users/users.gateway.js";
import { DirectMessagesDomain } from "./direct-messages.domain.js";
import { DirectMessagesGateway } from "./direct-messages.gateway.js";
import { DirectMessagesService } from "./direct-messages.service.js";

const router = express.Router();
const dmGateway = new DirectMessagesGateway(db, s);
const svc = new DirectMessagesService(dmGateway);
const userGateway = new UserGateway(db, s);
const dmn = new DirectMessagesDomain(dmGateway, userGateway);
const policies = buildPolicies({ dmService: svc });

router.get(
    "/",
    ...route({
        handler: async (req, res) => {
            res.json(await svc.getAllConversations(req.user.id));
        },
    }),
);

router.post(
    "/conversation",
    ...route({
        validate: {
            body: ZCreateConversationSchema,
        },
        handler: async (req, res) => {
            res.json(await svc.createConversation(req.body, req.user.id));
        },
    }),
);

router.get(
    "/conversation/:conversationId",
    ...route({
        validate: {
            params: z.object({
                conversationId: numberOrNumericStringSchema,
            }),
        },
        policy: () => policies.dm.readOne,
        handler: async (req, res) => {
            res.json(await dmn.getConversation(req.params.conversationId));
        },
    }),
);

const PostMessageSchema = {
    body: ZCreateDirectMessageSchema,
    params: z.object({
        conversationId: numberOrNumericStringSchema,
    }),
};
router.post(
    "/conversation/:conversationId",
    ...route({
        validate: PostMessageSchema,
        policy: () => policies.dm.create,
        handler: async (req, res, next) => {
            res.json({
                messageId: await svc.createMessage(req.body, req.user.id).catch(next),
            });
        },
    }),
);

const DeleteMessageSchema = {
    params: z.object({
        conversationId: numberOrNumericStringSchema,
    }),
    query: z.object({
        message_id: numberOrNumericStringSchema,
    }),
};
// delete message from conversation
// `/conversation/123?message_id=456`
/**
 * @todo
 */
router.delete(
    "/conversation/:conversationId",
    ...route({
        validate: DeleteMessageSchema,
        handler: async (req, res) => {
            const NOT_IMPLEMENTED = 501;
            res.status(NOT_IMPLEMENTED).send();
        },
    }),
);

export { router as directMessagesRouter };
