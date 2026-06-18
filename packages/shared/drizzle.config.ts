import { config } from "@dotenvx/dotenvx";
import { defineConfig } from "drizzle-kit";

config({
    path: ".env",
});

export default defineConfig({
    dialect: "postgresql",
    out: "./drizzle",
    schema: "./drizzle/schema.ts",
    dbCredentials: {
        url: process.env.NEON_URL!,
    },
    verbose: true,
    casing: "camelCase",
});
