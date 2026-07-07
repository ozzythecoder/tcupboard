import { sql } from "drizzle-orm";
import {
    boolean,
    check,
    foreignKey,
    index,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    pgView,
    primaryKey,
    serial,
    text,
    timestamp,
    unique,
    varchar,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin", "moderator", "superadmin"]);

export const conversations = pgTable("conversations", {
    id: serial().primaryKey().notNull(),
});

export const tags = pgTable(
    "tags",
    {
        id: serial().primaryKey().notNull(),
        name: text().notNull(),
        description: text(),
    },
    (table) => [unique("tags_name_key").on(table.name)],
);

const lifecycleDates = {
    createdAt: timestamp("created_at", { mode: "string" })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
};

export const users = pgTable(
    "users",
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity({
            name: "users_id_seq",
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        email: text().notNull(),
        username: varchar({ length: 255 }).notNull(),
        avatarUrl: text("avatar_url"),
        auth0Id: varchar("auth0_id", { length: 255 }).notNull(),
        bio: text(),
        createdAt: timestamp("created_at", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        role: userRole().default("user").notNull(),
        tagline: text(),
    },
    (table) => [
        index("users_id_auth0id_idx").on(table.id, table.auth0Id),
        index("users_username_idx").on(table.username),
        unique("users_auth0_id_key").on(table.auth0Id),
    ],
);

export const posts = pgTable(
    "posts",
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity({
            name: "posts_id_seq",
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        content: jsonb().notNull(),
        authorId: integer("author_id").notNull(),
        ...lifecycleDates,
        isEdited: boolean("is_edited").default(false),
        parentId: integer("parent_id"),
        title: text(),
        images: jsonb().default([]),
        isImported: boolean("is_imported").default(false),
        importedAuthorName: text("imported_author_name"),
        importedDate: text("imported_date"),
        importedAvatarUrl: text("imported_avatar_url"),
    },
    (table) => [
        index("forum_messages_authorid_idx").on(table.authorId),
        index("forum_messages_id_authorid_idx").on(table.id, table.authorId),
        index("idx_parent_id").on(table.parentId),
        foreignKey({
            columns: [table.authorId],
            foreignColumns: [users.id],
            name: "posts_user_id_users_id_fk",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
        foreignKey({
            columns: [table.authorId],
            foreignColumns: [users.id],
            name: "forum_messages_user_id_fkey",
        }),
        foreignKey({
            columns: [table.parentId],
            foreignColumns: [table.id],
            name: "forum_messages_parent_id_fkey",
        }),
        check("thread_starter_has_title", sql`(parent_id IS NOT NULL) OR (title IS NOT NULL)`),
        check("no_self_reference", sql`parent_id <> id`),
    ],
);

export const postReactions = pgTable(
    "post_reactions",
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity({
            name: "user_reactions_id_seq",
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        postId: integer("post_id").notNull(),
        userId: integer("user_id").notNull(),
        type: varchar({ length: 12 }).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
            .default(sql`timezone('utc'::text, now())`)
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.postId],
            foreignColumns: [posts.id],
            name: "user_reactions_post_id_posts_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "user_reactions_user_id_users_id_fk",
        }).onDelete("cascade"),
    ],
);

export const privateMessages = pgTable(
    "private_messages",
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity({
            name: "private_messages_id_seq",
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        conversationId: integer("conversation_id").notNull(),
        senderId: integer("sender_id").notNull(),
        content: jsonb().notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        images: jsonb().default([]),
    },
    (table) => [
        index("direct_messages_sender_id_idx").on(table.senderId),
        index("idx_direct_messages_created_at").on(table.createdAt),
        foreignKey({
            columns: [table.conversationId],
            foreignColumns: [conversations.id],
            name: "private_messages_conversation_id_conversations_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.senderId],
            foreignColumns: [users.id],
            name: "private_messages_sender_id_users_id_fk",
        }).onDelete("cascade"),
    ],
);

export const threadReadStatus = pgTable(
    "thread_read_status",
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity({
            name: "thread_read_status_id_seq",
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        userId: integer("user_id").notNull(),
        threadId: integer("thread_id").notNull(),
        lastReadAt: timestamp("last_read_at", { withTimezone: true, mode: "string" })
            .default(sql`timezone('utc'::text, now())`)
            .notNull(),
    },
    (table) => [
        index("idx_thread_read_status_thread_id").on(table.threadId),
        index("idx_thread_read_status_user_id").on(table.userId),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "thread_read_status_user_id_users_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.threadId],
            foreignColumns: [posts.id],
            name: "thread_read_status_thread_id_posts_id_fk",
        }).onDelete("cascade"),
        unique("thread_read_status_user_id_thread_id_key").on(table.userId, table.threadId),
    ],
);

export const conversationParticipants = pgTable(
    "conversation_participants",
    {
        conversationId: integer().notNull(),
        userId: integer().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.conversationId],
            foreignColumns: [conversations.id],
            name: "conversation_participants_conversationId_conversations_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
            name: "conversation_participants_userId_users_id_fk",
        }).onDelete("cascade"),
        primaryKey({
            columns: [table.userId, table.conversationId],
            name: "conversation_participants_conversationId_userId_pk",
        }),
    ],
);

export const postTags = pgTable(
    "post_tags",
    {
        postId: integer("post_id").notNull(),
        tagId: integer("tag_id").notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.postId],
            foreignColumns: [posts.id],
            name: "post_tags_post_id_posts_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.tagId],
            foreignColumns: [tags.id],
            name: "post_tags_tag_id_tags_id_fk",
        }).onDelete("cascade"),
        foreignKey({
            columns: [table.postId],
            foreignColumns: [posts.id],
            name: "post_tags_post_id_fkey",
        }),
        foreignKey({
            columns: [table.tagId],
            foreignColumns: [tags.id],
            name: "post_tags_tag_id_fkey",
        }),
        primaryKey({ columns: [table.tagId, table.postId], name: "post_tags_pkey" }),
    ],
);

