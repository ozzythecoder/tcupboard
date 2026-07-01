import type { Policy } from "../types.js";

export const admin: Policy = async (req) => {
    return !!req.user?.roles.includes("admin") || !!req.user?.roles.includes("superadmin");
};

export const everyone: Policy = async (_req) => {
    return true;
};
