import type { CreateThreadReplySchema, CreateThreadSchema, EditThreadSchema } from "@repo/shared";
import { InternalServerError, NotFoundError } from "@/types/errors.js";
import type { ThreadsGateway } from "./threads.gateway.js";

export class ThreadsService {
    constructor(private readonly threadsGateway: ThreadsGateway) {}

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

        return this.redactDeletedEntries([data])[0];
    }

    async getAllReplies(parentId: number) {
        const res = await this.threadsGateway.getReplies(parentId);

        // resolve legacy posts
        const data = res.map((e) => {
            if (e.isImported && e.importedAuthorName && e.importedAvatarUrl) {
                return {
                    ...e,
                    author: e.importedAuthorName,
                    authorAvatar: e.importedAvatarUrl,
                };
            }
            return e;
        });

        return this.redactDeletedEntries(data);
    }

    async getByAuthor(authorId: number) {
        return this.threadsGateway.getAllByAuthor(authorId);
    }

    async getThreadCount() {
        const count = await this.threadsGateway.getThreadCount();
        if (!count || count.length === 0) return 0;
        return count[0].value;
    }

    /**
     * Return all threads with data about their most recent reply.
     * @param baseUrl The URL to base the next request to - pass in from `req.baseUrl`.
     * @param page The page number to return.
     * @param limitIn The number of threads to return per page.
     */
    async getAllThreadsWithLatestReplyMetadata(
        baseUrl: string,
        page: number = 1,
        limitIn: number = 10,
    ) {
        const limit = Math.min(limitIn, 20);
        const offset = (page - 1) * limit;

        const [threads, count] = await Promise.all([
            this.threadsGateway.getThreadsWithLatestReplyMetadata(offset, limit),
            this.threadsGateway.getThreadCount(),
        ]);

        const pages = Math.ceil(count[0].value / limit);
        const nextPage = `${baseUrl}?page=${page + 1}&limit=${limit}`;
        const prevPage = `${baseUrl}?page=${page - 1}&limit=${limit}`;

        return {
            data: this.redactDeletedEntries(this.resolveLegacyPosts(threads)),
            pagination: {
                page,
                pages,
                limit,
                total: count,
                nextPage: page < pages ? nextPage : null,
                prevPage: page > 1 ? prevPage : null,
            },
        };
    }

    async createReply(authorId: DbUserId, input: CreateThreadReplySchema) {
        const res = await this.threadsGateway.createReply(authorId, input);
        if (!res || res.length === 0) throw new InternalServerError("Malformed database ouptut");
        return res[0];
    }

    async createThread(authorId: DbUserId, input: CreateThreadSchema) {
        const res = await this.threadsGateway.createThread(authorId, input);
        if (!res || res.length === 0) throw new InternalServerError("Malformed database ouptut");
        return res[0];
    }

    async updateThread(postId: number, input: EditThreadSchema) {
        return this.threadsGateway.updateThread(postId, input);
    }

    async deleteThread(postId: number) {
        return this.threadsGateway.delete(postId);
    }

    private redactDeletedEntries(items: { deletedAt?: string | null; content: unknown }[]) {
        return items.map((item) =>
            item.deletedAt ? { ...item, content: "[ This item has been deleted. ]" } : item,
        );
    }

    private resolveLegacyPosts<T>(
        posts: Array<
            T & {
                isImported?: boolean | null;
                importedAuthorName?: string | null;
                authorName?: string | null;
                importedAvatarUrl?: string | null;
                authorAvatar?: string | null;
            }
        >,
    ) {
        return posts.map((post) => {
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
}
