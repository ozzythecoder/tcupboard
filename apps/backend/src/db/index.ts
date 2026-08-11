import { relations, schema } from "@repo/shared/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/config/env.js";

const db = drizzle({
    connection: env.db.connectionString,
    relations,
});

export { db, schema as s };
export type Database = typeof db;
export type Schema = typeof schema;
