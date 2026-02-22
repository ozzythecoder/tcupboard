import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
    return {
        plugins: [react()],
        build: {
            outDir: "build",
        },
        test: {
            globals: true,
            environment: "jsdom",
            setupFiles: ["./src/setupTests.ts"],
        },
        server: {
            port: 5173,
            host: true,
        },
        // resolve js files to jsx
        esbuild: {
            loader: "jsx",
            include: /.*\.jsx?$/,
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
    };
});
