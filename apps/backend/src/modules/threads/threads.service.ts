import type { CreateThreadReplySchema, CreateThreadSchema, EditThreadSchema } from "@repo/shared";
import { RedactDeletedEntries } from "@/lib/redact-deleted.decorator.js";
import { NotFoundError } from "@/types/errors.js";
import type { ThreadsGateway } from "./threads.gateway.js";

export class ThreadsService {
    constructor(private readonly threadsGateway: ThreadsGateway) {}

    @RedactDeletedEntries
    async getOneById(threadId: number) {
        const [data] = await this.threadsGateway.getOne(threadId);
        if (!data) throw new NotFoundError("Thread not found");
        console.log(data);

        if (data.isImported && data.importedAuthorName && data.importedAvatarUrl) {
            return {
                ...data,
                author: data.importedAuthorName,
                authorAvatar: data.importedAvatarUrl,
            };
        }

        return data;
    }

    @RedactDeletedEntries
    async getAllReplies(parentId: number) {
        const data = await this.threadsGateway.getReplies(parentId);

        // resolve legacy posts
        return data.map((e) => {
            if (e.isImported && e.importedAuthorName && e.importedAvatarUrl) {
                return {
                    ...e,
                    author: e.importedAuthorName,
                    authorAvatar: e.importedAvatarUrl,
                };
            }
            return e;
        });
    }

    @RedactDeletedEntries
    async getByAuthor(authorId: number) {
        return this.threadsGateway.getAllByAuthor(authorId);
    }

    async getThreadCount() {
        return this.threadsGateway.getThreadCount();
    }

    @RedactDeletedEntries
    async getAllThreadsWithLatestReplyMetadata(offset: number = 0, limit: number = 10) {
        const data = await this.threadsGateway.getThreadsWithLatestReplyMetadata(offset, limit);

        // resolve legacy posts
        return data.map((post) => {
            const author =
                post.isImported && post.importedAuthorName
                    ? post.importedAuthorName
                    : (post.authorName ?? "Unknown User");
            const authorAvatar =
                post.isImported && post.importedAvatarUrl
                    ? post.importedAvatarUrl
                    : (post.authorAvatar ?? null);

            return {
                ...post,
                author,
                authorAvatar,
            };
        });
    }

    async createReply(authorId: number, input: CreateThreadReplySchema) {
        return this.threadsGateway.createReply(authorId, input);
    }

    async createThread(authorId: number, input: CreateThreadSchema) {
        return this.threadsGateway.createThread(authorId, input);
    }

    async updateThread(postId: number, input: EditThreadSchema) {
        return this.threadsGateway.updateThread(postId, input);
    }

    async deleteThread(postId: number) {
        return this.threadsGateway.delete(postId);
    }
}
