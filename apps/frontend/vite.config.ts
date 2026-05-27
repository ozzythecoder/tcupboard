import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "build",
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/setupTests.ts"],
        passWithNoTests: true,
    },
    server: {
        port: 5173,
        host: true,
    },
    // resolve js files to jsx
    esbuild: {
        loader: "jsx",
        include: /.*\.(jsx|tsx)?$/,
        exclude: [],
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                ".js": "jsx",
            },
            define: {
                global: "globalThis",
            },
        },
    },
    define: {
        // Polyfill global for Node.js packages like fbjs
        global: "globalThis",
    },
});
