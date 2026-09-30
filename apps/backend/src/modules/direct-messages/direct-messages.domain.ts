import type { ConversationParticipant, ConversationWithParticipants } from "@repo/shared";
import { BadRequestError, NotFoundError } from "@/types/errors.js";
import type { UserGateway } from "../users/users.gateway.js";
import type { DirectMessagesGateway } from "./direct-messages.gateway.js";

export class DirectMessagesDomain {
    constructor(
        private readonly directMessagesGateway: DirectMessagesGateway,
        private readonly userGateway: UserGateway,
    ) {}

    /**
     * # Use Case
     * Get a conversation with messages and participant IDs, names, and avatars
     */
    async getConversation(conversationId: number): Promise<ConversationWithParticipants> {
        const conversationRes = await this.directMessagesGateway.getConversation(conversationId);
        if (!conversationRes || conversationRes.length === 0)
            throw new NotFoundError("Conversation not found");

        const participantIdsRes =
            await this.directMessagesGateway.getConversationParticipants(conversationId);
        if (!participantIdsRes || participantIdsRes.length === 0)
            throw new NotFoundError("Conversation not found");

        const participantsRes = await this.userGateway.getManyByIds(
            participantIdsRes[0].participants,
        );
        if (!participantsRes || participantsRes.length === 0)
            throw new BadRequestError("Conversation not found");

        const participants: ConversationParticipant[] = participantsRes.map((p) => ({
            authorId: p.id,
            authorUsername: p.username,
            authorAvatarUrl: p.avatarUrl,
        }));

        return {
            conversationId,
            messages: conversationRes,
            participants,
        };
    }
}
