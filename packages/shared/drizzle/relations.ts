import { relations } from "drizzle-orm/relations";
import {
    conversationParticipants,
    conversations,
    postReactions,
    posts,
    postTags,
    privateMessages,
    tags,
    threadReadStatus,
    users,
} from "./schema.js";

export const postReactionsRelations = relations(postReactions, ({ one }) => ({
    post: one(posts, {
        fields: [postReactions.postId],
        references: [posts.id],
    }),
    user: one(users, {
        fields: [postReactions.userId],
        references: [users.id],
    }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
    postReactions: many(postReactions),
    user_authorId: one(users, {
        fields: [posts.authorId],
        references: [users.id],
        relationName: "posts_authorId_users_id",
    }),
    post: one(posts, {
        fields: [posts.parentId],
        references: [posts.id],
        relationName: "posts_parentId_posts_id",
    }),
    posts: many(posts, {
        relationName: "posts_parentId_posts_id",
    }),
    threadReadStatuses: many(threadReadStatus),
    postTags_postId: many(postTags, {
        relationName: "postTags_postId_posts_id",
    }),
}));

export const usersRelations = relations(users, ({ many }) => ({
    postReactions: many(postReactions),
    posts_authorId: many(posts, {
        relationName: "posts_authorId_users_id",
    }),
    privateMessages: many(privateMessages),
    threadReadStatuses: many(threadReadStatus),
    conversationParticipants: many(conversationParticipants),
}));

export const privateMessagesRelations = relations(privateMessages, ({ one }) => ({
    conversation: one(conversations, {
        fields: [privateMessages.conversationId],
        references: [conversations.id],
    }),
    user: one(users, {
        fields: [privateMessages.senderId],
        references: [users.id],
    }),
}));

export const conversationsRelations = relations(conversations, ({ many }) => ({
    privateMessages: many(privateMessages),
    conversationParticipants: many(conversationParticipants),
}));

export const threadReadStatusRelations = relations(threadReadStatus, ({ one }) => ({
    user: one(users, {
        fields: [threadReadStatus.userId],
        references: [users.id],
    }),
    post: one(posts, {
        fields: [threadReadStatus.threadId],
        references: [posts.id],
    }),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
    post_postId: one(posts, {
        fields: [postTags.postId],
        references: [posts.id],
        relationName: "postTags_postId_posts_id",
    }),
    tag_tagId: one(tags, {
        fields: [postTags.tagId],
        references: [tags.id],
        relationName: "postTags_tagId_tags_id",
    }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
    postTags_tagId: many(postTags, {
        relationName: "postTags_tagId_tags_id",
    }),
}));

export const conversationParticipantsRelations = relations(conversationParticipants, ({ one }) => ({
    conversation: one(conversations, {
        fields: [conversationParticipants.conversationId],
        references: [conversations.id],
    }),
    user: one(users, {
        fields: [conversationParticipants.userId],
        references: [users.id],
    }),
}));
