import type { Policy } from "../types.js";

export const admin: Policy = async (req) => {
    return !!req.user?.["https://tcupboard.org/roles"].includes("admin");
};
