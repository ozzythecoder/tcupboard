import path from "node:path";
import { cwd } from "node:process";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index.js";

await migrate(db, {
    migrationsFolder: path.join(cwd(), "src", "db", "drizzle"),
});
