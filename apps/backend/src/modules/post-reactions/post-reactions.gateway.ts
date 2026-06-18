import type { CreatePostReaction } from "@repo/shared";
import { and, eq, getTableColumns, inArray } from "drizzle-orm";
import type { Database, Schema } from "@/db/index.js";

export class PostReactionGateway {
    constructor(
        private readonly db: Database,
        private readonly s: Schema,
    ) {}

    async getByPostId(postId: number) {
        return this.db
            .select({
                ...getTableColumns(this.s.postReactions),
                username: this.s.users.username,
            })
            .from(this.s.postReactions)
            .leftJoin(this.s.users, eq(this.s.users.id, this.s.postReactions.userId))
            .where((p) => eq(p.postId, postId));
    }

    async getAllByPostIds(postIds: number[]) {
        return this.db
            .select({
                ...getTableColumns(this.s.postReactions),
                username: this.s.users.username,
            })
            .from(this.s.postReactions)
            .leftJoin(this.s.users, eq(this.s.users.id, this.s.postReactions.userId))
            .where(inArray(this.s.postReactions.postId, postIds));
    }

    async create(input: CreatePostReaction & { userId: number }) {
        return this.db.insert(this.s.postReactions).values(input).returning();
    }

    async toggle(input: CreatePostReaction & { userId: number }) {
        return this.db.transaction(async (tx) => {
            const [reactionExists] = await tx
                .select()
                .from(this.s.postReactions)
                .where((r) =>
                    and(
                        eq(r.postId, input.postId),
                        eq(r.userId, input.userId),
                        eq(r.type, input.type),
                    ),
                );
            if (reactionExists) {
                await tx
                    .delete(this.s.postReactions)
                    .where(
                        eq(this.s.postReactions.id, reactionExists.id)
                    )
            } else {
                await tx.insert(this.s.postReactions).values(input).returning({
                    id: this.s.postReactions.id,
                });
            }
        });
    }

    async delete(reactionId: number) {
        return this.db.delete(this.s.postReactions).where(eq(this.s.postReactions.id, reactionId));
    }
}
