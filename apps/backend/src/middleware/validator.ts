import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { safeParse, treeifyError } from "zod";

export const validatePathParams = (schema: ZodType): RequestHandler =>
    async (req, res, next) => {
        const result = safeParse(schema, req.params)
        if (result.error) {
            res.status(400).json({
                message: 'Path parameter validation failed',
                errors: treeifyError(result.error)
            })
        } else {
            next();
        }
    }

export const validateQuery = (schema: ZodType): RequestHandler =>
    async (req, res, next) => {
        const result = safeParse(schema, req.query)
        if (result.error) {
            res.status(400).json({
                message: 'Request query validation failed',
                errors: treeifyError(result.error)
            })
        } else {
            next();
        }
    }

export const validateBody = (schema: ZodType): RequestHandler =>
    async (req, res, next) => {
        const result = safeParse(schema, req.body)
        if (result.error) {
            res.status(400).json({
                message: 'Request body validation failed',
                errors: treeifyError(result.error)
            })
        } else {
            next();
        }
    }