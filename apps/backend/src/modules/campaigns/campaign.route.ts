import express from "express";
import z from "zod";
import { directus } from "@/config/cms.js";
import { publicRoute } from "@/middleware/route.js";
import { CampaignGateway } from "./campaign.gateway.js";
import { CampaignService } from "./campaign.service.js";

const router = express.Router();
const gateway = new CampaignGateway(directus);
const svc = new CampaignService(gateway);

router.get(
    "/highlight",
    ...publicRoute({
        handler: async (_req, res) => {
            res.json(await svc.getHighlightedCampaign());
        },
    }),
);

const GetCampaignSlugSchema = {
    query: z.object({
        preview: z.string().optional(),
    }),
    params: z.object({
        slug: z.string(),
    }),
}
router.get(
    "/:slug",
    ...publicRoute({
        validate: GetCampaignSlugSchema,
        handler: async (req, res) => {
            const { slug } = req.params;
            const pvw = req.query.preview === "true";
            res.json(await svc.getCampaignBySlug(slug, pvw));
        },
    }),
);

export { router as campaignRouter };
