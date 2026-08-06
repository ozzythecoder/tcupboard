import { z } from "zod";
import { ZTipTapJsonSchema } from "./rich-text.js";

export const ZCampaignThemeSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    background: z.string(),
    foreground: z.string(),
});

export const ZCampaignBlockSchema = z.object({
    id: z.number(),
    campaigns_id: z.number(),
    collection: z.string(),
    item: z
        .object({
            id: z.number(),
            theme: ZCampaignThemeSchema.nullish(),
            content: ZTipTapJsonSchema,
        })
        .nullish(),
});

export const ZCallToActionSchema = z.object({
    id: z.number(),
    name: z.string(),
    url: z.string(),
    callout: z.string(),
    action: z.string(),
    theme: z.string().nullish(),
});

export const ZCampaignSchema = z.object({
    id: z.number(),
    sort: z.number().nullish(),
    date_created: z.string().nullish(),
    date_updated: z.string().nullish(),
    title: z.string(),
    subtitle: z.string().nullish(),
    image: z.string().nullish(),
    slug: z.string(),
    theme: ZCampaignThemeSchema,
    call_to_action: ZCallToActionSchema.nullish(),
    blocks: z.array(ZCampaignBlockSchema),
    show_footer: z.boolean(),
});

export type Campaign = z.infer<typeof ZCampaignSchema>;
export type CampaignCTA = NonNullable<Campaign["call_to_action"]>;
export type CampaignBlock = Campaign["blocks"][number];
