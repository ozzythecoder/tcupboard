import type { Request } from "express";
import type { Authed } from "@/middleware/auth.js";
import { UnauthorizedError } from "@/types/errors.js";
import type { ComposerFactory, Policy } from "./types.js";

const all =
    <P, Q, B>(...policies: Policy<P, Q, B>[]): Policy<P, Q, B> =>
    async (req) => {
        for (const p of policies) {
            if (await p(req)) continue;
            return false;
        }
        return true;
    };

const one =
    <P, Q, B>(...policies: Policy<P, Q, B>[]): Policy<P, Q, B> =>
    async (req) => {
        for (const p of policies) {
            if (await p(req)) return true;
        }
        return false;
    };

/**
 * The starting point for attribute-based access control.
 *
 * A {@link Policy} is a function that receives the request context and returns a boolean. If it returns true, the policy passes - if it return false, the policy fails.
 *
 * @param factory a function that receives optional `all` and `or` combinators to combine policies.
 * @returns a middleware that will pass the request through if the specified policies pass, or reject the request with a 403 status if the policies fail.
 *
 * @example
 * // Will pass if both `policyOne` AND `policyTwo` pass, or if JUST `policyThree` passes.
 * app.get('/',
 *   accessControl(({ all, or }) =>
 *      or(all(policyOne, policyTwo), policyThree)
 *   ),
 *   (req, res) => {
 *     // handler logic...
 * })
 */
export const accessControl =
    <P, Q, B>(factory: ComposerFactory<P, Q, B>) =>
    async (req: Request<P, any, B, Q> & Authed, _res, next) => {
        const policy = factory({ all, one });
        const allowed = await policy(req);
        if (allowed) return next();
        console.warn("Access control failed in route", req.url);
        return next(new UnauthorizedError("Access denied"));
    };
