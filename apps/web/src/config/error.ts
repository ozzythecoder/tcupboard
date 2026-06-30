import { isHTTPError, isNetworkError } from "ky";

type AppErrorTag =
    | "BAD_REQUEST"
    | "UNAUTHORIZED"
    | "INTERNAL_SERVER_ERROR"
    | "NOT_FOUND"
    | "NETWORK_ERROR";

interface AppError extends Error {
    readonly _tag: AppErrorTag;
}

function TaggedError(tag: AppErrorTag) {
    return class extends Error {
        public readonly _tag: string = tag;
    } as new (
        message: string,
    ) => AppError;
}

export class BadRequestError extends TaggedError("BAD_REQUEST") {
    constructor(
        public readonly message: string = "Bad Request",
        public readonly details?: string,
    ) {
        super(message);
    }
}

export class UnauthorizedError extends TaggedError("UNAUTHORIZED") {
    constructor(
        public readonly message: string = "Unauthorized",
        public readonly details?: string,
    ) {
        super(message);
    }
}

export class NotFoundError extends TaggedError("NOT_FOUND") {
    constructor(
        public readonly message: string = "The requested resource was not found.",
        public readonly details?: string,
    ) {
        super(message);
    }
}
export class InternalServerError extends TaggedError("INTERNAL_SERVER_ERROR") {}
export class AppNetworkError extends TaggedError("NETWORK_ERROR") {}

export function isAppError(e: unknown): e is AppError {
    return !!e && e instanceof Error && "_tag" in e;
}

export function handleHttpError(e: unknown) {
    if (isNetworkError(e)) {
        return new AppNetworkError("Network error – check your internet connection.");
    }

    if (isHTTPError(e)) {
        switch (e.response.status) {
            case 400:
                return new BadRequestError();
            case 401:
                return new UnauthorizedError();
            case 404:
                return new NotFoundError();
            default:
                console.error(e.message);
                return new InternalServerError("Something went wrong.");
        }
    }
    return e;
}
