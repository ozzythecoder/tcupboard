import type { NextFunction, Request, RequestHandler, Response } from "express";
import { accessControl } from "@/access-control/middleware.js";
import type { ComposerFactory } from "@/access-control/types.js";
import type { Authed } from "./auth.js";
import authGuard from "./auth.js";
import { type ValidatorSchema, validateRequest } from "./validator.js";

interface RouteOptions<P = unknown, Q = unknown, B = unknown> {
    validate?: ValidatorSchema<P, Q, B>;
    policy?: ComposerFactory<NoInfer<P>, NoInfer<Q>, NoInfer<B>>;
    handler: (
        req: Request<P, unknown, B, Q> & Authed,
        res: Response,
        next: NextFunction,
    ) => void | Promise<void>;
}

/**
 * Defines a protected endpoint with optional validation and access control policy.
 *
 * Will 403 on unauthenticated requests - use {@link publicRoute} for public endpoints.
 */
export function route<P, Q, B>({
    handler,
    validate,
    policy,
}: RouteOptions<P, Q, B>): RequestHandler[] {
    const handlers: RequestHandler[] = [];
    if (validate) handlers.push(validateRequest(validate) as RequestHandler);
    if (policy) handlers.push(accessControl(policy) as RequestHandler);
    const wrapped: RequestHandler = async (req, res, next) => {
        try {
            await handler(req as Parameters<typeof handler>[0], res, next);
        } catch (error) {
            next(error);
        }
    };
    handlers.push(wrapped);
    return [authGuard, ...handlers];
}

interface PublicRouteOptions<P, Q, B> {
    validate?: ValidatorSchema<P, Q, B>;
    handler: (
        req: Request<P, unknown, B, Q>,
        res: Response,
        next: NextFunction,
    ) => void | Promise<void>;
}
/**
 * Defines a public endpoint with optional validation logic.
 * 
 * Does not check for authentication - use {@link route} for protected endpoints.
 */
export function publicRoute<P, Q, B>({ validate, handler }: PublicRouteOptions<P, Q, B>) {
    const handlers: RequestHandler[] = [];
    if (validate) handlers.push(validateRequest(validate) as RequestHandler);
    const wrapped: RequestHandler = async (req, res, next) => {
        try {
            await handler(req as Parameters<typeof handler>[0], res, next);
        } catch (error) {
            next(error);
        }
    };
    handlers.push(wrapped);
    return handlers;
}
