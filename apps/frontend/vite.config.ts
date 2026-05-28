import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "build",
    },
    resolve: {
        tsconfigPaths: true
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
