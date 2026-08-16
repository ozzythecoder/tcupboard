import type {
    CreateThreadReplySchema,
    CreateThreadSchema,
    EditThreadReplySchema,
    EditThreadSchema,
} from "@repo/shared";
import { count, eq, getColumns, sql } from "drizzle-orm";
import type { Database, Schema } from "@/db/index.js";

export class ThreadsGateway {
    constructor(
        private readonly db: Database,
        private readonly s: Schema,
    ) {}

    async getOne(id: number) {
        return this.db
            .select({
                ...getColumns(this.s.posts),
                author: this.s.users.username,
                authorAvatar: this.s.users.avatarUrl,
            })
            .from(this.s.posts)
            .leftJoin(this.s.users, eq(this.s.users.id, this.s.posts.authorId))
            .where((p) => eq(p.id, id));
    }

    async getAll() {
        return this.db
            .select()
            .from(this.s.posts)
            .orderBy((p) => p.createdAt);
    }

    async getThreadCount() {
        return this.db
            .select({
                value: count(),
            })
            .from(this.s.postsWithReplies);
    }

    async getThreadsWithLatestReplyMetadata(offset: number, limit: number) {
        return this.db.select().from(this.s.postsWithReplies).offset(offset).limit(limit);
    }

    async getReplies(parent_thread_id: number) {
        return await this.db
            .select({
                ...getColumns(this.s.posts),
                author: this.s.users.username,
                authorAvatar: this.s.users.avatarUrl,
            })
            .from(this.s.posts)
            .leftJoin(this.s.users, eq(this.s.users.id, this.s.posts.authorId))
            .where((p) => eq(p.parentId, parent_thread_id))
            .orderBy((p) => p.createdAt);
    }

    async getAllByAuthor(author_id: number) {
        return await this.db
            .select()
            .from(this.s.posts)
            .where((p) => eq(p.authorId, author_id));
    }

    async createThread(authorId: number, input: CreateThreadSchema) {
        return await this.db
            .insert(this.s.posts)
            .values({
                ...input,
                authorId,
                parentId: undefined,
            })
            .returning({
                id: this.s.posts.id
            });
    }

    async updateThread(postId: number, input: EditThreadSchema) {
        return await this.db.update(this.s.posts).set(input).where(eq(this.s.posts.id, postId));
    }

    async createReply(authorId: number, input: CreateThreadReplySchema) {
        return await this.db
            .insert(this.s.posts)
            .values({
                ...input,
                authorId,
                title: undefined,
            })
            .returning({
                id: this.s.posts.id
            });
    }

    async updateReply(postId: number, input: EditThreadReplySchema) {
        return await this.db.update(this.s.posts).set(input).where(eq(this.s.posts.id, postId));
    }

    async delete(postId: number) {
        return await this.db
            .update(this.s.posts)
            .set({
                deletedAt: sql`current_timestamp`,
            })
            .where(eq(this.s.posts.id, postId));
    }
}
