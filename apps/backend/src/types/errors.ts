import type { Response } from "express";
import { DatabaseError } from "pg";

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

export function isPgError(e: unknown): e is DatabaseError {
    return e instanceof DatabaseError;
}

/**
 * Postgres error codes by their name.
 */
export const PG = {
    UNIQUE_VIOLATION: "23505",
    FOREIGN_KEY_VIOLATION: "23503",
    NOT_NULL_VIOLATION: "23502",
    CHECK_VIOLATION: "23514",
    EXCLUSION_VIOLATION: "23P01",
    SERIALIZATION_FAILURE: "40001",
    DEADLOCK_DETECTED: "40P01",
    LOCK_NOT_AVAILABLE: "55P03",
    QUERY_CANCELED: "57014",
} as const;

/**
 * Performs the database query, and re-maps errors from postgres errors to an error from
 * the supplied map.
 *
 * @param fn the database call.
 * @param map the error(s) to throw, keyed on the constraint that was violated.
 * @returns the result of the database call.
 * @example 
 * ```ts
 * mapPgErrors(
 *      () => db.query.users.create(user),
 *      {
 *          users_email_key: () => 
 *              new BadRequestError("Email is already in use"),
 *          // other errors...
 *      }
 * )
 * ```
 */
export async function mapPgErrors<T>(
    fn: () => Promise<T>,
    map: Record<string, () => ApplicationError>,
): Promise<T> {
    try {
        return await fn();
    } catch (e) {
        if (isPgError(e) && e.constraint && map[e.constraint]) throw map[e.constraint]();
        throw e;
    }
}
