import { createDirectus, rest } from "@directus/sdk";
import { env } from "./env.js";

export const directus = createDirectus("http://directus:8055", {
    globals: {
        fetch: (input, init) =>
            fetch(input, {
                ...init,
                headers: {
                    Authorization: `Bearer ${env.directus.apiKey}`,
                },
            }),
    },
}).with(rest());

export type CmsClient = typeof directus;