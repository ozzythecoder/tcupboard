import { readItems, readSingleton } from "@directus/sdk";
import type { CmsClient } from "@/config/cms.js";

export class CampaignGateway {
    constructor(private readonly cms: CmsClient) {}

    async getCampaignBySlug(slug: string, preview?: boolean) {
        return await this.cms.request(
            readItems("campaigns", {
                fields: [
                    "*",
                    {
                        call_to_action: ["*"],
                        theme: ["*"],
                        blocks: ["*", { item: { block_richtext: ["*", { theme: ["*"] }] } }],
                    },
                ],
                filter: {
                    slug: {
                        _eq: slug,
                    },
                },
                version: preview ? "draft" : undefined,
            }),
        );
    }

    async getHighlightedCampaign() {
        return await this.cms.request(
            readSingleton("global_campaign_highlight", {
                fields: ["*", { campaign: ["slug"] }],
            }),
        );
    }

    async getAllCampaigns() {
        return await this.cms.request(readItems("campaigns"));
    }
}
