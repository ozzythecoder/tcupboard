import type { User } from "@repo/shared";
import { queryOptions } from "@tanstack/react-query";
import type { ProtectedApi } from "#/config/api";
import { handleHttpError } from "#/config/error";

const ONE_HOUR = 1000 * 60 * 60;

export const userKeys = {
    all: ["users"] as const,
    me: ["users", "me"] as const,
    id: (id: number) => [...userKeys.all, id] as const,
} as const;

export const userQueries = {
    getMe: (api: ProtectedApi) =>
        queryOptions({
            queryKey: userKeys.me,
            queryFn: async () => {
                return await api
                    .get<User>("users/me")
                    .json()
                    .catch((e) => {
                        throw handleHttpError(e);
                    });
            },
            staleTime: ONE_HOUR,
        }),
    getOneById: (id: number, api: ProtectedApi) =>
        queryOptions({
            queryKey: userKeys.id(id),
            queryFn: async ({ queryKey }) => {
                const id = queryKey[1];
                return await api
                    .get<User>(`users/profile/${id}`)
                    .json()
                    .catch((e) => {
                        throw handleHttpError(e);
                    });
            },
            staleTime: ONE_HOUR,
        }),
};
