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
    primaryKey,
    serial,
    text,
    timestamp,
    unique,
    varchar,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin", "moderator", "superadmin"]);

export const users = pgTable(
    "users",
    {
        id: integer()
            .primaryKey()
            .generatedByDefaultAsIdentity({
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
        index("users_id_auth0id_idx").using(
            "btree",
            table.id.asc().nullsLast().op("int4_ops"),
            table.auth0Id.asc().nullsLast().op("text_ops"),
        ),
        index("users_username_idx").using(
            "btree",
            table.id.asc().nullsLast().op("int4_ops"),
            table.username.asc().nullsLast().op("text_ops"),
        ),
        unique("users_auth0_id_key").on(table.auth0Id),
    ],
);

export const conversations = pgTable("conversations", {
    id: serial().primaryKey().notNull(),
});

export const conversationParticipants = pgTable(
    "conversation_participants",
    {
        conversationId: integer()
            .notNull()
            .references(() => conversations.id, { onDelete: "cascade" }),
        userId: integer()
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
    },
    (t) => [primaryKey({ columns: [t.conversationId, t.userId] })],
);

export const privateMessages = pgTable(
    "private_messages",
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity(),
        conversationId: integer("conversation_id")
            .notNull()
            .references(() => conversations.id, { onDelete: "cascade" }),
        senderId: integer("sender_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        content: jsonb().notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
            .default(sql`current_timestamp`)
            .notNull(),
        images: jsonb().default([]),
    },
    (table) => [
        index("direct_messages_sender_id_idx").using(
            "btree",
            table.senderId.asc().nullsLast().op("int4_ops"),
        ),
        index("idx_direct_messages_created_at").using(
            "btree",
            table.createdAt.asc().nullsLast().op("timestamptz_ops"),
        ),
    ],
);

export const posts = pgTable(
    "posts",
    {
        id: integer()
            .primaryKey()
            .generatedByDefaultAsIdentity({
                name: "posts_id_seq",
                startWith: 1,
                increment: 1,
                minValue: 1,
                maxValue: 2147483647,
                cache: 1,
            }),
        content: jsonb().notNull(),
        authorId: integer("author_id").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
            .default(sql`timezone('utc'::text, now())`)
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
            .default(sql`timezone('utc'::text, now())`)
            .notNull(),
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
        index("forum_messages_authorid_idx").using(
            "btree",
            table.authorId.asc().nullsLast().op("int4_ops"),
        ),
        index("forum_messages_id_authorid_idx").using(
            "btree",
            table.id.asc().nullsLast().op("int4_ops"),
            table.authorId.asc().nullsLast().op("int4_ops"),
        ),
        index("idx_parent_id").using("btree", table.parentId.asc().nullsLast().op("int4_ops")),
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

export const tags = pgTable(
    "tags",
    {
        id: serial().primaryKey().notNull(),
        name: text().notNull(),
        description: text(),
    },
    (table) => [unique("tags_name_key").on(table.name)],
);

export const threadReadStatus = pgTable(
    "thread_read_status",
    {
        id: integer()
            .primaryKey()
            .generatedByDefaultAsIdentity({
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
        index("idx_thread_read_status_thread_id").using(
            "btree",
            table.threadId.asc().nullsLast().op("int4_ops"),
        ),
        index("idx_thread_read_status_user_id").using(
            "btree",
            table.userId.asc().nullsLast().op("int4_ops"),
        ),
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
        unique("thread_read_status_user_id_thread_id_key").on(table.threadId, table.userId),
    ],
);

export const postReactions = pgTable(
    "post_reactions",
    {
        id: integer()
            .primaryKey()
            .generatedByDefaultAsIdentity({
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
        primaryKey({ columns: [table.postId, table.tagId], name: "post_tags_pkey" }),
    ],
);
