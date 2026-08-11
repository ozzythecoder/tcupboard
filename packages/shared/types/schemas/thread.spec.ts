import { describe, expect, test } from "vitest";
import {
    type CreateThreadSchema,
    type EditThreadSchema,
    ZCreateThreadReplySchema,
    ZCreateThreadSchema,
    ZEditThreadReplySchema,
    ZEditThreadSchema,
    ZImageMetadataSchema,
    ZThreadContentSchema,
} from "./thread.ts";

describe("ZThreadContentSchema", () => {
    const schema = ZThreadContentSchema;
    
    test("accepts raw string", () => {
        const r = schema.safeParse("raw string");
        expect(r.success).toBe(true);
        expect(r.data).toBe("raw string");
    });

    test("accepts stringified tiptap object", () => {
        const json = { type: "doc", content: [] };
        const r = schema.safeParse(JSON.stringify(json));
        expect(r.success).toBe(true);
        expect(r.data).toEqual(json);
    });

    test("accepts stringified draftjs object", () => {
        const json = { blocks: [], entityMap: {} };
        const r = schema.safeParse(JSON.stringify(json));
        expect(r.success).toBe(true);
        expect(r.data).toEqual(json);
    });

    test("rejects unexpected object", () => {
        const r = schema.safeParse({ foo: "bar" });
        expect(r.success).toBe(false);
    });
});

describe("ZImageMetadataSchema", () => {
    const imageMetadata = {
        url: "https://example.com/image.jpg",
        width: 100,
        height: 200,
        publicId: "jfoe-39208-fw340",
    };

    test("accepts valid image metadata", () => {
        const r = ZImageMetadataSchema.safeParse(imageMetadata);
        expect(r.success).toBe(true);
    });

    test("accepts width/height values as valid strings", () => {
        const r = ZImageMetadataSchema.safeParse({
            ...imageMetadata,
            width: "100",
            height: "100",
        });
        expect(r.success).toBe(true);
    });

    test("rejects width/height values if not numbers", () => {
        const r = ZImageMetadataSchema.safeParse({
            ...imageMetadata,
            height: "abc",
        });
        expect(r.success).toBe(false);
        expect(r.error).toBeDefined();

        const r2 = ZImageMetadataSchema.safeParse({
            ...imageMetadata,
            width: [],
        });
        expect(r2.success).toBe(false);
        expect(r2.error).toBeDefined();
    });

    test("strips loose properties", () => {
        const r = ZImageMetadataSchema.safeParse({
            ...imageMetadata,
            foo: "bar",
        });
        expect(r.success).toBe(true);
        expect(r.data).toEqual(imageMetadata);
    });

    test("rejects invalid image metadata", () => {
        const r = ZImageMetadataSchema.safeParse({});
        expect(r.success).toBe(false);
        expect(r.error).toBeDefined();
    });
});

describe("ZCreateThreadSchema", () => {
    const newThread: CreateThreadSchema = {
        author: "auth0|12345qwerty",
        title: "My New Post",
        images: [
            {
                url: "https://example.com/image.jpg",
                width: 100,
                height: 100,
                publicId: "09fj-23dsa-9j3en",
            },
        ],
        content: JSON.stringify({
            type: "doc",
            content: [],
        }),
    };

    test("accepts valid input", () => {
        const r = ZCreateThreadSchema.safeParse(newThread);
        expect(r.success).toBe(true);
    });

    test("accepts valid input without optional fields", () => {
        // oxlint-disable-next-line no-unused-vars
        const { images, parent_id, ...thread } = newThread;
        const r = ZCreateThreadSchema.safeParse(thread);
        expect(r.success).toBe(true);
    });

    test("rejects invalid input", () => {
        const r = ZCreateThreadSchema.safeParse({
            author: undefined,
            title: 456,
        });
        expect(r.success).toBe(false);
        expect(r.error).toBeDefined();
    });

    test("rejects input that includes protected fields", () => {
        const r = ZCreateThreadSchema.safeParse({ ...newThread, parent_id: 45 });
        expect(r.success).toBe(false);
        expect(r.error).toBeDefined();
        expect(r.error?.issues[0].path).toContain("parent_id");
    });
});

describe("ZEditThreadSchema", () => {
    const updatedThread: EditThreadSchema = {
        title: "Updated Title",
        content: JSON.stringify({
            type: "doc",
            content: [],
        }),
        images: [],
    };

    test("accepts valid input", () => {
        const r = ZEditThreadSchema.safeParse(updatedThread);
        expect(r.success).toBe(true);
    });

    test("accepts partial input", () => {
        for (const [key, value] of Object.entries(updatedThread)) {
            const r = ZEditThreadSchema.safeParse({
                [key]: value,
            });
            expect(r.success).toBe(true);
        }
    });

    test("rejects invalid input", () => {
        const r = ZEditThreadSchema.safeParse(["arrays are not valid"]);
        expect(r.success).toBe(false);
        expect(r.error).toBeDefined();
    });
});

describe.todo("ZCreateThreadReplySchema");
describe.todo("ZEditThreadReplySchema");