import { z } from "zod";

/**
 * Rich text content in TipTap json format
 */
export const ZTipTapJsonSchema = z
    .strictObject({
        type: z.literal("doc"),
        get content() {
            return z.array(z.json());
        },
    })
    .required();
export type TipTapContent = {
    type: "doc";
    content: any[];
};

/**
 * Rich text content in DraftJs json format
 */
export const ZDraftJsJsonSchema = z
    .strictObject({
        get entityMap() {
            return z.json();
        },
        get blocks() {
            return z.array(z.json());
        },
    })
    .required();
export type DraftJsContent = {
    blocks: any[];
    entityMap: any;
};

export const ZRichTextContentSchema = z.union([z.string(), ZTipTapJsonSchema, ZDraftJsJsonSchema]);
export type RichTextContent = string | DraftJsContent | TipTapContent;

/**
 * Type helper to prevent infinite type instantiation.
 *
 * Long story short, Zod's `z.json` utility is a recursive type, which is fine on its own,
 * but causes infinite type instantiation when used in a form library like Tanstack Form.
 *
 * For the deeper structue of rich text content, `any` is fine since the json format
 * doesn't need to be validated by us, because it comes directly from the library.
 * These schemas still exist for runtime validation.
 */
export type ZodRichTextContent = z.ZodUnion<
    [z.ZodType<TipTapContent>, z.ZodType<DraftJsContent>, z.ZodString]
>;
