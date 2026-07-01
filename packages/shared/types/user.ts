export interface Auth0User {
    name: string;
    nickname: string;
    picture: string;
    email: string;
    email_verified: boolean;
    updated_at: string;
    sub: string;
    "https://tcupboard.org/username": string;
    "https://tcupboard.org/roles": Array<string>;
}
