import z from "zod";
import { ZTipTapJsonSchema } from "./rich-text.ts";
import { numberOrNumericStringSchema } from "./utils.ts";

export const ZGlobalFaqQuestionSchema = z.object({
    question: z.string(),
    answer: ZTipTapJsonSchema,
});
export type GlobalFaqQuestion = z.infer<typeof ZGlobalFaqQuestionSchema>;

export const ZGlobalFaqSchema = z.object({
    id: numberOrNumericStringSchema,
    questions: z.array(ZGlobalFaqQuestionSchema),
});
export type GlobalFaq = z.infer<typeof ZGlobalFaqSchema>;
