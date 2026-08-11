import { z } from "zod";
import type { PostReactionWithUsername } from "@/models/index.js";
import { numberOrNumericStringSchema } from "./utils.js";

export const ZCreatePostReactionSchema = z.object({
    postId: numberOrNumericStringSchema,
    userId: numberOrNumericStringSchema,
    type: z.string(),
});
export type CreatePostReaction = z.infer<typeof ZCreatePostReactionSchema>;

export const ZPostReactionWithUsernameSchema = z.object({
    postId: numberOrNumericStringSchema,
    userId: numberOrNumericStringSchema,
    username: z.string(),
    type: z.string(),
    id: numberOrNumericStringSchema,
    createdAt: z.string()
})

export const ZPostReactionMap = z.record(
    z.string(),
    z.array(
        z.object({
            userId: z.number(),
            name: z.string(),
        }),
    ),
);

/**
 * `[x: string]` is an emoji unicode identifier.
 */
export type PostReactionMap = z.infer<typeof ZPostReactionMap>;

export const toPostReactionMap = (input: PostReactionWithUsername[]): PostReactionMap => {
    const result: PostReactionMap = {};
    // supposedly faster than array.reduce()
    input.forEach((r) => {
        if (result[r.type]) {
            result[r.type].push({ userId: r.userId, name: r.username });
        } else {
            result[r.type] = [{ userId: r.userId, name: r.username }];
        }
    });
    return result;
};
