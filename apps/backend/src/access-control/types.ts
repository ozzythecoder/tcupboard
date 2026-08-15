import type { Request } from "express";
import type { Authed } from "@/middleware/auth.js";
import type { DirectMessagesService } from "@/modules/direct-messages/direct-messages.service.js";

/**
 * The dependency bundle threaded into policy factories at the composition root
 * ({@link buildPolicies}).
 */
export type PolicyDeps = {
    dmService: DirectMessagesService;
};

export type Policy<P = unknown, Q = unknown, B = unknown> = (req: Request<P, any, B, Q> & Authed) => Promise<boolean>;
export type PolicyFactory<P, Q, B, Deps = PolicyDeps> = (deps: Deps) => Policy<P, Q, B>;
export type PolicyComposer<P, Q, B> = (...policies: Policy<P, Q, B>[]) => Policy<P, Q, B>;
export type ComposerFactory<P, Q, B> = (composers: { all: PolicyComposer<P, Q, B>; one: PolicyComposer<P, Q, B> }) => Policy<P, Q, B>;
