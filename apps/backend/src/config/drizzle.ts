import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/drizzle/schema.js";
import { env } from "./env.js";

export const db = drizzle(env.db.connectionString!, { schema });
