import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "path";

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
    },
    resolve: {
        tsconfigPaths: true,
        alias: {
            "@repo/shared": resolve(import.meta.dirname, "../../packages/shared/types/index.ts"),
        },
    },
    server: {
        port: 5173,
        host: true,
    },
    define: {
        // Polyfill global for Node.js packages like fbjs
        global: "globalThis",
    },
});
