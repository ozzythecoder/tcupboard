import { describe, expect, test } from "vitest";
import { ZTcupUpdateSchema } from "./updates.ts";

const update = {
    id: 4,
    title: "schwing",
    content: { type: "doc", content: [] },
    image: undefined,
    publish_date: "4/25/2025",
    published: true,
    archived: false,
    created_at: "4/20/2025",
    updated_at: "4/25/2025",
};

describe("ZTcupUpdateSchema", () => {
    const schema = ZTcupUpdateSchema;
    test("accepts valid update", () => {
        const r = schema.safeParse(update);
        expect(r.success).toBe(true);
        expect(r.data).toEqual(update);
    });

    test("rejects unknown keys", () => {
        const r = schema.safeParse({ ...update, foo: "bar" });
        expect(r.success).toBe(false);
    });

    test("rejects invalid update", () => {
        const r = schema.safeParse({});
        expect(r.success).toBe(false);
        expect(r.error).toBeDefined();
    });
});
