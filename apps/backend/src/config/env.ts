import { config } from "@dotenvx/dotenvx";
import { z } from "zod";
import { FatalError } from "@/types/errors.js";

config({
    path: ".env.development",
});

const envSchema = z.object({
    dev: z.boolean(),
    privateAdminKey: z.string(),
    allowedOrigins: z.array(z.string()),
    cloudinary: z.object({
        cloud_name: z.string(),
        apiKey: z.string(),
        apiSecret: z.string(),
    }),
    directus: z.object({
        internalUrl: z.string(),
        publicUrl: z.string(),
        apiKey: z.string(),
    }),
    db: z.object({
        connectionString: z.string(),
    }),
    auth0: z.object({
        domain: z.url(),
        apiIdentifier: z.url(),
        clientId: z.string(),
        clientSecret: z.string(),
    }),
});

type RecordWithDeepUnknownKeys<T> = T extends object
    ? { [K in keyof T]: RecordWithDeepUnknownKeys<T[K]> }
    : unknown;

const envShape: RecordWithDeepUnknownKeys<AppEnv> = {
    dev: process.env.NODE_ENV !== "production",
    privateAdminKey: process.env.PRIVATE_ADMIN_KEY,
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") as unknown[],
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    directus: {
        internalUrl: process.env.DIRECTUS_INTERNAL_URL,
        publicUrl: process.env.DIRECTUS_PUBLIC_URL,
        apiKey: process.env.DIRECTUS_API_KEY,
    },
    db: {
        connectionString: process.env.NEON_URL,
    },
    auth0: {
        domain: process.env.AUTH0_DOMAIN,
        apiIdentifier: process.env.AUTH0_API_IDENTIFIER,
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
    },
};

const result = envSchema.safeParse(envShape);

if (!result.data || result.error) {
    throw new FatalError(
        "Environment variable configuration invalid. Improper values for fields: ",
        result.error.issues.map((e) => e.path.join(".")).join("; "),
    );
}

export const env = result.data;
export type AppEnv = z.infer<typeof envSchema>;
