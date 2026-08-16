import { z } from "zod";
import { ZDraftJsJsonSchema, ZTipTapJsonSchema } from "./rich-text.js";
import { ZImageMetadataSchema } from "./thread.js";

export const ZDirectMessageSchema = z.object({
    id: z.number(),
    conversationId: z.number(),
    senderId: z.number(),
    content: z.union([ZTipTapJsonSchema, ZDraftJsJsonSchema]),
    createdAt: z.string(),
    images: z.array(ZImageMetadataSchema).optional().default([]),
});
export type DirectMessage = z.infer<typeof ZDirectMessageSchema>;

export const ZDirectMessageWithAuthorSchema = ZDirectMessageSchema.extend({
    authorId: z.number(),
    authorUsername: z.string(),
    authorAvatarUrl: z.string().nullish(),
});
export type DirectMessageWithAuthor = z.infer<typeof ZDirectMessageWithAuthorSchema>;

export const ConversationSchema = z.object({
    conversationId: z.number(),
    messages: z.array(ZDirectMessageWithAuthorSchema),
    participants: z.array(z.number()),
});

/**
 * A conversation is a list of direct messages between one or more people.
 */
export type Conversation = z.infer<typeof ConversationSchema>;

export const ZCreateDirectMessageSchema = z.object({
    conversationId: z.number(),
    content: z.union([ZTipTapJsonSchema, ZDraftJsJsonSchema]),
    images: z.array(ZImageMetadataSchema).optional().default([]),
});
export type CreateDirectMessage = z.infer<typeof ZCreateDirectMessageSchema>;

export const ZCreateConversationSchema = z.object({
    participants: z.array(z.number()),
    message: ZCreateDirectMessageSchema.omit({ conversationId: true }),
});
export type CreateConversation = z.infer<typeof ZCreateConversationSchema>;