export const threadsWithReplies = pgView("posts_with_replies", {
    id: integer().primaryKey(),
    content: jsonb().notNull(),
    authorId: integer("author_id")
        .references(() => users.id)
        .notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    deletedAt: timestamp("deleted_at"),
    isEdited: boolean("is_edited").notNull(),
    parentId: integer("parent_id"),
    title: text().notNull(),
    images: jsonb().default([]),
    isImported: boolean("is_imported").notNull(),
    importedAuthorName: text("imported_author_name"),
    importedDate: text("imported_date"),
    importedAvatarUrl: text("imported_avatar_url"),
    authorAvatar: text("author_avatar"),
    authorName: text("author_name").notNull(),
    tags: jsonb(),
    latestReplyDate: timestamp("latest_reply_date"),
    latestReplyAuthor: text("latest_reply_author"),
    latestReplyAuthorId: integer("latest_reply_author_id").references(() => users.id),
    latestReplyAuthorAvatar: text("latest_reply_author_avatar"),
    replyCount: integer("reply_count"),
}).as(sql`
    select
      threads.*,
      thread_authors.avatar_url as author_avatar,
      thread_authors.username as author_name,
      coalesce(thread_tags.tags, '[]'::json) as tags,
      replies.latest_reply_date,
      replies.latest_reply_author,
      replies.latest_reply_author_id,
      replies.latest_reply_author_avatar,
      replies_count.reply_count
    from
      public.posts as threads
      left join public.users as thread_authors on threads.author_id = thread_authors.id
      left join (
        select pt.post_id,
          json_agg(
            json_build_object(
              'id', t.id,
              'name', t.name,
              'description', t.description
            )
          ) as tags
        from public.post_tags pt
          join public.tags t on pt.tag_id = t.id
        group by pt.post_id
      ) as thread_tags on thread_tags.post_id = threads.id
      left join (
        select distinct
          on (m.parent_id) m.parent_id,
          m.author_id as latest_reply_author_id,
          u.username as latest_reply_author,
          u.avatar_url as latest_reply_author_avatar,
          m.created_at as latest_reply_date
        from
          public.posts m
          left join public.users u on u.id = m.author_id
        where
          m.parent_id is not null
        order by
          m.parent_id,
          m.created_at desc
      ) as replies on replies.parent_id = threads.id
      left join (
        select
          parent_id,
          count(*) as reply_count
        from
          public.posts
        where
          parent_id is not null
        group by
          parent_id
      ) as replies_count on replies_count.parent_id = threads.id
    where
      threads.parent_id is null
    order by
      coalesce(replies.latest_reply_date, threads.created_at) desc
    `);
