import type * as schema from "@drizzle/schema.ts";

export type User = typeof schema.users.$inferSelect;

export type Post = typeof schema.posts.$inferSelect;
export type PostWithAuthor = Post & {
    author: User["username"];
    authorAvatar: User["avatarUrl"];
};
export type PostTag = typeof schema.tags.$inferSelect;
export type PostReaction = typeof schema.postReactions.$inferSelect;
export type PostReactionWithUsername = PostReaction & {
    username: User["username"];
};
export type PrivateMessage = typeof schema.privateMessages.$inferSelect;
export type PostWithReplies = typeof schema.threadsWithReplies.$inferSelect;
