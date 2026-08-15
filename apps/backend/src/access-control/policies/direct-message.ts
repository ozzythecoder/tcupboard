import type { CreateConversation } from "@repo/shared";
import type { Policy, PolicyFactory } from "../types.js";

export const directMessagePolicy = {
    /**
     * DMs cannot be edited.
     * @deprecated
     * @todo
     */
    edit: () => false,

    /**
     * DMs can only be read from conversations that the user is included in.
     */
    readOne: (({ dmService }) =>
        async (req) => {
            const conversation = await dmService
                .getConversationMembersByUserId(req.params.conversationId, req.user.id)
                .catch(() => []);
            return conversation.some((member) => member.userId === req.user.id);
        }) satisfies PolicyFactory<{ conversationId: number }, unknown, unknown>,

    /**
     * DMs can only be added to conversations that the user is included in.
     */
    create: (({ dmService }) =>
        async (req) => {
            const conversation = await dmService
                .getConversationMembersByUserId(req.params.conversationId, req.user.id)
                .catch(() => []);
            return conversation.some((member) => member.userId === req.user.id);
        }) satisfies PolicyFactory<{ conversationId: number }, unknown, unknown>,

    /**
     * DMs can only be deleted by their authors, from conversations that they are included in.
     * @todo
     */
    delete: (({ dmService }) =>
        async (req) => {
            const conversation = await dmService
                .getConversationMembersByUserId(req.params.conversationId, req.user.id)
                .catch(() => []);

            return !!conversation.some((member) => member.userId === req.user.id);
        }) satisfies PolicyFactory<{ conversationId: number }, { messageId: number }, unknown>,
} as const;
