import type {
    CreateThreadReplySchema,
    CreateThreadSchema,
    Post,
    PostWithAuthor,
    PostWithReplies,
} from "@repo/shared";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { KyInstance } from "ky";
import { handleHttpError } from "#/config/error";
import type { PaginatedResponse, Pagination } from "#/types/apiResponse";

/**
 * An API instance with the proper headers to pass server authorization checks.
 */
type ProtectedApiInstance = KyInstance;

export const threadQueries = {
    all: (pagination: Pagination, api: ProtectedApiInstance) =>
        queryOptions({
            queryKey: ["threads", "all", pagination] as const,
            queryFn: async ({ queryKey }) =>
                await api
                    .get<PaginatedResponse<PostWithReplies[]>>("threads", {
                        searchParams: queryKey[2],
                    })
                    .json(),
            staleTime: 60_000,
        }),
    one: (threadId: string, api: ProtectedApiInstance) =>
        queryOptions({
            queryKey: ["thread", threadId] as const,
            queryFn: async ({ queryKey }) => {
                const [_, id] = queryKey;
                return await api.get<PostWithAuthor>(`threads/${id}`).json();
            },
        }),
    replies: (threadId: string, api: ProtectedApiInstance) =>
        queryOptions({
            queryKey: ["thread", "replies", threadId] as const,
            queryFn: async ({ queryKey }) => {
                const id = queryKey[2];
                return await api.get<PostWithAuthor[]>(`threads/${id}/replies`).json();
            },
        }),
};

export const threadMutations = {
    createThread: (api: ProtectedApiInstance) =>
        mutationOptions({
            mutationKey: ["threads"],
            mutationFn: async (json: CreateThreadSchema) => {
                try {
                    return await api
                        .post<{ id: string }>(`threads`, {
                            body: JSON.stringify(json),
                        })
                        .json();
                } catch (e) {
                    throw handleHttpError(e);
                }
            },
            onSuccess: (_d, _v, _r, ctx) => {
                ctx.client.invalidateQueries({ queryKey: ["threads", "all"] });
            },
        }),
    deleteThreadOrReply: (api: ProtectedApiInstance) =>
        mutationOptions({
            mutationKey: ["threads"],
            mutationFn: async (thread_id: number) => {
                try {
                    return await api.delete(`threads/${thread_id}`);
                } catch (e) {
                    throw handleHttpError(e);
                }
            },
            onSuccess: async (_d, _v, _r, ctx) => {
                await ctx.client.invalidateQueries({ queryKey: ["threads", "all"] });
            },
        }),
    createReply: (api: ProtectedApiInstance) =>
        mutationOptions({
            mutationKey: ["threads"],
            mutationFn: async (json: CreateThreadReplySchema) => {
                try {
                    return await api
                        .post<{ id: string }>(`threads/${json.parent_id}/reply`, {
                            body: JSON.stringify(json),
                        })
                        .json();
                } catch (e) {
                    throw handleHttpError(e);
                }
            },
            onSuccess: (_data, variables, _result, ctx) => {
                ctx.client.invalidateQueries({ queryKey: ["threads", variables.parent_id] });
            },
        }),
};
