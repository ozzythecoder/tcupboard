import { isDirectusError } from "@directus/sdk";
import express from "express";
import z from "zod";
import { directus } from "@/config/cms.js";
import { validateRequest } from "@/middleware/validator.js";
import { NotFoundError } from "@/types/errors.js";
import { TcupUpdatesService } from "./tcup-updates.service.js";

const tcupUpdatesRouter = express.Router();
const svc = new TcupUpdatesService(directus);

tcupUpdatesRouter.get(
    "/",
    validateRequest({
        query: z.object({
            preview: z.string().optional(),
        }),
    }),
    async (req, res, next) => {
        try {
            const { preview } = req.query;
            const data = await svc.getAll(preview === "true");
            return res.json(data);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
);

tcupUpdatesRouter.get(
    "/:id",
    validateRequest({
        query: z.object({
            preview: z.string().optional(),
        }),
    }),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const { preview } = req.query;
            const data = await svc.getById(id, preview === "true");
            return res.json(data);
        } catch (error) {
            console.debug(error);
            if (isDirectusError(error)) {
                // Directus throws 'Forbidden' errors for not found resources
                if (error.response.status === 403) {
                    console.warn("Rewriting Directus 403 to NotFoundError");
                    return next(new NotFoundError("News update not found"));
                }
            }
            return next(error);
        }
    },
);

export { tcupUpdatesRouter };
