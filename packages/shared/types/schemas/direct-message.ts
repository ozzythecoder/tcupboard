import { z } from "zod";
import { ZDraftJsJsonSchema, ZTipTapJsonSchema } from "./rich-text.js";
import { ZImageMetadataSchema } from "./thread.js";
import { numberOrNumericStringSchema } from "./utils.ts";

export const ZDirectMessageSchema = z.object({
    id: z.number(),
    conversationId: z.number(),
    senderId: z.number(),
    content: z.union([ZTipTapJsonSchema, ZDraftJsJsonSchema]),
    createdAt: z.string(),
    images: z.array(ZImageMetadataSchema).optional().default([]),
});
export type DirectMessage = z.infer<typeof ZDirectMessageSchema>;

export const ZConversationParticipantSchema = z.object({
    authorId: z.number(),
    authorUsername: z.string(),
    authorAvatarUrl: z.string().nullish(),
})
export type ConversationParticipant = z.infer<typeof ZConversationParticipantSchema>;

export const ZDirectMessageWithAuthorSchema = ZDirectMessageSchema.extend(ZConversationParticipantSchema.shape);
export type DirectMessageWithAuthor = z.infer<typeof ZDirectMessageWithAuthorSchema>;

export const ConversationSchema = z.object({
    conversationId: z.number(),
    messages: z.array(ZDirectMessageWithAuthorSchema),
});

/**
 * A conversation is a list of direct messages between one or more people.
 */
export type Conversation = z.infer<typeof ConversationSchema>;

export type ConversationWithParticipants = Conversation & { participants: ConversationParticipant[] };

export const ZCreateDirectMessageSchema = z.object({
    conversationId: z.number(),
    content: z.union([ZTipTapJsonSchema, ZDraftJsJsonSchema]),
    images: z.array(ZImageMetadataSchema).optional().default([]),
});
export type CreateDirectMessage = z.infer<typeof ZCreateDirectMessageSchema>;

export const ZCreateConversationSchema = z.object({
    participants: z.array(numberOrNumericStringSchema).min(1),
    initialMessage: ZCreateDirectMessageSchema.omit({ conversationId: true })
})
export type CreateConversation = z.infer<typeof ZCreateConversationSchema>
