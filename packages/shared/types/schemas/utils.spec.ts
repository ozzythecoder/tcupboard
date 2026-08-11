import { describe, expect, test } from "vitest";
import { numberOrNumericStringSchema, stringToJSONSchema, stringToNumberSchema } from "./utils.ts";

describe("stringToJSONSchema", () => {
    const json = `{ "name": "benny", "age": 42, "isAdmin": false, "hobbies": ["reading", "writing"] }`;

    test("accepts a string of valid JSON", () => {
        const result = stringToJSONSchema.safeParse(json);
        expect(result.success).toBe(true);
    });

    test("processes data correctly", () => {
        const result = stringToJSONSchema.safeParse(json);
        expect(result.data).toEqual({
            name: "benny",
            age: 42,
            isAdmin: false,
            hobbies: ["reading", "writing"],
        });
    });

    test("returns an error for malformed json", () => {
        const result = stringToJSONSchema.safeParse(json.slice(1));
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error?.issues[0]).toHaveProperty("message");
        expect(result.error?.issues[0].message).toBe("Invalid JSON");
    });

});

describe("stringToNumberSchema", () => {
    test("accepts a valid string", () => {
        const r = stringToNumberSchema.safeParse("42")
        expect(r.success).toBe(true);
        expect(r.data).toBe(42);
    })
    
    test("rejects true numbers", () => {
        const r = stringToNumberSchema.safeParse(42)
        expect(r.success).toBe(false);
    })
    
    test("rejects non-numeric strings", () => {
        const r = stringToNumberSchema.safeParse("abc")
        expect(r.success).toBe(false);
    })
})

describe("numberOrNumericStringSchema", () => {
    test("accepts a number", () => {
        const r = numberOrNumericStringSchema.safeParse(42)
        expect(r.success).toBe(true)
        expect(r.data).toBe(42)
    })

    test("accepts and coerces a numeric string", () => {
        const r = numberOrNumericStringSchema.safeParse("42")
        expect(r.success).toBe(true)
        expect(r.data).toBe(42)
    })
    
    test("rejects a non-numeric string", () => {
        const r = numberOrNumericStringSchema.safeParse('abc')
        expect(r.success).toBe(false)
    })
    
    test("rejects falsy values that could coerce to 0", () => {
        for (const value of [null, undefined, [], {}, '']) {
            const r = numberOrNumericStringSchema.safeParse(value)
            expect(r.success).toBe(false)
        }
    })
})