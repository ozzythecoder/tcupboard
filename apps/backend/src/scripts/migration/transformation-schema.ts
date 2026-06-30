import { z } from "zod";

export const IdSchema = z.coerce
    .number()
    .refine(
        (v) => v !== 0,
        "ID was parsed to 0, which is not allowed. This may mean that a null value was passed.",
    );
const DateSchema = z.coerce.date<string>().transform((v) => v.toISOString());
const NullishJsonSchema = z.json().nullish();

export const TagSchema = z.object({
    id: IdSchema,
    name: z.string(),
    description: z.string().nullish(),
});

export const ConversationSchema = z.object({
    id: IdSchema,
});

export const ConversationParticipantSchema = z.object({
    conversationId: IdSchema,
    userId: IdSchema,
});

export const PrivateMessagesSchema = z.object({
    id: IdSchema,
    conversationId: IdSchema,
    senderId: IdSchema,
    content: z.json(),
    createdAt: DateSchema,
    images: NullishJsonSchema,
});

export const PostsSchema = z
    .object({
        id: IdSchema,
        createdAt: DateSchema,
        updatedAt: DateSchema,
        content: z.json(),
        authorId: IdSchema,
        isEdited: z.boolean(),
        parentId: IdSchema.nullish(),
        title: z.string().nullish(),
        images: NullishJsonSchema,
        isImported: z.boolean().nullish(),
        importedAuthorName: z.string().nullish(),
        importedDate: DateSchema.nullish(),
        importedAvatarUrl: z.string().nullish(),
    })
    .refine((p) => p.parentId !== p.id, {
        path: ["parentId"],
        error: "No self-reference (post's parent id should not be its own)",
    })
    .refine((p) => p.parentId || p.title, {
        path: ["title", "parentId"],
        error: "Standalone posts must have a title.",
    });

export const RoleSchema = z.enum(["user", "admin", "moderator", "superadmin"]);

export const convertStringToTipTap = (v: string) => ({
    type: "doc",
    content: [
        {
            type: "paragraph",
            content: [
                {
                    type: "text",
                    text: v,
                },
            ],
        },
    ],
});

export const BioSchema = z.string().transform(convertStringToTipTap);

export const UsersSchema = z.object({
    id: IdSchema,
    email: z.string(),
    username: z.string().max(255, "username too long"),
    avatarUrl: z.string().nullish(),
    auth0Id: z.string(),
    bio: BioSchema.nullish(),
    createdAt: DateSchema,
    role: RoleSchema,
    tagline: z.string().nullish(),
});

export const PostReactionsSchema = z.object({
    id: IdSchema,
    postId: IdSchema,
    userId: IdSchema,
    type: z.string(),
    createdAt: DateSchema,
});

export const ThreadReadStatusSchema = z.object({
    id: IdSchema,
    userId: IdSchema,
    threadId: IdSchema,
    lastReadAt: DateSchema,
});

export const PostTagsSchema = z.object({
    postId: IdSchema,
    tagId: IdSchema,
});
