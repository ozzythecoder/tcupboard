import { describe, expect, test } from "vitest";
import type { PostReaction, PostReactionWithUsername } from "@/models/index.ts";
import {
    type CreatePostReaction,
    type PostReactionMap,
    toPostReactionMap,
    ZCreatePostReactionSchema,
    ZPostReactionMap,
    ZPostReactionWithUsernameSchema,
} from "./post-reaction.ts";

describe("ZCreatePostReactionSchema", () => {
    const schema = ZCreatePostReactionSchema;
    const reaction: CreatePostReaction = {
        postId: 5,
        userId: 89,
        type: "love",
    };

    test("accepts a valid reaction", () => {
        const r = schema.safeParse(reaction);
        expect(r.success).toBe(true);
        expect(r.data).toEqual(reaction);
    });

    test("accepts numeric strings for IDs", () => {
        const r = schema.safeParse({ ...reaction, postId: "5", userId: "89" });
        expect(r.success).toBe(true);
        expect(r.data).toEqual(reaction);
    });

    test("rejects invalid ID strings", () => {
        const r = schema.safeParse({ ...reaction, userId: "blah" });
        expect(r.success).toBe(false);
    });
});

describe("ZPostReactionMap", () => {
    const schema = ZPostReactionMap;
    const reactionMap: PostReactionMap = {
        love: [
            {
                userId: 89,
                name: "ozzy",
            },
        ],
        sunglasses: [
            {
                userId: 444,
                name: "jimothy",
            },
            {
                userId: 19230,
                name: "thames",
            },
        ],
    };

    test("accepts a valid reaction map", () => {
        const r = schema.safeParse(reactionMap);
        expect(r.success).toBe(true);
        expect(r.data).toEqual(reactionMap);
    });

    test("rejects an invalid reaction map", () => {
        const r = schema.safeParse({ ...reactionMap, love: 89 });
        expect(r.success).toBe(false);
    });
});

describe("ZPostReactionWithUsername", () => {
    const schema = ZPostReactionWithUsernameSchema
    const reaction: PostReactionWithUsername = {
        id: 89,
        postId: 12,
        userId: 1240,
        username: "ozzy",
        createdAt: new Date().toISOString(),
        type: "love",
    };

    test("accepts a valid reaction", () => {
        const r = schema.safeParse(reaction);
        expect(r.success).toBe(true);
        expect(r.data).toEqual(reaction);
    });

    test("rejects an invalid reaction", () => {
        const r = schema.safeParse({ ...reaction, username: 89 });
        expect(r.success).toBe(false);
    });
});

describe("toPostReactionMap", () => {
    const reactions: PostReactionWithUsername[] = [
        {
            id: 89,
            postId: 12,
            userId: 1240,
            username: "ozzy",
            createdAt: new Date().toISOString(),
            type: "love",
        },
        {
            id: 444,
            postId: 12,
            userId: 1923,
            username: "jimothy",
            createdAt: new Date().toISOString(),
            type: "sunglasses",
        },
        {
            id: 123,
            postId: 12,
            userId: 19230,
            username: "thames",
            createdAt: new Date().toISOString(),
            type: "sunglasses",
        },
    ];
    const reactionMap: PostReactionMap = {
        love: [
            {
                userId: 1240,
                name: "ozzy",
            },
        ],
        sunglasses: [
            {
                userId: 1923,
                name: "jimothy",
            },
            {
                userId: 19230,
                name: "thames",
            },
        ],
    };

    test("converts reactions to a reaction map", () => {
        const result = toPostReactionMap(reactions);
        expect(result).toEqual(reactionMap);
    });
});
