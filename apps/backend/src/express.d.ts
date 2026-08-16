/**
 * The authenticated user attached to `req.user` by {@link authGuard}.
 */
interface Auth0User {
    /** The user's database ID. */
    id: DbUserId;
    /** The user's Auth0 ID. */
    sub: Auth0UserId;
    roles: Array<string>; // renamed from "https://tcupboard.org/roles" when initialized
    "https://tcupboard.org/username"?: string;
}

type DbUserId = number & { __brand: "userId" };
type Auth0UserId = string & { __brand: "auth0UserId" };

interface ParamsDictionary {
    [key: string]: string | string[];
    [key: number]: string;
}

declare namespace Express {
    export interface Request {
        user?: Auth0User;
    }
}
