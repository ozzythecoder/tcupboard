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

/**
 * Accepts a numeric string and coerces it to a number.
 */
export const stringToNumberSchema = z.string().transform((str, ctx) => {
    const r = parseInt(str, 10);
    if (Number.isNaN(r)) {
        ctx.addIssue({ code: "custom", message: "Invalid number" });
        return z.NEVER;
    } else {
        return r;
    }
});

/**
 * Accepts a *number*, or a *numeric string* and coerces it to a number.
 *
 * `z.coerce.number()` is too broad, and coerces values like `[]`, `{}`, `''`, `null`, and `undefined` into 0.
 */
export const numberOrNumericStringSchema = z.union([
    z.number(),
    z.string().pipe(stringToNumberSchema),
]);
