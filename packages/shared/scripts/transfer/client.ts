import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.NEON_DEV_URL!)
