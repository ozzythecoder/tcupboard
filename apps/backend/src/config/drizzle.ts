import * as schema from "@repo/shared/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "./env.js";

export const db = drizzle(env.db.connectionString, { schema });
