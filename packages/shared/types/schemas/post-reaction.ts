import { z } from "zod";
import type { PostReaction } from "@/models/index.js";

export const ZCreatePostReactionSchema = z.object({
    postId: z.coerce.number<string>(),
    userId: z.coerce.number<string>(),
    type: z.string(),
});
export type CreatePostReaction = z.infer<typeof ZCreatePostReactionSchema>;

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

export const toPostReactionMap = (input: PostReaction[]): PostReactionMap => {
    const result: PostReactionMap = {};
    // supposedly faster than array.reduce()
    input.forEach((r) => {
        if (result[r.type]) {
            result[r.type].push({ userId: r.id, name: r.type });
        } else {
            result[r.type] = [{ userId: r.id, name: r.type }];
        }
    });
    return result;
};
