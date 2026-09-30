import type { CreateConversation, CreateDirectMessage } from "@repo/shared";
import { BadRequestError, InternalServerError, NotFoundError } from "@/types/errors.js";
import type { DirectMessagesGateway } from "./direct-messages.gateway.js";

export class DirectMessagesService {
    constructor(private readonly directMessagesGateway: DirectMessagesGateway) {}

    getAllConversations(userId: number) {
        return this.directMessagesGateway.getAllConversations(userId);
    }

    async getMessagesByConversation(conversationId: number) {
        const conversationRes = await this.directMessagesGateway.getConversation(conversationId);
        if (!conversationRes || conversationRes.length === 0)
            throw new NotFoundError("Conversation not found");
        const conversation = conversationRes[0];
        const participantsRes =
            await this.directMessagesGateway.getConversationParticipants(conversationId);
        const participants = participantsRes.find((p) => p.conversationId === conversationId);
        if (!participants) throw new NotFoundError("Participants not found");


        return {
            participants,
            ...conversation,
        };
    }

    getConversationParticipants(conversationId: number) {
        return this.directMessagesGateway.getConversationParticipants(conversationId);
    }

    getConversationMembersByUserId(conversationId: number, userId: number) {
        return this.directMessagesGateway.getConversationMembersByUserId(conversationId, userId);
    }

    async createConversation(conversation: CreateConversation, userId: number) {
        if (!conversation.participants.includes(userId))
            throw new BadRequestError("User is not a participant");
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
