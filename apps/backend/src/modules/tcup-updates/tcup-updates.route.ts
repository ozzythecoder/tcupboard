import { isDirectusError } from "@directus/sdk";
import { numberOrNumericStringSchema } from "@repo/shared";
import express from "express";
import z from "zod";
import { directus } from "@/config/cms.js";
import { publicRoute } from "@/middleware/route.js";
import { NotFoundError } from "@/types/errors.js";
import { TcupUpdatesService } from "./tcup-updates.service.js";

const tcupUpdatesRouter = express.Router();
const svc = new TcupUpdatesService(directus);

tcupUpdatesRouter.get(
    "/",
    ...publicRoute({
        handler: async (_req, res) => {
            res.json(await svc.getAll());
        },
    }),
);

tcupUpdatesRouter.get(
    "/:id",
    ...publicRoute({
        validate: {
            query: z.object({
                preview: z.string().optional(),
            }),
            params: z.object({
                id: numberOrNumericStringSchema,
            }),
        },
        handler: async (req, res, next) => {
            try {
                res.json(await svc.getById(req.params.id, req.query.preview === "true"));
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
    }),
);

export { tcupUpdatesRouter };
