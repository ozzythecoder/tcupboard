import type { TcupUpdate } from "@repo/shared";
import { queryOptions } from "@tanstack/react-query";
import { api } from "#/config/api";
import { handleHttpError } from "#/config/error";

const ONE_MINUTE = 60 * 1000;

export const updateKeys = {
    all: ["tcup-updates"] as const,
    one: (id: string) => ["tcup-updates", id] as const,
};

export const updateQueries = {
    all: () =>
        queryOptions({
            queryKey: updateKeys.all,
            queryFn: async () => {
                const response = await api.get<TcupUpdate[]>(`updates`);
                return await response.json();
            },
            staleTime: 60 * ONE_MINUTE,
        }),
    one: (id: string, preview: boolean = false) =>
        queryOptions({
            queryKey: updateKeys.one(id),
            queryFn: async ({ queryKey }) => {
                try {
                    const [_, updateId] = queryKey;
                    const p = preview ? "?preview=true" : "";
                    const response = await api.get<TcupUpdate>(`updates/${updateId}${p}`);
                    return await response.json();
                } catch (e) {
                    throw handleHttpError(e);
                }
            },
            staleTime: 60 * ONE_MINUTE,
        }),
};
