import { writeFile } from "node:fs/promises";
import { config } from "@dotenvx/dotenvx";
import { Pool } from "pg";
import z, { treeifyError, ZodError, type ZodType } from "zod";
import { db } from "../../config/drizzle.ts";
import * as s from "../../db/drizzle/schema.ts";
import * as schema from "./transformation-schema.ts";

config({
    path: ".env.development",
});

const transferDb = new Pool({
    connectionString: process.env.DB_TRANSFER_URL,
});

type EntityName =
    | {
          name: string;
      }
    | {
          new_name: string;
          old_name: string;
      };

type EntityConfig<T extends ZodType> = EntityName & {
    selectQuery: string;
    schema: T;
    shape_override?: (input: Record<string, any>) => Partial<z.input<T>>;
};

type TransformedEntity<T extends ZodType> = {
    data: Array<z.infer<T>>;
    errors: Array<ZodError>;
    errorFields: Record<string, number>;
};

type TransformedEntityMap = Record<string, TransformedEntity<ZodType>>;

function entity<T extends ZodType>(config: EntityConfig<T>): EntityConfig<T> {
    return config;
}

function transformEntity<T>(row: unknown, vSchema: ZodType<T>) {
    return vSchema.safeParse(row);
}

async function transform(config: EntityConfig<ZodType>[]): Promise<TransformedEntityMap> {
    try {
        console.log("Transforming entities to DTOs...");
        const entityMap: TransformedEntityMap = {};
        for (const entity of config) {
            const successRows: any[] = [];
            const errorRows: ZodError[] = [];

            const data = await transferDb.query(entity.selectQuery);
            for (const row of data.rows) {
                const res = entity.shape_override
                    ? transformEntity(entity.shape_override(row), entity.schema)
                    : transformEntity(row, entity.schema);

                if (res.error) {
                    errorRows.push(res.error);
                } else {
                    successRows.push(res.data);
                }
            }
            const affectedFields = errorRows.reduce((pv, cr) => {
                const e = JSON.parse(cr.message);
                const key = e.map((f) => f.path[0]);
                return {
                    ...pv,
                    [key]: pv[key] ? pv[key] + 1 : 1,
                };
            }, {});
            const name = entity.name ?? entity.old_name;
            console.log(
                `Parsed ${data.rowCount} '${name}' with ${errorRows.length} errors.`,
                entity.new_name ? `Renamed to '${entity.new_name}'` : `Retained name '${name}'`,
            );
            if (errorRows.length > 0) {
                console.log(`Fields that returned errors:`, affectedFields);
                console.log("Last error:", errorRows.at(-1));
                process.exit(1);
            }

            const newName = entity.name ?? entity.new_name;
            entityMap[newName] = {
                data: successRows,
                errors: errorRows,
                errorFields: affectedFields,
            };
        }
        console.log("Entities transformed.");
        return entityMap;
    } catch (e) {
        if (e instanceof ZodError) {
            console.error(treeifyError(e));
        }
        console.error(e);
        process.exit(1);
    }
}

async function writeEntityToFile(entityMap: TransformedEntityMap, filename: string): Promise<void> {
    const data = Buffer.from(JSON.stringify(entityMap, null, 2));
    console.log(`Writing to disk at ${filename}...`);
    await writeFile(filename, data, "utf-8");
    console.log("Write complete.");
}

interface HardcodedEntityMap {
    posts: {
        data: z.infer<typeof schema.PostsSchema>[];
    };
    users: {
        data: z.infer<typeof schema.UsersSchema>[];
    };
    tags: {
        data: z.infer<typeof schema.TagSchema>[];
    };
    conversations: {
        data: z.infer<typeof schema.ConversationSchema>[];
    };
    conversation_participants: {
        data: z.infer<typeof schema.ConversationParticipantSchema>[];
    };
    private_messages: {
        data: z.infer<typeof schema.PrivateMessagesSchema>[];
    };
    thread_read_status: {
        data: z.infer<typeof schema.ThreadReadStatusSchema>[];
    };
    post_tags: {
        data: z.infer<typeof schema.PostTagsSchema>[];
    };
    post_reactions: {
        data: z.infer<typeof schema.PostReactionsSchema>[];
    };
}

