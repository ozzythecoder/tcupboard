import { api, createApi } from "#/lib/api";
import type { ForumMessageWithReplyDetails, Tag } from "#/types/resources";
import type { PaginatedResponse } from "#/types/apiResponse";
import { useAuth0 } from "@auth0/auth0-react";
import { useMemo } from "react";

type AllPostsParams = {
    page: string;
    limit: string;
    tags?: Tag[];
};

export const postsService = {
    /**
     * Retrieves all forum messages, with details of each thread's latest reply.
     */
    async allWithReplyDetails({ page, limit, tags }: AllPostsParams) {
        const params = new URLSearchParams({ page, limit });
        if (tags) params.append("tags", tags.map((t) => t.name).join(","));

        return await api.get<PaginatedResponse<ForumMessageWithReplyDetails[]>>(
            `/posts?${params.toString()}`,
        );
    },
    async one(id: string) {
        return await api.get(`/posts/${id}`);
    },
    async markRead(id: string) {
        return await api.post(`/read-status/${id}`)
    },
    async readStatus(ids: string[]) {
        const params = new URLSearchParams({ threadIds: ids.join(',') })
        return await api.get(`/read-status?${params.toString()}`)
    }
};

export function usePostsService() {
    const { getAccessTokenSilently } = useAuth0();
    const _api = useMemo(() => createApi(getAccessTokenSilently), [getAccessTokenSilently])

    return {
        async allWithReplyDetails({ page, limit, tags }: AllPostsParams) {
            const params = new URLSearchParams({ page, limit });
            if (tags) params.append("tags", tags.map((t) => t.name).join(","));
    
            return await _api.get<PaginatedResponse<ForumMessageWithReplyDetails[]>>(
                `/posts?${params.toString()}`,
            );
        },
        async one(id: string) {
            return await _api.get(`/posts/${id}`);
        },
        async markRead(id: string) {
            return await _api.post(`/read-status/${id}`)
        },
        async readStatus(ids: string[]) {
            const params = new URLSearchParams({ threadIds: ids.join(',') })
            return await _api.get(`/read-status?${params.toString()}`)
        }
    }
}
