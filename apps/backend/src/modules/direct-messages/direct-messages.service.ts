import type { CreateConversation, CreateDirectMessage } from "@repo/shared";
import { BadRequestError, InternalServerError, NotFoundError } from "@/types/errors.js";
import type { DirectMessagesGateway } from "./direct-messages.gateway.js";

export class DirectMessagesService {
    constructor(private readonly directMessagesGateway: DirectMessagesGateway) {}

    getAllConversations(userId: number) {
        return this.directMessagesGateway.getAllConversations(userId);
    }

    async getMessageByConversation(conversationId: number) {
        const res = await this.directMessagesGateway.getConversation(conversationId);
        console.log(res)
        if (!res || res.length === 0) throw new NotFoundError("Conversation not found");
        return res;
    }

    getConversationMembersByUserId(conversationId: number, userId: number) {
        return this.directMessagesGateway.getConversationMembersByUserId(conversationId, userId);
    }

    async createConversation(conversation: CreateConversation, userId: number) {
        if (!conversation.participants.includes(userId)) throw new BadRequestError("User is not a participant");
        const res = await this.directMessagesGateway.createConversation(conversation, userId);
        if (!res || res.length === 0) throw new InternalServerError("Malformed database output");
        return res[0].id;
    }

    async createMessage(message: CreateDirectMessage, userId: number) {
        const res = await this.directMessagesGateway.createMessage(message, userId);
        if (!res || res.length === 0) throw new InternalServerError("Malformed database output");
        return res[0].id;
    }
}
