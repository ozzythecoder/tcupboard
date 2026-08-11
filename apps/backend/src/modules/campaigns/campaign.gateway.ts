import { readItem, readItems, readSingleton } from "@directus/sdk";
import type { Campaign } from "@repo/shared";
import type { CmsClient } from "@/config/cms.js";

export class CampaignGateway {
    constructor(private readonly cms: CmsClient) {}

    private allCampaignFields = [
        "*",
        {
            call_to_action: ["*"],
            theme: ["*"],
            blocks: ["*", { item: { block_richtext: ["*", { theme: ["*"] }] } }],
        },
    ];

    async getCampaignBySlug(slug: string, preview?: boolean) {
        return await this.cms.request<Campaign>(
            readItems("campaigns", {
                fields: this.allCampaignFields,
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
        const highlight = await this.cms.request<{
            campaign: { id: string };
        }>(
            readSingleton("global_campaign_highlight", {
                fields: [{ campaign: ["id"] }],
            }),
        );

        return await this.cms.request<Campaign>(
            readItem("campaigns", highlight.campaign.id, { fields: this.allCampaignFields }),
        );
    }

    async getAllCampaigns() {
        return await this.cms.request(readItems("campaigns"));
    }
}
