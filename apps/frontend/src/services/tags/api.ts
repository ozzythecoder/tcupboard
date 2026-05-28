import { api } from "#/lib/api"
import type { Tag } from "#/types/resources"

export const tagService = {
    async all() {
        return await api.get<Tag[]>('/tags')
    }
}