async function migrate(entityMap: HardcodedEntityMap) {
    try {
        console.log("Beginning database insertion...");
        const res = await db.transaction(async (tx) => {
            const users = await tx.insert(s.users).values(entityMap.users.data);
            console.log("Users inserted.");

            const posts = await tx.insert(s.posts).values(entityMap.posts.data);
            console.log("Posts inserted.");

            const tags = await tx.insert(s.tags).values(entityMap.tags.data);
            console.log("Tags inserted.");

            const conversations = await tx
                .insert(s.conversations)
                .values(entityMap.conversations.data);
            console.log("Conversations inserted.");

            const conversation_participants = await tx
                .insert(s.conversationParticipants)
                .values(entityMap.conversation_participants.data);
            console.log("Conversation participants inserted.");

            const private_messages = await tx
                .insert(s.privateMessages)
                .values(entityMap.private_messages.data);

            console.log("Private messges inserted.");

            const post_tags = await tx.insert(s.postTags).values(entityMap.post_tags.data);
            console.log("Post tags inserted.");

            const post_reactions = await tx
                .insert(s.postReactions)
                .values(entityMap.post_reactions.data);
            console.log("Post reactions inserted.");

            // console.log('\n\n\t\tsuccessful dry run. terminating.\n\n')
            // tx.rollback()
        });
        console.log(res);
        console.log("All tables migrated successfully!");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

const transform_config = [
    entity({
        new_name: "posts",
        old_name: "forum_messages",
        schema: schema.PostsSchema,
        selectQuery: `select fm.*, users.id as author_id from public.forum_messages fm left join public.users on fm.auth0_id = users.auth0_id`,
        shape_override: (row) => ({
            ...row,
            parentId: row.parent_id,
            authorId: row.author_id,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            isEdited: row.is_edited,
            isImported: row.is_imported,
        }),
    }),
    entity({
        name: "users",
        schema: schema.UsersSchema,
        selectQuery: `select * from public.users`,
        shape_override: (row) => ({
            ...row,
            auth0Id: row.auth0_id,
            createdAt: row.created_at,
        }),
    }),
    entity({
        name: "tags",
        schema: schema.TagSchema,
        selectQuery: "select * from public.tags",
    }),
    entity({
        name: "conversations",
        schema: schema.ConversationSchema,
        selectQuery: `select c.id from public.conversations c`,
    }),
    entity({
        name: "post_tags",
        schema: schema.PostTagsSchema,
        selectQuery: "select * from post_tags",
        shape_override: (row) => ({
            ...row,
            postId: row.post_id,
            tagId: row.tag_id,
        }),
    }),
    entity({
        new_name: "post_reactions",
        old_name: "user_reactions",
        schema: schema.PostReactionsSchema,
        selectQuery:
            "select r.*, u.id as user_row_id from user_reactions r left join users u on u.auth0_id = r.user_id",
        shape_override: (row) => ({
            ...row,
            userId: row.user_row_id,
            postId: row.post_id,
            createdAt: row.created_at,
        }),
    }),
    entity({
        name: "conversation_participants",
        schema: schema.ConversationParticipantSchema,
        selectQuery: `
            select distinct c.id as conversation_id, u.id as user_id
            from direct_messages m
                    left join conversations c on
                (c.user1 = sender_id or c.user2 = sender_id)
                    and (c.user1 = recipient_id or c.user2 = recipient_id)
                    left join users u on (u.auth0_id = recipient_id or u.auth0_id = sender_id)
            ;`,
        shape_override: (row) => ({
            ...row,
            conversationId: row.conversation_id,
            userId: row.user_id,
        }),
    }),
    entity({
            old_name: "direct_messages",
            new_name: "private_messages",
            schema: schema.PrivateMessagesSchema,
            selectQuery: `
            with unique_conversations
                     as (select distinct on (least(user1, user2), greatest(user1, user2))
                             id,
                             user1,
                             user2
                         from conversations
                         order by least(user1, user2), greatest(user1, user2), id)
            select
                u.id as sender_id,
                c.id as conversation_id,
                m.id,
                m.content,
                m.created_at,
                m.images
            from direct_messages m
                     inner join unique_conversations c
                                on least(c.user1, c.user2) = least(m.sender_id, m.recipient_id)
                                    and greatest(c.user1, c.user2) = greatest(m.sender_id, m.recipient_id)
                     inner join users u
                                on u.auth0_id = m.sender_id;
            `,
            shape_override: (row) => ({
                ...row,
                conversationId: row.conversation_id,
                senderId: row.sender_id,
                createdAt: row.created_at,
            }),
        })
];

async function test_validation() {
    const e = entity({
        old_name: "direct_messages",
        new_name: "private_messages",
        schema: schema.PrivateMessagesSchema,
        selectQuery: `
        with unique_conversations
                 as (select distinct on (least(user1, user2), greatest(user1, user2))
                         id,
                         user1,
                         user2
                     from conversations
                     order by least(user1, user2), greatest(user1, user2), id)
        select
            u.id as sender_id,
            c.id as conversation_id,
            m.id,
            m.content,
            m.created_at,
            m.images
        from direct_messages m
                 inner join unique_conversations c
                            on least(c.user1, c.user2) = least(m.sender_id, m.recipient_id)
                                and greatest(c.user1, c.user2) = greatest(m.sender_id, m.recipient_id)
                 inner join users u
                            on u.auth0_id = m.sender_id;
        `,
        shape_override: (row) => ({
            ...row,
            conversationId: row.conversation_id,
            senderId: row.sender_id,
            createdAt: row.created_at,
        }),
    });
    const f = await transferDb.query(e.selectQuery);

    let x = 0;

    for (const r of f.rows) {
        const t = e.shape_override?.(r) ?? r;
        const res = e.schema.safeParse(t);
        if (res.error) {
            console.log(t)
            console.log(res.error)
            process.exit(1)
        }
        x += 1;
    }
    console.log('processed', x, 'records')

    return;
}

async function main() {
    console.log("### Beginning DB transfer ###");
    const entityMap = await transform(transform_config);
    void writeEntityToFile(entityMap, "./entity_map.json");
    await migrate(entityMap as unknown as HardcodedEntityMap);
}

// test_validation();
void main();

