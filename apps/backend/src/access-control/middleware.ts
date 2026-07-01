import type { RequestHandler } from "express";
import type { ComposerFactory, Policy, PolicyComposer } from "./types.js";

const all: PolicyComposer =
    (...policies: Policy[]) =>
    async (req) => {
        for (const p of policies) {
            if (await p(req)) continue;
            return false;
        }
        return true;
    };

const one: PolicyComposer =
    (...policies: Policy[]) =>
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
 *   accessControl( ({ all, or }) => or(all(policyOne, policyTwo), policyThree) ),
 *   (req, res) => {
 *     // handler logic...
 * })
 */
export const accessControl =
    (factory: ComposerFactory): RequestHandler =>
    async (req, res, next) => {
        const policy = factory({ all, one });
        const allowed = await policy(req);
        if (allowed) return next();
        return res.status(403).json({ message: "Access denied" });
    };
