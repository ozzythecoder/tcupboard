import type { CampaignGateway } from "./campaign.gateway.js";

export class CampaignService {
    constructor(
        private readonly campaignGateway: CampaignGateway,
    ) {}

    async getCampaignBySlug(slug: string, preview?: boolean) {
        const campaigns = await this.campaignGateway.getCampaignBySlug(slug, preview);
        return campaigns[0]
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