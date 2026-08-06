import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        tanstackRouter({
            target: "react",
            autoCodeSplitting: true,
        }),
        tailwindcss(),
        react(),
    ],
    optimizeDeps: {
        exclude: ["@repo/shared"],
        extensions: [".ts"],
    },
    build: {
        outDir: "dist",
        rolldownOptions: {
            external: ["path", "fs", "url", "source-map-js"],
        },
    },
    resolve: {
        tsconfigPaths: true,
        alias: {
            "@repo/shared": resolve(import.meta.dirname, "../../packages/shared/types/index.ts"),
        },
    },
    server: {
        port: 5173,
        host: "0.0.0.0",
        headers: {
            "Content-Security-Policy": `frame-ancestors 'self' ${process.env.VITE_DIRECTUS_URL}`,
        }
    },
    preview: {
        port: 5173,
    },
    define: {
        // Polyfill global for Node.js packages like fbjs
        global: "globalThis",
    },
});
