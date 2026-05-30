import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "#/config/api";
import type { ForumMessage, ForumMessageWithReplyDetails } from "#/types/resources";
import type { Pagination, PaginatedResponse } from "#/types/apiResponse";

export const useAllThreadsOptions = (pagination: Pagination) =>
    queryOptions({
        queryKey: ["threads", "all", pagination] as const,
        queryFn: async ({ queryKey }) =>
            await api
                .get<PaginatedResponse<ForumMessageWithReplyDetails[]>>("posts", {
                    searchParams: queryKey[2],
                })
                .json(),
    });

export const useAllThreadsQuery = (pagination: Pagination) =>
    useQuery(useAllThreadsOptions(pagination));

export const useThreadOptions = (threadId: string) =>
    queryOptions({
        queryKey: ["thread", threadId] as const,
        queryFn: async ({ queryKey }) => {
            const [_, id] = queryKey;
            return await api.get<ForumMessage>(`posts/thread/${id}`).json();
        },
    });

export const useThreadQuery = (threadId: string) => useQuery(useThreadOptions(threadId));

export const useThreadRepliesOptions = (threadId: string) =>
    queryOptions({
        queryKey: ['thread', 'replies', threadId] as const,
        queryFn: async ({ queryKey }) => {
            const id = queryKey[2]
            return await api.get<ForumMessage[]>(`posts/replies/${id}`).json();
        }
    })

export const useThreadRepliesQuery = (threadId: string) => useQuery(useThreadRepliesOptions(threadId))