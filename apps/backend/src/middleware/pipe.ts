import type { RequestHandler } from "express";

type AnyReqHandler = RequestHandler<any, any, any, any>;

class MiddlewarePipe<P, B, Q> {
    private handlers: AnyReqHandler[] = [];

    constructor(handler: RequestHandler<P, any, B, Q>) {
        this.handlers = [handler];
    }

    pipe<P2, B2, Q2>(handler: RequestHandler<P2, any, B2, Q2>) {
        const next = new MiddlewarePipe<P & P2, B & B2, Q & Q2>(handler);
        next.handlers = [...this.handlers, handler];
        return next;
    }

    build(): RequestHandler<P, any, B, Q>[] {
        return this.handlers;
    }
}

export function pipeMiddleware<P, B, Q>(handler: RequestHandler<P, any, B, Q>) {
    return new MiddlewarePipe<P, B, Q>(handler);
}
