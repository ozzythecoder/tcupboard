import type { Request } from "express";
import type { PolicyRecord } from "../types.js";
import { admin } from "./generic.js";

export const userPolicy = {
    /**
     * Authenticated users can edit their own profile.
     */
    edit: async (req: Request) => {
        return req.user?.sub === req.params.id;
    },
    /**
     * Administrators can delete other profiles.
     */
    delete: async (req) => {
        return admin(req);
    },
} as const satisfies PolicyRecord;
