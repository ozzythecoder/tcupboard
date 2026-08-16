import { numberOrNumericStringSchema, ZProfileUpdateSchema } from "@repo/shared";
import express from "express";
import { z } from "zod/v4";
import { api } from "@/config/axios.js";
import { db, s } from "@/db/index.js";
import { route } from "@/middleware/route.js";
import { Auth0Gateway } from "@/modules/auth0/auth0.gateway.js";
import { Auth0Service } from "@/modules/auth0/auth0.service.js";
import { UserGateway } from "@/modules/users/users.gateway.js";
import { UserPolicy } from "@/modules/users/users.policy.js";
import { UserService } from "@/modules/users/users.service.js";
import { UnauthorizedError } from "@/types/errors.js";

const router = express.Router();

const userGateway = new UserGateway(db, s);
const userService = new UserService(userGateway);
const userPolicy = new UserPolicy(userGateway);

const authGateway = new Auth0Gateway(api);
const authService = new Auth0Service(authGateway);

router.get(
    "/me",
    ...route({
        policy: () => userPolicy.read(),
        handler: async (req, res) => {
            res.json(await userService.getOneById(req.user.id));
        },
    }),
);

const getUserProfileSchema = {
    params: z.object({
        userId: numberOrNumericStringSchema,
    }),
};
router.get(
    "/profile/:userId",
    ...route({
        validate: getUserProfileSchema,
        policy: () => userPolicy.read(),
        handler: async (req, res) => {
            res.json(await userService.getOneById(req.params.userId as DbUserId));
        },
    }),
);

const getUserByAuthIdSchema = {
    query: z.object({
        auth0Id: z.string(),
    }),
};
router.get(
    "/byAuthId",
    ...route({
        validate: getUserByAuthIdSchema,
        policy: () => userPolicy.read(),
        handler: async (req, res) => {
            res.json(await userService.getOneByAuth0Id(req.query.auth0Id as Auth0UserId));
        },
    }),
);

const patchUserIdSchema = {
    params: z.object({
        userId: numberOrNumericStringSchema,
    }),
    body: ZProfileUpdateSchema.omit({
        avatarFile: true,
    }),
};
router.patch(
    "/",
    ...route({
        validate: patchUserIdSchema,
        policy: () => userPolicy.editProfile(),
        handler: async (req, res) => {
            res.json(await userService.edit(req.body, req.user.id));
        },
    }),
);

const resetPasswordSchema = {
    body: z.object({
        email: z.email(),
    }),
};
router.post(
    "/reset-password",
    ...route({
        validate: resetPasswordSchema,
        policy: () => userPolicy.changeEmail(),
        handler: async (req, res) => {
            await authService
                .resetPassword(req.body.email)
                .catch((error) => {
                    console.error("Password reset error:", error.response?.data || error.message);
                })
                .finally(() => {
                    // Return opaque message regardless to prevent email enumeration
                    res.json({
                        message:
                            "If this email exists in our system, a password reset link has been sent",
                    });
                });
        },
    }),
);

const resetEmailSchema = {
    body: z.object({
        email: z.email(),
    }),
};
router.put(
    "/email",
    ...route({
        validate: resetEmailSchema,
        policy: () => userPolicy.changeEmail(),
        handler: async (req, res) => {
            const tokenResponse = await authService.getToken();
            if (tokenResponse.status >= 400 || !tokenResponse.data.access_token) {
                throw new UnauthorizedError("Unauthorized by Auth0");
            }

            // TODO - set up cron job to synchronize from auth0 to database
            // Update email in Auth0
            await authService.setEmail(
                req.user.sub,
                req.body.email,
                tokenResponse.data.access_token,
            );
            // Update in application db
            res.status(200).json(await userService.setEmail(req.body.email, req.user.id));
        },
    }),
);

export { router as userRouter };
