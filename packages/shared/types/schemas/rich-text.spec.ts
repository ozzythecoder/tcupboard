import { describe, expect, test } from "vitest";
import { ZDraftJsJsonSchema, ZRichTextContentSchema, ZTipTapJsonSchema } from "./rich-text.ts";

const tiptapJson = {
    type: "doc",
    content: [
        {
            type: "paragraph",
            content: [
                {
                    type: "text",
                    text: "hello world",
                },
            ],
        },
    ],
};

describe("ZTipTapJsonSchema", () => {
    test("accepts valid javascript object", () => {
        const r = ZTipTapJsonSchema.safeParse(tiptapJson);
        expect(r.success).toBe(true);
    });

    test("rejects invalid javascript object", () => {
        const r = ZTipTapJsonSchema.safeParse({
            type: "doc",
            content: [],
            foo: "bar",
        });
        expect(r.success).toBe(false);
    });
});

const draftjsJson = {
    blocks: [
        {
            key: "dsgnp",
            text: "check one two",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
    ],
    entityMap: {},
};

describe("ZDraftJsJsonSchema", () => {
    test("accepts valid javascript object", () => {
        const r = ZDraftJsJsonSchema.safeParse(draftjsJson);
        expect(r.success).toBe(true);
    });

    test("rejects invalid javascript object", () => {
        const r = ZDraftJsJsonSchema.safeParse({
            ...draftjsJson,
            foo: "bar",
        });
        expect(r.success).toBe(false);
    });
});

describe("ZRichTextContentSchema", () => {
    const schema = ZRichTextContentSchema;
    test("accepts tiptap object", () => {
        const r = schema.safeParse(tiptapJson);
        expect(r.success).toBe(true);
        expect(r.data).toEqual(tiptapJson);
    });
    test("accepts draft.js object", () => {
        const r = schema.safeParse(draftjsJson);
        expect(r.success).toBe(true);
        expect(r.data).toEqual(draftjsJson);
    });
    test("accepts raw string", () => {
        const r = schema.safeParse("check one two");
        expect(r.success).toBe(true);
        expect(r.data).toBe("check one two");
    });
    test("rejects invalid json", () => {
        const r = schema.safeParse([{ foo: "bar" }]);
        expect(r.success).toBe(false);
    });
});
