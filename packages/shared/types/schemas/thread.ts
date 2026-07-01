import { z } from "zod";
import { stringToJSONSchema } from "./utils.js";

/**
 * Rich text content in TipTap format
 */
export const ZThreadTipTapJsonSchema = z
    .strictObject({
        type: z.literal("doc"),
        content: z.json(),
    })
    .required();

/**
 * Rich text content in DraftJs format
 */
export const ZThreadDraftJsJsonSchema = z
    .strictObject({
        blocks: z.array(z.json()),
        entityMap: z.json(),
    })
    .required();

export const ZThreadContentSchema = z.union([
    z.string(),
    stringToJSONSchema.pipe(ZThreadTipTapJsonSchema),
    stringToJSONSchema.pipe(ZThreadDraftJsJsonSchema),
]);
export type ThreadContent = z.infer<typeof ZThreadContentSchema>;

export const ZImageMetadataSchema = z.object({
    url: z.string(),
    width: z.coerce.number(),
    height: z.coerce.number(),
    publicId: z.string(),
});
export type ImageMetadata = z.infer<typeof ZImageMetadataSchema>;

export const ZCreateThreadSchema = z.object({
    author: z.string(),
    title: z.string(),
    content: ZThreadContentSchema,
    images: z.array(ZImageMetadataSchema).optional(),
    parent_id: z.never().optional(),
});
export type CreateThreadSchema = z.infer<typeof ZCreateThreadSchema>;

export const ZEditThreadSchema = ZCreateThreadSchema.pick({
    content: true,
    title: true,
    images: true,
}).partial();
export type EditThreadSchema = z.infer<typeof ZEditThreadSchema>;

export const ZCreateThreadReplySchema = ZCreateThreadSchema.omit({ title: true }).extend({
    parent_id: z.coerce.number(),
});
export type CreateThreadReplySchema = z.infer<typeof ZCreateThreadReplySchema>;

export const ZEditThreadReplySchema = ZCreateThreadReplySchema.pick({
    content: true,
    images: true,
}).partial();
export type EditThreadReplySchema = z.infer<typeof ZEditThreadReplySchema>;

export type CreateThreadOrReply = CreateThreadSchema | CreateThreadReplySchema;
