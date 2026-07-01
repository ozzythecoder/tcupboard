import type { RequestHandler } from "express";
import type { ZodError, ZodType } from "zod";
import { safeParse, treeifyError } from "zod";

type Schema<Params, Query, Body> = {
    params?: ZodType<Params>;
    query?: ZodType<Query>;
    body?: ZodType<Body>;
};

export const validateRequest = <Params = any, Query = any, Body = any>(
    schema: Schema<Params, Query, Body>,
): RequestHandler<Params, unknown, Body, Query> => {
    return async (req, res, next) => {
        const { params, query, body } = schema;
        const errors: Array<ZodError> = [];
        if (params) {
            const result = params.safeParse(req.params);
            if (result.error) errors.push(result.error);
        }
        if (query) {
            const result = query.safeParse(req.query);
            if (result.error) errors.push(result.error);
        }
        if (body) {
            const result = body.safeParse(req.body);
            if (result.error) errors.push(result.error);
        }
        if (errors.length > 0) {
            console.warn("Validation failed:", errors);
            return res.status(400).json({
                message: "Validation failed",
                errors,
            });
        }
        next();
    };
};

export const validatePathParams =
    <T>(schema: ZodType<T>): RequestHandler<T> =>
    async (req, res, next) => {
        const result = safeParse(schema, req.params);
        if (result.error) {
            res.status(400).json({
                message: "Path parameter validation failed",
                errors: treeifyError(result.error),
            });
        } else {
            next();
        }
    };

export const validateQuery =
    (schema: ZodType): RequestHandler =>
    async (req, res, next) => {
        const result = safeParse(schema, req.query);
        if (result.error) {
            res.status(400).json({
                message: "Request query validation failed",
                errors: treeifyError(result.error),
            });
        } else {
            next();
        }
    };

export const validateBody =
    <T>(schema: ZodType<T>): RequestHandler =>
    async (req, res, next) => {
        const result = safeParse(schema, req.body);
        if (result.error) {
            res.status(400).json({
                message: "Request body validation failed",
                errors: treeifyError(result.error),
            });
        } else {
            next();
        }
    };
