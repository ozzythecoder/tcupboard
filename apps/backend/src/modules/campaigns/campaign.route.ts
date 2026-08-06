import express from "express";
import z from "zod";
import { directus } from "@/config/cms.js";
import { env } from "@/config/env.js";
import { validateRequest } from "@/middleware/validator.js";
import { NotFoundError } from "@/types/errors.js";
import { CampaignGateway } from "./campaign.gateway.js";
import { CampaignService } from "./campaign.service.js";

const router = express.Router();
const gateway = new CampaignGateway(directus);
const svc = new CampaignService(gateway);

router.get(
    "/highlight",
    async (_req, res, next) => {
        try {
            let data = await svc.getHighlightedCampaign()
            if (!data.id) {
                console.log("Highlight failed. Getting random campaign")
                data = await svc.getAnyCampaign()
                if (data.length === 0) throw new NotFoundError("No campaign found.");
            }
            res.json(data)
        } catch (e) {
            console.error("Failed to get highlighted campaign:", e)
            next(e)
        }
    }
)

router.get(
    "/:slug",
    validateRequest({
        query: z.object({
            preview: z.string().optional(),
        }),
    }),
    async (req, res, next) => {
        const { slug } = req.params;
        const pvw = req.query.preview === "true";

        try {
            let data = await svc.getCampaignBySlug(slug, pvw);
            if (data.length === 0) {
                // will return 404 if no draft exists. fallback to published version
                if (pvw) {
                    data = await svc.getCampaignBySlug(slug);
                    if (data.length === 0) throw new NotFoundError("No such campaign found.");
                } else {
                    throw new NotFoundError("No such campaign found.");
                }
            }
            const campaign = data[0];

            res.json({
                ...campaign,
                image: campaign.image
                    ? `${env.directus.publicUrl}/assets/${campaign.image}?key=hero-image`
                    : undefined,
            });
        } catch (e) {
            console.error(e);
            next(e);
        }
    },
);

export { router as campaignRouter };
