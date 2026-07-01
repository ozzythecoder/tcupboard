import type { CloudinarySignature } from "@repo/shared";
import { v2 as cloudinary } from "cloudinary";
import express from "express";
import { env } from "@/config/env.js";
import authGuard from "@/middleware/auth.js";

const router = express.Router();

router.get("/", authGuard, async (_req, res) => {
    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp,
            upload_preset: "v2:avatars",
        },
        env.cloudinary.apiSecret,
    );

    const sigBody: CloudinarySignature = {
        timestamp,
        signature,
        apiKey: env.cloudinary.apiKey,
        cloudName: env.cloudinary.cloud_name,
    };

    res.json(sigBody);
});

export { router as cloudinarySignatureRouter };
