import { ZUpdateUserSchema } from "@repo/shared";
import axios from "axios";
import express from "express";
import { z } from "zod/v4";
import { accessControl } from "@/access-control/middleware.js";
import { userPolicy } from "@/access-control/policies/user.js";
import { db, s } from "@/db/index.js";
import { pipeMiddleware } from "@/middleware/pipe.js";
import { validateRequest } from "@/middleware/validator.js";
import { UserGateway } from "@/modules/users/users.gateway.js";
import { UserService } from "@/modules/users/users.service.js";
import { UnauthorizedError } from "@/types/errors.js";
import pool from "../../config/db.js";
import authGuard from "../../middleware/auth.js";
import { pipe } from "zod/mini";

const router = express.Router();

const userGateway = new UserGateway(db, s);
const userService = new UserService(userGateway);

router.post("/profile", async (req, res) => {
    try {
        console.log("==== User Profile Creation ====");
        console.log("Incoming Auth0 data:", JSON.stringify(req.body, null, 2));

        const { sub: auth0_id, email } = req.body; // Auth0 user info

        // Auth0 namespace / custom claim - see ProfileSync.js in frontend for implementation
        const namespace = "https://tcupboard.org/";
        const username = req.body[`${namespace}username`] ?? email.split("@")[0];

        // Check if user exists
        const user = await userService.getOneByAuth0Id(auth0_id);

        if (!user) {
            // Create new user with extracted username
            const newUser = await userService.create({ auth0_id, email, username });
            return res.json(newUser);
        } else {
            return res.json(user);
        }
    } catch (err) {
        console.error("Error in profile creation:", err);
        res.status(500).send("Server error");
    }
});

router.get("/profile", authGuard, async (req, res) => {
    try {
        const auth0Id = req.user?.sub;

        console.log("Current user profile request");
        console.log("- User ID:", auth0Id);

        const result = await pool.query("SELECT * FROM users WHERE auth0_id = $1", [auth0Id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            ...result.rows[0],
            isOwnProfile: true,
        });
    } catch (error) {
        console.error("Error fetching current user profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/profile/:id", authGuard, async (req, res) => {
    try {
        const data = await userService.getOneById(Number(req.params.id));

        if (!data) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json(data);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get(
    "/byAuthId",
    ...pipeMiddleware(authGuard)
        .pipe(
            validateRequest({
                query: z.object({
                    auth0Id: z.string(),
                }),
            }),
        )
        .build(),
    async (req, res, next) => {
        const authId = req.query.auth0Id;
        try {
            const user = await userService.getOneByAuth0Id(authId);

            res.status(200).json(user);
        } catch (e) {
            console.error(e);
            next(e);
        }
    },
);

const patchUserIdSchema = {
    params: z.object({
        userId: z.string(),
    }),
    body: ZUpdateUserSchema,
};

router.patch(
    "/:userId",
    ...pipeMiddleware(authGuard)
        .pipe(accessControl(() => userPolicy.edit))
        .pipe(validateRequest(patchUserIdSchema))
        .build(),
    async (req, res, next) => {
        try {
            if (!req.user || req.user.id !== Number(req.params.userId)) {
                throw new UnauthorizedError("Access denied");
            }
            const result = await userService.edit(req.body, req.params.userId);
            return res.status(200).json(result);
        } catch (e) {
            console.error(e);
            next(e);
        }
    },
);

const resetPasswordSchema = {
    body: z.object({
        email: z.email(),
    }),
};

router.post(
    "/reset-password",
    ...pipeMiddleware(authGuard).pipe(validateRequest(resetPasswordSchema)).build(),
    async (req, res) => {
        try {
            const { email } = req.body;

            // Use Auth0's built-in password reset
            await axios.post(`https://${process.env.AUTH0_DOMAIN}/dbconnections/change_password`, {
                email: email,
                connection: "Username-Password-Authentication",
                client_id: process.env.AUTH0_CLIENT_ID,
            });

            res.json({
                message: "If this email exists in our system, a password reset link has been sent",
            });
        } catch (error) {
            console.error("Password reset error:", error.response?.data || error.message);
            // Still return success message even if there's an error to prevent email enumeration
            res.json({
                message: "If this email exists in our system, a password reset link has been sent",
            });
        }
    },
);

const resetEmailSchema = {
    body: z.object({
        email: z.email(),
    }),
};

router.put(
    "/email",
    ...pipeMiddleware(authGuard)
        .pipe(accessControl(() => userPolicy.edit))
        .pipe(validateRequest(resetEmailSchema))
        .build(),
    async (req, res, next) => {
        if (!req.user) {
            throw new UnauthorizedError("Unauthorized")
        }
        
        try {
            const { email } = req.body;
            const auth0Id = req.user.sub;

            const tokenResponse = await axios.post(
                `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
                {
                    client_id: process.env.AUTH0_CLIENT_ID,
                    client_secret: process.env.AUTH0_CLIENT_SECRET,
                    audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
                    grant_type: "client_credentials",
                },
            );

            if (tokenResponse.status >= 400 || !tokenResponse.data.access_token) {
                throw new UnauthorizedError("Unauthorized by Auth0")
            }

            // Update email in Auth0
            await axios.patch(
                `${process.env.AUTH0_API_IDENTIFIER}/users/${auth0Id}`,
                {
                    email: email,
                    connection: "Username-Password-Authentication",
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.data.access_token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            const result = await userService.setEmail(email, req.user.id)

            res.status(200).json(result[0]);
        } catch (error) {
            console.error("Error updating email:", error);
            next(error)
        }
    },
);

export default router;
