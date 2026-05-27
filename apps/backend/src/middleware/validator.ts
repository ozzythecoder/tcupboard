import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { safeParse, treeifyError } from "zod";

export const validateQuery = (schema: ZodType): RequestHandler =>
    async (req, res, next) => {
        const result = safeParse(schema, req.query)
        if (result.error) {
            res.status(400).json({
                message: 'Validation failed',
                errors: treeifyError(result.error)
            })
        } else {
            next();
        }
    }

export const validateBody = (schema: ZodType): RequestHandler =>
    async (req, res, next) => {
        const result = safeParse(schema, req.query)
        if (result.error) {
            res.status(400).json({
                message: 'Validation failed',
                errors: treeifyError(result.error)
            })
        } else {
            next();
        }
    }