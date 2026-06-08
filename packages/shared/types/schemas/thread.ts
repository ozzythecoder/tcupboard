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
export const ZDraftJsJsonSchema = z
    .strictObject({
        blocks: z.array(z.json()),
        entityMap: z.json(),
    })
    .required();

export const ZThreadContentSchema = z.union([
    z.string(),
    stringToJSONSchema.pipe(ZThreadTipTapJsonSchema),
    stringToJSONSchema.pipe(ZDraftJsJsonSchema),
]);

export type ThreadContent = z.infer<typeof ZThreadContentSchema>

export const ZCreateThreadSchema = z
    .object({
        auth0_id: z.string(),
        author: z.string(),
        title: z.string(),
        content: ZThreadContentSchema,
    })
    .required();

export type CreateThreadSchema = z.infer<typeof ZCreateThreadSchema>