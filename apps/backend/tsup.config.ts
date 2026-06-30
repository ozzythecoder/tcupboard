import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        server: "src/server.ts",
    },
    tsconfig: "tsconfig.json",
    format: ["esm"],
    clean: true,
});
