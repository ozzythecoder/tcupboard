import { config } from "@dotenvx/dotenvx";
import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env.js";

config({
    path: ".env.development",
});

export default defineConfig({
    dialect: "postgresql",
    out: "./src/db/drizzle",
    schema: "./src/db/drizzle/schema.ts",
    dbCredentials: {
        url: process.env.NEON_URL,
    },
    verbose: true,
    casing: "camelCase",
});
