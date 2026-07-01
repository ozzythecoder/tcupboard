import type { Response } from "express";

const ERROR_TAGS = [
    "NOT_FOUND",
    "NETWORK_ERROR",
    "BAD_REQUEST",
    "UNAUTHORIZED",
    "INTERNAL_SERVER_ERROR",
    "NOT_IMPLEMENTED",
] as const;

type ErrorTag = (typeof ERROR_TAGS)[number];

interface ApplicationError extends Error {
    readonly _tag: ErrorTag;
    readonly internalMessage?: string;
    convertResponse: (res: Response) => void;
}

function TaggedError(tag: ErrorTag, status: number, defaultStatusBody: string) {
    return class extends Error implements ApplicationError {
        public readonly _tag: ErrorTag = tag;
        convertResponse(res: Response) {
            return res.status(status).json({ message: defaultStatusBody });
        }
    } as new (
        msg: string,
    ) => ApplicationError;
}

export class BadRequestError
    extends TaggedError("BAD_REQUEST", 400, "Bad Request")
    implements ApplicationError {}
export class UnauthorizedError
    extends TaggedError("UNAUTHORIZED", 401, "Unauthorized")
    implements ApplicationError {}
export class NotFoundError
    extends TaggedError("NOT_FOUND", 404, "Resource not found")
    implements ApplicationError {}
export class NotImplementedError
    extends TaggedError("NOT_IMPLEMENTED", 501, "Not implemented")
    implements ApplicationError {}
export class InternalServerError
    extends TaggedError("INTERNAL_SERVER_ERROR", 500, "Internal Server Error")
    implements ApplicationError {}
export class NetworkError
    extends TaggedError("NETWORK_ERROR", 500, "Server Network Error")
    implements ApplicationError {}

export function isApplicationError(e: unknown): e is ApplicationError {
    return !!e && e instanceof Error && "_tag" in e && ERROR_TAGS.includes((e as any)._tag);
}

export class FatalError extends Error {
    constructor(...message: unknown[]) {
        super(String(message));
        console.error("[ FATAL ERROR ] :", message);
        this.die();
    }

    private die() {
        process.exit(1);
    }
}
