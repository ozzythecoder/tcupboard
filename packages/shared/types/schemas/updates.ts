import { z } from "zod";
import { ZTipTapJsonSchema } from "./rich-text.js";

export const ZTcupUpdateSchema = z.strictObject({
    id: z.number(),
    title: z.string(),
    content: ZTipTapJsonSchema,
    image: z.string().optional(),
    publish_date: z.string(),
    published: z.boolean(),
    archived: z.boolean(),
    created_at: z.string(),
    updated_at: z.string()
})
export type TcupUpdate = z.infer<typeof ZTcupUpdateSchema>;
