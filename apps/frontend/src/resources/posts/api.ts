import { api } from "../../lib/api";

type AllPostsParams = {
    page: string;
    limit: string;
    tags?: string[];
}

export const postsService = {
    async all({ page, limit, tags }: AllPostsParams) {
        const params = new URLSearchParams({ page, limit });
        if (tags) params.append("tags", tags.join(","));

        return await api.get(`/posts?${params.toString()}`);
    },
    async one(id: string) {
        return await api.get(`/posts/${id}`)
    }
};
