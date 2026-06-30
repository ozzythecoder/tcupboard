import type { Tables } from "./models.js";

export type Image = { url: string; width: number; height: number; publicId: string };

export type ForumMessage = Tables<"forum_messages">;
export type ForumMessageWithReplyDetails = Tables<"forum_messages_with_last_reply">;

export interface Auth0User {
    name: string;
    nickname: string;
    picture: string;
    email: string;
    email_verified: boolean;
    updated_at: string;
    sub: string;
    "https://tcupboard.org/username": string;
    "https://tcupboard.org/roles": Array<unknown>;
}
