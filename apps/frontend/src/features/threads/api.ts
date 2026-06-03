import { mutationOptions, queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { api } from "#/config/api";
import type { ForumMessage, ForumMessageWithReplyDetails } from "#/types/resources";
import type { Pagination, PaginatedResponse } from "#/types/apiResponse";
import { JSONContent } from "@tiptap/react";

export const useAllThreadsOptions = (pagination: Pagination) =>
    queryOptions({
        queryKey: ["threads", "all", pagination] as const,
        queryFn: async ({ queryKey }) =>
            await api
                .get<PaginatedResponse<ForumMessageWithReplyDetails[]>>("posts", {
                    searchParams: queryKey[2],
                })
                .json(),
        staleTime: 60_000,
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
        queryKey: ["thread", "replies", threadId] as const,
        queryFn: async ({ queryKey }) => {
            const id = queryKey[2];
            return await api.get<ForumMessage[]>(`posts/replies/${id}`).json();
        },
    });

export const useThreadRepliesQuery = (threadId: string) =>
    useQuery(useThreadRepliesOptions(threadId));

export const useNewReplyOptions = mutationOptions({
    mutationKey: ["threads"],
    mutationFn: async (json: JSONContent) => {
        return await api.post(`posts`, { body: JSON.stringify(json) });
    },
    onSuccess: (data, variables, result, ctx) => {
        console.log("nice");
    },
    onError: (error) => {
        console.log("uh oh", error);
    },
});

export const useNewReplyMutation = () => useMutation(useNewReplyOptions);
