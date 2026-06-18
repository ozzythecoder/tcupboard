import { env } from "@/config/env.js";
import * as schema from "@/db/drizzle/schema.js";
import * as relations from "@/db/drizzle/relations.js";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(env.db.connectionString!, {
    schema: { ...schema, ...relations },
    casing: "camelCase",
});

export { db, schema as s };
export type Database = typeof db;
export type Schema = typeof schema;
