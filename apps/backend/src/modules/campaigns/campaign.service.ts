import type { CampaignGateway } from "./campaign.gateway.js";

export class CampaignService {
    constructor(
        private readonly campaignGateway: CampaignGateway,
    ) {}

    getCampaignBySlug(slug: string, preview?: boolean) {
        return this.campaignGateway.getCampaignBySlug(slug, preview);
    }

    getHighlightedCampaign() {
        return this.campaignGateway.getHighlightedCampaign();
    }

    getAllCampaigns() {
        return this.campaignGateway.getAllCampaigns();
    }

    async getAnyCampaign() {
        const campaigns = await this.campaignGateway.getAllCampaigns();
        return campaigns[0];
    }
}