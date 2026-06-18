import type { CreateThreadReplySchema, CreateThreadSchema, EditThreadSchema } from "@repo/shared";
import { RedactDeletedEntries } from "@/lib/redact-deleted.decorator.js";
import supabase from "@/lib/supabase.js";
import { NotFoundError } from "@/types/errors.js";
import type { ThreadsGateway } from "./threads.gateway.js";

export class ThreadsService {
    constructor(private readonly threadsGateway: ThreadsGateway) {}

    @RedactDeletedEntries
    async getOneById(threadId: number) {
        const [data] = await this.threadsGateway.getOne(threadId);
        if (!data) throw new NotFoundError("Thread not found");

        // resolve legacy posts
        if (data.isImported) {
            data.author = data.importedAuthorName;
            data.authorAvatar = data.importedAvatarUrl;
        }

        return data;
    }

    @RedactDeletedEntries
    async getAllReplies(parentId: number) {
        const data = await this.threadsGateway.getReplies(parentId);

        // resolve legacy posts
        return data.map((e) => {
            if (e.isImported) {
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

export const threadService = {
    getOneById: async (id: number) => {
        const { data, error } = await supabase
            .from("forum_messages")
            .select("*")
            .eq("id", id)
            .single();
        if (error) throw error;
        return data;
    },
    getAllReplies: async (parent_id: number) => {
        const { data, error } = await supabase
            .from("forum_messages")
            .select("*")
            .eq("parent_id", parent_id)
            .order("created_at", { ascending: true });
        if (error) throw error;
        return data;
    },
    createReply: async (reply: CreateThreadReplySchema) => {
        const { data, error } = await supabase
            .from("forum_messages")
            .insert({
                auth0_id: reply.auth0_id,
                parent_id: reply.parent_id,
                content: reply.content,
                images: reply.images,
            })
            .select("*")
            .single();
        if (error) throw error;
        return data;
    },
    createThread: async (thread: CreateThreadSchema) => {
        const { data, error } = await supabase
            .from("forum_messages")
            .insert({
                title: thread.title,
                auth0_id: thread.auth0_id,
                content: thread.content,
                images: thread.images,
            })
            .select("*")
            .single();
        if (error) throw error;
        return data;
    },
};

export const reactionService = {
    getByThreadId: async (post_id: number) => {
        const { data, count, error } = await supabase
            .from("user_reactions")
            .select("*")
            .eq("post_id", post_id);
        if (error) throw error;
        return { data, count };
    },
    getAllFromThread: async (thread_id: number) => {
        const { data: thread, error: error_0 } = await supabase
            .from("forum_messages")
            .select("*")
            .eq("id", thread_id)
            .single();
        if (error_0) throw error_0;
        const { data: replies, error: error_1 } = await supabase
            .from("forum_messages")
            .select("*")
            .eq("parent_id", thread_id);
        if (error_1) throw error_1;

        const result = [thread, ...replies].reduce((acc, curr) => {
            return acc;
        }, {});
    },
};
