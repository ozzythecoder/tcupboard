import express from "express";
import { directus } from "@/config/cms.js";
import { publicRoute } from "@/middleware/route.js";
import { GlobalsService } from "./globals.service.js";

const globalsRouter = express.Router();
const svc = new GlobalsService(directus);

globalsRouter.get(
    "/site-intro",
    ...publicRoute({
        handler: async (_req, res, next) => {
            res.json(await svc.getSiteIntro().catch(next));
        },
    }),
);

export { globalsRouter };
