import express from "express";
import { env } from "@/config/env.js";
import { UnauthorizedError } from "@/types/errors.js";
import pool from "../config/db.js";
import authGuard from "../middleware/auth.js";

const router = express.Router();

router.post("/sync", async (req, res) => {
    if (req.headers["x-api-key"] !== env.privateAdminKey) {
        return res.status(404).send();
    }
    // TODO: do db stuff
    return res.status(200).send();
});

router.post("/register", authGuard, async (req, res) => {
    if (!req.user) throw new UnauthorizedError("No user submitted");
    const auth0Id = req.user.sub;
    const email = req.user.email;

    // Log the full user object to debug
    console.log("Auth0 user data:", JSON.stringify(req.user, null, 2));

    // Try to get username from custom namespace
    const namespace = "https://tcupboard.org/";
    let username = req.user[`${namespace}username`];

    // Fallbacks if custom claim isn't available
    if (!username) {
        username =
            req.user.username ||
            req.user.nickname ||
            req.user.name ||
            req.user.preferred_username ||
            (req.user.email ? req.user.email.split("@")[0] : null);
    }

    // Last resort fallback with random string instead of timestamp
    if (!username) {
        const randomId = Math.random().toString(36).substring(2, 10);
        username = `user_${randomId}`;
    }

    try {
        const existingUser = await pool.query("SELECT * FROM users WHERE auth0_id = $1", [auth0Id]);

        if (existingUser.rows.length === 0) {
            // Add username to the insertion
            const newUser = await pool.query(
                "INSERT INTO users (auth0_id, email, username) VALUES ($1, $2, $3) RETURNING *",
                [auth0Id, email, username],
            );

            res.json(newUser.rows[0]);
        } else {
            res.json(existingUser.rows[0]);
        }
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
});

export default router;
