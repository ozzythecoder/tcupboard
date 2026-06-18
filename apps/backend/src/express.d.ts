interface Auth0User {
    id: number;
    name: string;
    nickname: string;
    picture: string;
    email: string;
    email_verified: boolean;
    updated_at: string;
    sub: string;
    "https://tcupboard.org/username": string;
    roles: Array<string>; // renamed from "https://tcupboard.org/roles" when initialized
}

interface ParamsDictionary {
    [key: string]: string | string[];
    [key: number]: string;
}

declare namespace Express {
    export interface Request {
        user?: Auth0User;
    }
}
