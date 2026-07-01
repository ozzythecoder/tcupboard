import * as schema from "@repo/shared/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/config/env.js";

const db = drizzle(env.db.connectionString, {
    schema,
    casing: "camelCase",
});

export { db, schema as s };
export type Database = typeof db;
export type Schema = typeof schema;
