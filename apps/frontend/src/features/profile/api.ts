import { queryOptions } from "@tanstack/react-query";
import type { KyInstance } from "ky";
import { handleHttpError } from "#/config/error";
import type { Auth0User } from "#/types/resources";

export const profileQueries = {
    one: (id: string, api: KyInstance) =>
        queryOptions({
            queryKey: ["profile", id],
            queryFn: async ({ queryKey }) => {
                const userId = queryKey[1];
                return await api
                    .get<Auth0User>(`users/profile/${userId}`)
                    .json()
                    .catch((e) => {
                        throw handleHttpError(e);
                    });
            },
        }),
    me: (api: KyInstance) =>
        queryOptions({
            queryKey: ["profile", "me"],
            queryFn: async () => {
                return await api
                    .get<Auth0User>("users/me")
                    .json()
                    .catch((e) => {
                        throw handleHttpError(e);
                    });
            },
        }),
};
