import type { NextFunction, Request, RequestHandler, Response } from "express";
import authGuard, { type Authed } from "./auth.js";

type AnyReqHandler = RequestHandler<any, any, any, any>;

/**
 * Maps `any` to `unknown`, preventing type poisoning in intersecting types.
 *
 * This works because `T & any = any`, but `T & unknown = T`
 */
type Neutralize<T> = 0 extends 1 & T ? unknown : T;

declare const provides: unique symbol;

/**
 * A middleware that guarantees `Ext` is present on `req` by the time it calls
 * `next()`. The brand is phantom - it exists only in the type system, so a
 * plain handler function is assignable to it.
 *
 * @example
 * const authGuard: ProvidingHandler<{ user: Auth0User }> = (req, res, next) => { ... }
 */
export type ProvidingHandler<Ext, P = any, B = any, Q = any> = RequestHandler<P, any, B, Q> & {
    readonly [provides]?: Ext;
};

/** Unwraps an inferred brand, collapsing `any`/`unknown`/absent brands to `unknown`. */
type ExtOf<X> = 0 extends 1 & X ? unknown : unknown extends X ? unknown : NonNullable<X>;

/**
 * The terminal handler of a pipe. Its `req` carries the params/body/query
 * validated upstream *and* everything upstream middleware provided.
 */
export type PipedHandler<P, B, Q, X> = (
    req: Request<P, any, B, Q> & X,
    res: Response,
    next: NextFunction,
) => void | Promise<void>;

class MiddlewarePipe<P = unknown, B = unknown, Q = unknown, X = unknown> {
    private handlers: AnyReqHandler[];

    constructor(handlers: AnyReqHandler[]) {
        this.handlers = handlers;
    }

    pipe<P2 = unknown, B2 = unknown, Q2 = unknown, X2 = unknown>(
        handler: ((
            req: Request<P2, any, B2, Q2> & X,
            res: Response,
            next: NextFunction,
        ) => void) & { readonly [provides]?: X2 },
    ) {
        return new MiddlewarePipe<
            P & Neutralize<P2>,
            B & Neutralize<B2>,
            Q & Neutralize<Q2>,
            X & ExtOf<X2>
        >([...this.handlers, handler as AnyReqHandler]);
    }

    /**
     * Appends the route's final handler and returns the full middleware chain.
     */
    handle(handler: PipedHandler<P, B, Q, X>): RequestHandler<P, any, B, Q>[] {
        return [...this.handlers, handler as AnyReqHandler];
    }

    build(): RequestHandler<P, any, B, Q>[] {
        return this.handlers;
    }
}

export function pipeMiddleware<P = unknown, B = unknown, Q = unknown, X = unknown>(
    handler: RequestHandler<P, any, B, Q> & { readonly [provides]?: X },
) {
    return new MiddlewarePipe<Neutralize<P>, Neutralize<B>, Neutralize<Q>, ExtOf<X>>([
        handler as AnyReqHandler,
    ]);
}
