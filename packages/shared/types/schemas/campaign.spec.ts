import { describe, expect, test } from "vitest";
import {
    ZCallToActionSchema,
    ZCampaignBlockSchema,
    ZCampaignSchema,
    ZCampaignThemeSchema,
} from "./campaign.ts";

const testCampaign = {
    id: 4,
    sort: null,
    date_created: "2026-07-29T21:25:39.479Z",
    date_updated: "2026-08-04T21:13:36.039Z",
    title: "Stand with Minnesota",
    slug: "stand-with-minnesota",
    subtitle: "A subtitle to support standing with Minnesota.",
    show_footer: true,
    blocks: [
        {
            id: 3,
            campaigns_id: 4,
            collection: "block_richtext",
            item: {
                id: 3,
                content: {
                    type: "doc",
                    content: [
                        {
                            type: "heading",
                            attrs: {
                                level: 1,
                            },
                            content: [
                                {
                                    type: "text",
                                    text: "Hello",
                                },
                            ],
                        },
                        {
                            type: "paragraph",
                        },
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: "Welcome to the place and the thing",
                                },
                            ],
                        },
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: "yeah yeha yeah",
                                },
                            ],
                        },
                        {
                            type: "paragraph",
                        },
                    ],
                },
                theme: {
                    id: 1,
                    name: "Soft Purple",
                    slug: "soft-purple",
                    foreground: "#0A0A0A",
                    background: "oklch(73.71% 0.17 299)",
                },
            },
        },
    ],
    call_to_action: {
        id: 1,
        name: "Do a thing",
        callout: "We gotta do this thing together",
        action: "Do It",
        url: "nike.com",
        theme: null,
    },
    theme: {
        id: 3,
        name: "Chateau Green",
        slug: "chateau-green",
        foreground: "#0A0A0A",
        background: "oklch(69.66% 0.15 150)",
    },
};

describe("ZCallToActionSchema", () => {
    const schema = ZCallToActionSchema
    test("accepts valid input", () => {
        const r = schema.safeParse(testCampaign.call_to_action);
        expect(r.success).toBe(true);
    });

    test("accepts valid input without optional fields", () => {
        const r = schema.safeParse({
            ...testCampaign.call_to_action,
            theme: undefined
        })
        expect(r.success).toBe(true)
    });
    test("rejects invalid input", () => {
        const r = schema.safeParse({
            ...testCampaign.call_to_action,
            name: undefined
        });
        expect(r.success).toBe(false);
    });
});

describe("ZCampaignBlockSchema", () => {
    const schema = ZCampaignBlockSchema;
    
    test("accepts valid input", () => {
        const block = testCampaign.blocks[0];
        const r = schema.safeParse(block);
        expect(r.success).toBe(true);
    });
    
    test.todo("accepts valid input without optional fields");
    test.todo("rejects invalid input");
});

describe("ZCampaignThemeSchema", () => {
    const schema = ZCampaignThemeSchema;
    test("accepts valid input", () => {
        const r = schema.safeParse(testCampaign.theme);
        expect(r.success).toBe(true);
    });
    test.todo("accepts valid input without optional fields");
    test.todo("rejects invalid input");
});

describe("ZCampaignSchema", () => {
    const schema = ZCampaignSchema;
    test("accepts valid input", () => {
        const r = schema.safeParse(testCampaign);
        expect(r.success).toBe(true);
    });
    test.todo("accepts valid input without optional fields");
    test.todo("rejects invalid input");
});
