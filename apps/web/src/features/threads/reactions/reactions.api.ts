import {
    type CreatePostReaction,
    type PostReactionWithUsername,
    ZCreatePostReactionSchema,
} from "@repo/shared";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { ProtectedApi } from "#/config/api";
import { handleHttpError } from "#/config/error";

export const reactionQueries = {
    getByPostId: (postId: number, api: ProtectedApi) =>
        queryOptions({
            queryKey: ["reaction", postId],
            queryFn: async ({ queryKey }) => {
                const id = queryKey[1];
                try {
                    return await api
                        .get<PostReactionWithUsername[]>(`threads/${id}/reactions`)
                        .json();
                } catch (e) {
                    throw handleHttpError(e);
                }
            },
        }),
    getAllForThread: (threadID: number, api: ProtectedApi) =>
        queryOptions({
            queryKey: ["reaction", "replies", threadID],
            queryFn: async ({ queryKey }) => {
                const id = queryKey[2];
                try {
                    return await api
                        .get<PostReactionWithUsername[]>(`/threads/${id}/replies/reactions`)
                        .json();
                } catch (e) {
                    throw handleHttpError(e);
                }
            },
        }),
};

export const reactionMutations = {
    toggleReaction: (api: ProtectedApi) =>
        mutationOptions({
            mutationKey: ["reactions"],
            mutationFn: async (createReactionBody: CreatePostReaction) => {
                try {
                    const body = ZCreatePostReactionSchema.safeParse(createReactionBody);
                    if (body.error) throw body.error;
                    return await api.post(`threads/${createReactionBody.postId}/reactions`, {
                        body: JSON.stringify(body.data),
                    });
                } catch (e) {
                    throw handleHttpError(e);
                }
            },
            onMutate: async (vars, ctx) => {
                // optimistic update
                const userId = vars.userId;
                const key = ["reaction", vars.postId];
                await ctx.client.cancelQueries({ queryKey: key });
                const previous = ctx.client.getQueryData(key);
                ctx.client.setQueryData(key, (old: PostReactionWithUsername[]) => {
                    const existingReaction = old.find((e) => e.userId === Number(userId));
                    if (existingReaction) {
                        return old.filter((e) => e.userId !== Number(userId));
                    }
                    return [...old, { id: vars.postId, userId: Number(userId), type: vars.type }];
                });

                return { previous, postId: vars.postId };
            },
            onError: (_err, _data, onMutateRes, ctx) => {
                const key = ["reaction", onMutateRes?.postId];
                ctx.client.setQueryData(key, onMutateRes?.previous);
            },
            onSettled: async (_data, _err, vars, _onMutateRes, ctx) => {
                ctx.client.invalidateQueries({ queryKey: ["reaction", vars.postId] });
            },
        }),
};
