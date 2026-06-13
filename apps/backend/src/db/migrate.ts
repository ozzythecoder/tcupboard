import { db } from "@/config/drizzle.js";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "node:path";
import { cwd } from "node:process";

await migrate(db, {
    migrationsFolder: path.join(cwd(), 'src', 'db', 'drizzle')
})