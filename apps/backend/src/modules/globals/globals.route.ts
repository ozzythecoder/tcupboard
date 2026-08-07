import express from "express";
import { directus } from "@/config/cms.js";
import { GlobalsService } from "./globals.service.js";

const globalsRouter = express.Router();
const svc = new GlobalsService(directus)

globalsRouter.get('/site-intro', async (_req, res, next) => {
    try {
        const intro = await svc.getSiteIntro();
        res.json(intro);
    } catch (error) {
        next(error);
    }
})

export { globalsRouter }