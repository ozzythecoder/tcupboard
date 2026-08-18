import type { Campaign } from "@repo/shared";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "#/config/api";
import { handleHttpError } from "#/config/error";

export const campaignKeys = {
    all: ["campaigns"] as const,
    one: (slug: string) => [...campaignKeys.all, slug] as const,
    highlighted: () => [...campaignKeys.all, "highlighted"] as const,
};

const ONE_HOUR = 60 * 60 * 1000;

export const campaignQueries = {
    all: () =>
        queryOptions({
            queryKey: campaignKeys.all,
            queryFn: async () => {
                try {
                    const res = await api.get<Campaign[]>("campaigns");
                    return await res.json();
                } catch (error) {
                    throw handleHttpError(error);
                }
            },
        }),
    one: (slug: string, preview?: boolean) =>
        queryOptions({
            queryKey: campaignKeys.one(slug),
            queryFn: async () => {
                try {
                    const prv = preview ? "?preview=true" : "";
                    const res = await api.get<Campaign>(`campaigns/${slug}${prv}`);
                    return await res.json();
                } catch (error) {
                    throw handleHttpError(error);
                }
            },
            staleTime: ONE_HOUR,
        }),
    highlighted: () =>
        queryOptions({
            queryKey: campaignKeys.highlighted(),
            queryFn: async () => {
                try {
                    const res = await api.get<Campaign>("campaigns/highlight");
                    return await res.json();
                } catch (error) {
                    throw handleHttpError(error);
                }
            },
            staleTime: ONE_HOUR,
            retry: false,
        }),
};

export const useCampaignQuery = ({ throwOnError = true }: { throwOnError?: boolean } = {}) =>
    useQuery({
        ...campaignQueries.all(),
        throwOnError,
    });
