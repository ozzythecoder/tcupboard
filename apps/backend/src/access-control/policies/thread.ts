import type { Policy } from "../types.js";
import { admin } from "./generic.js";

export const threadPolicy = {
    /**
     * Threads can only be edited by their authors.
     */
    edit: async (req) => {
        return req.user?.sub === req.params.id;
    },
    /**
     * Threads can be deleted by their authors and by admins.
     */
    delete: async (req) => {
        return !!(req.user?.sub === req.params.id || admin(req));
    },
} as const satisfies Record<string, Policy>;
