import type {
    Conversation,
    CreateConversation,
    CreateDirectMessage,
    DirectMessage,
    DirectMessageWithAuthor,
} from "@repo/shared";
import { and, eq, getColumns, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import type { Database, Schema } from "@/db/index.js";

export class DirectMessagesGateway {
    constructor(
        private readonly db: Database,
        private readonly s: Schema,
    ) {}

    async getAllConversations(user_id: number): Promise<Conversation[]> {
        const allParticipants = alias(this.s.conversationParticipants, "all_participants");

        return this.db
            .select({
                conversationId: this.s.conversationParticipants.conversationId.as("convo_id"),
                participants: sql<number[]>`json_agg(distinct ${allParticipants.userId})`,
                messages: sql<Conversation["messages"]>`
                    json_agg(distinct jsonb_build_object(
                        'id', ${this.s.privateMessages.id},
                        'conversationId', ${this.s.privateMessages.conversationId},
                        'authorId', ${this.s.privateMessages.senderId},
                        'content', ${this.s.privateMessages.content},
                        'createdAt', ${this.s.privateMessages.createdAt},
                        'images', ${this.s.privateMessages.images},
                        'authorUsername', ${this.s.users.username},
                        'authorAvatarUrl', ${this.s.users.avatarUrl}
                    ))`,
            })
            .from(this.s.conversationParticipants)
            .where(eq(this.s.conversationParticipants.userId, user_id))
            .innerJoin(
                this.s.privateMessages,
                eq(
                    this.s.privateMessages.conversationId,
                    this.s.conversationParticipants.conversationId,
                ),
            )
            .innerJoin(
                allParticipants,
                eq(allParticipants.conversationId, this.s.privateMessages.conversationId),
            )
            .innerJoin(this.s.users, eq(this.s.users.id, this.s.privateMessages.senderId))
            .groupBy(this.s.conversationParticipants.conversationId);
    }

    async getConversation(conversationId: number): Promise<DirectMessageWithAuthor[]> {
        return this.db
            .selectDistinctOn([this.s.privateMessages.id], {
                ...getColumns(this.s.privateMessages),
                authorId: this.s.privateMessages.senderId,
                authorUsername: this.s.users.username,
                authorAvatarUrl: this.s.users.avatarUrl,
            })
            .from(this.s.privateMessages)
            .innerJoin(this.s.users, eq(this.s.users.id, this.s.privateMessages.senderId))
            .where(eq(this.s.privateMessages.conversationId, conversationId));
    }

    async createConversation(conversation: CreateConversation, userId: number) {
        return this.db.transaction(async (tx) => {
            const [{ id: conversationId }] = await tx
                .insert(this.s.conversations)
                .values({}) // only a primary key
                .returning({ id: this.s.conversations.id });

            const _participants = await tx
                .insert(this.s.conversationParticipants)
                .values(conversation.participants.map((userId) => ({ conversationId, userId })));

            return await tx
                .insert(this.s.privateMessages)
                .values({
                    conversationId: conversationId,
                    senderId: userId,
                    content: conversation.message.content,
                    images: conversation.message.images,
                })
                .returning({ id: this.s.conversations.id });
        });
    }
    async getConversationMembersByUserId(conversationId: number, userId: number) {
        return this.db
            .select()
            .from(this.s.conversationParticipants)
            .where(
                and(
                    eq(this.s.conversationParticipants.conversationId, conversationId),
                    eq(this.s.conversationParticipants.userId, userId),
                ),
            );
    }

    async createMessage(message: CreateDirectMessage, userId: number) {
        return this.db
            .insert(this.s.privateMessages)
            .values({
                ...message,
                senderId: userId,
            })
            .returning({ id: this.s.privateMessages.id });
    }
}
