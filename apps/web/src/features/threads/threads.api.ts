import type {
    CreateThreadReplySchema,
    CreateThreadSchema,
    PostWithAuthor,
    PostWithReplies,
} from "@repo/shared";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { KyInstance } from "ky";
import { handleHttpError } from "#/config/error";
import type { PaginatedResponse } from "#/types/apiResponse";

/**
 * An API instance with the proper headers to pass server authorization checks.
 */
type ProtectedApiInstance = KyInstance;

const ONE_MINUTE = 1000 * 60;

const threadKeys = {
    all: ["threads"] as const,
    paginated: (pagination: { page: number; limit?: 10 }) =>
        [...threadKeys.all, pagination] as const,
    one: (id: number) => [...threadKeys.all, "detail", id] as const,
    withReplies: (id: number) => [...threadKeys.all, "detail", "replies", id] as const,
};

export const threadQueries = {
    all: (pagination: { page: number }, api: ProtectedApiInstance) =>
        queryOptions({
            queryKey: threadKeys.paginated(pagination),
            queryFn: async ({ queryKey }) =>
                await api
                    .get<PaginatedResponse<PostWithReplies[]>>("threads", {
                        searchParams: queryKey[1],
                    })
                    .json(),
            staleTime: ONE_MINUTE,
        }),
    one: (threadId: number, api: ProtectedApiInstance) =>
        queryOptions({
            queryKey: threadKeys.one(threadId),
            queryFn: async ({ queryKey }) => {
                const id = queryKey[2];
                return await api.get<PostWithAuthor>(`threads/${id}`).json();
            },
            staleTime: ONE_MINUTE * 0.5,
        }),
    replies: (threadId: number, api: ProtectedApiInstance) =>
        queryOptions({
            queryKey: threadKeys.withReplies(threadId),
            queryFn: async ({ queryKey }) => {
                const id = queryKey[3];
                return await api.get<PostWithAuthor[]>(`threads/${id}/replies`).json();
            },
            staleTime: ONE_MINUTE * 0.5,
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
                ctx.client.invalidateQueries({ queryKey: threadKeys.all });
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
                await ctx.client.invalidateQueries({ queryKey: threadKeys.all });
            },
        }),
    createReply: (api: ProtectedApiInstance) =>
        mutationOptions({
            mutationKey: ["threads"],
            mutationFn: async (json: CreateThreadReplySchema) => {
                try {
                    return await api
                        .post<{ id: string }>(`threads/${json.parentId}/reply`, {
                            body: JSON.stringify(json),
                        })
                        .json();
                } catch (e) {
                    throw handleHttpError(e);
                }
            },
            onSuccess: (_data, variables, _result, ctx) => {
                ctx.client.invalidateQueries({ queryKey: threadKeys.withReplies(variables.parentId) });
            },
        }),
};
