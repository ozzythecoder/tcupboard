import { config } from "@dotenvx/dotenvx";
import { defineConfig } from "drizzle-kit";

config({
    path: ".env",
});

export default defineConfig({
    dialect: "postgresql",
    out: "./drizzle/migrations",
    schema: "./drizzle/schema.ts",
    dbCredentials: {
        url: process.env.NEON_DEV_URL!,
    },
    verbose: true,
    introspect: {
        casing: 'camel'
    },
    // tablesFilter: ["!directus_*"]
});
