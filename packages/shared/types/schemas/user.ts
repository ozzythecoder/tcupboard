import { z } from "zod";
import type { User } from "@/models/index.js";
import { type ZodRichTextContent, ZRichTextContentSchema } from "./rich-text.js";

export const ZUserRoleSchema = z.enum(["user", "admin", "moderator", "superadmin"]);

export const ZCreateUserSchema = z.object({
    email: z.string(),
    role: ZUserRoleSchema,
    username: z.string(),
    avatarUrl: z.url().nullish(),
});
export type CreateUser = z.infer<typeof ZCreateUserSchema>;

export const ZUpdateUserSchema = z.object({
    // protected fields
    id: z.never().optional(), // never changes
    auth0Id: z.never().optional(), // never changes
    createdAt: z.never().optional(), // never changes
    email: z.never().optional(), // handled by Auth0 / specific route
    role: z.never().optional(), // never changed by user

    username: z.string(),
    avatarUrl: z.url().nullish(),
    avatarFile: z.file().nullish(),
    // hideous type cast to avoid recursive type hell
    bio: ZRichTextContentSchema.nullish() as unknown as z.ZodOptional<
        z.ZodNullable<ZodRichTextContent>
    >,
    tagline: z.string().nullish(),
});
export type UpdateUser = z.infer<typeof ZUpdateUserSchema>;

export const ZProfileUpdateSchema = z.object({
    avatarUrl: z.url().nullish(),
    avatarFile: z.file().nullish(),
    username: z.string(),
    tagline: z.string().nullish(),
    bio: ZRichTextContentSchema.nullish() as unknown as z.ZodOptional<
        z.ZodNullable<ZodRichTextContent>
    >,
});
export type ProfileUpdate = z.infer<typeof ZProfileUpdateSchema>;

export function toUpdateUser(user: User): UpdateUser {
    // oxlint-disable-next-line no-unused-vars
    const { id, auth0Id, email, role, createdAt, ...rest } = user;
    return rest;
}
