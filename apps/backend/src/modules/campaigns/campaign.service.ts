import type { Campaign } from "@repo/shared";
import { env } from "@/config/env.js";
import { NotFoundError } from "@/types/errors.js";
import type { CampaignGateway } from "./campaign.gateway.js";

export class CampaignService {
    constructor(private readonly campaignGateway: CampaignGateway) {}

    async getCampaignBySlug(slug: string, preview?: boolean): Promise<Campaign> {
        let result = await this.campaignGateway.getCampaignBySlug(slug, preview);
        if (result.length === 0 && preview) {
            // will 404 if preview is true and no draft exists. fall back to public version
            result = await this.campaignGateway.getCampaignBySlug(slug);
        }
        if (result.length === 0) throw new NotFoundError("No campaign found.");
        const campaign = result[0];

        return {
            ...campaign,
            image: campaign.image ? this.getPublicImgUrl(campaign.image) : undefined,
        };
    }

    async getHighlightedCampaign() {
        const c = await this.campaignGateway.getHighlightedCampaign();
        if (!c) throw new NotFoundError("No campaign found.");
        return c;
    }

    getAllCampaigns() {
        return this.campaignGateway.getAllCampaigns();
    }

    async getAnyCampaign() {
        const campaigns = await this.campaignGateway.getAllCampaigns();
        return campaigns[0];
    }

    private getPublicImgUrl(img: string) {
        return `${env.directus.publicUrl}/assets/${img}?key=hero-image`;
    }
}
