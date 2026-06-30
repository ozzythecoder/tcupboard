import { type json, z } from "zod";

// https://github.com/colinhacks/zod/discussions/2215#discussioncomment-5356276

export const stringToJSONSchema = z
    .string()
    .transform((str, ctx): z.infer<ReturnType<typeof json>> => {
        try {
            return JSON.parse(str);
        } catch (_) {
            ctx.addIssue({ code: "custom", message: "Invalid JSON" });
            return z.NEVER;
        }
    });
