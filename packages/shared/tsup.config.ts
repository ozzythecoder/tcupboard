import { defineConfig } from "tsup";
export default defineConfig({
    entry: {
        "types/index": "types/index.ts",
        "drizzle/index": "drizzle/index.ts",
    },
    tsconfig: "tsconfig.build.json",
    format: ["esm"],
    dts: true,
    clean: true,
});
