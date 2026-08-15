import type { Conversation, CreateConversation, CreateDirectMessage, DirectMessage, DirectMessageWithAuthor } from "@repo/shared";
import { mutationOptions, type QueryClient, queryOptions } from "@tanstack/react-query";
import type { ProtectedApi } from "#/config/api";
import { handleHttpError } from "#/config/error";

export const conversationKeys = {
    all: () => ["direct-messages"] as const,
    one: (id: number) => ["direct-messages", id] as const,
};

export const conversationQueries = {
    all: (authApi: ProtectedApi) =>
        queryOptions({
            queryKey: conversationKeys.all(),
            queryFn: async () => {
                try {
                    const response = await authApi.get<Conversation[]>("direct-messages");
                    const conversations = response.json();
                    return conversations;
                } catch (error) {
                    throw handleHttpError(error);
                }
            },
            staleTime: 60 * 1000,
        }),
    one: (authApi: ProtectedApi, queryClient: QueryClient, id: number) =>
        queryOptions({
            queryKey: conversationKeys.one(id),
            queryFn: async () => {
                try {
                    const response = await authApi.get<DirectMessageWithAuthor[]>(
                        `direct-messages/conversation/${id}`,
                    );
                    return await response.json();
                } catch (error) {
                    throw handleHttpError(error);
                }
            },
            initialData: () => {
                return queryClient
                    .getQueryData<Conversation[]>(conversationKeys.all())
                    ?.find((c) => c.conversationId === id)?.messages;
            },
            initialDataUpdatedAt: () => {
                return queryClient.getQueryState(conversationKeys.all())?.dataUpdatedAt;
            },
        }),
};

export const conversationMutations = {
    createConversation: (authApi: ProtectedApi) =>
        mutationOptions({
            mutationFn: async (message: CreateConversation) => {
                try {
                    return await authApi
                        .post("direct-messages/conversation", {
                            json: message,
                        })
                        .json();
                } catch (e) {
                    console.error(e);
                    throw handleHttpError(e);
                }
            },
        }),
    createMessage: (authApi: ProtectedApi) =>
        mutationOptions({
            mutationFn: async (message: CreateDirectMessage) => {
                try {
                    return await authApi
                        .post(`direct-messages/conversation/${message.conversationId}`, {
                            json: message,
                        })
                        .json();
                } catch (e) {
                    console.error(e);
                    throw handleHttpError(e);
                }
            },
        }),
    deleteConversation: (authApi: ProtectedApi) =>
        mutationOptions({
            mutationFn: async (id: string) => {
                try {
                    return await authApi.delete(`direct-messages/conversation/${id}`).json();
                } catch (e) {
                    console.error(e);
                    throw handleHttpError(e);
                }
            },
        }),
};
