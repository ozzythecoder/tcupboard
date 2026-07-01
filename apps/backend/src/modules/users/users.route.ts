import { ZProfileUpdateSchema } from "@repo/shared";
import express from "express";
import { z } from "zod/v4";
import { accessControl } from "@/access-control/middleware.js";
import { api } from "@/config/axios.js";
import { db, s } from "@/db/index.js";
import { pipeMiddleware } from "@/middleware/pipe.js";
import { validateRequest } from "@/middleware/validator.js";
import { Auth0Gateway } from "@/modules/auth0/auth0.gateway.js";
import { Auth0Service } from "@/modules/auth0/auth0.service.js";
import { UserGateway } from "@/modules/users/users.gateway.js";
import { UserPolicy } from "@/modules/users/users.policy.js";
import { UserService } from "@/modules/users/users.service.js";
import { NotFoundError, UnauthorizedError } from "@/types/errors.js";
import authGuard from "../../middleware/auth.js";

const router = express.Router();

const userGateway = new UserGateway(db, s);
const userService = new UserService(userGateway);
const userPolicy = new UserPolicy(userGateway);

const authGateway = new Auth0Gateway(api);
const authService = new Auth0Service(authGateway);

router.get(
    "/me",
    ...pipeMiddleware(authGuard)
        .pipe(accessControl(() => userPolicy.read()))
        .build(),
    async (req, res, next) => {
        try {
            if (!req.user) throw new UnauthorizedError("Unauthorized");
            const me = await userService.getOneById(req.user.id);
            return res.json(me);
        } catch (e) {
            console.error(e);
            next(e);
        }
    },
);

const getUserProfileSchema = {
    params: z.object({
        userId: z.string(),
    }),
};
router.get(
    "/profile/:userId",
    ...pipeMiddleware(authGuard)
        .pipe(validateRequest(getUserProfileSchema))
        .pipe(accessControl(() => userPolicy.read()))
        .build(),
    async (req, res, next) => {
        try {
            const data = await userService.getOneById(Number(req.params.userId));

            if (!data) {
                throw new NotFoundError("No such user found.");
            }

            return res.json(data);
        } catch (error) {
            next(error);
        }
    },
);

const getUserByAuthIdSchema = {
    query: z.object({
        auth0Id: z.string(),
    }),
};
router.get(
    "/byAuthId",
    ...pipeMiddleware(authGuard)
        .pipe(validateRequest(getUserByAuthIdSchema))
        .pipe(accessControl(() => userPolicy.read()))
        .build(),
    async (req, res, next) => {
        try {
            const auth0Id = req.query.auth0Id;
            const user = await userService.getOneByAuth0Id(auth0Id);
            return res.json(user);
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
    body: ZProfileUpdateSchema.omit({
        avatarFile: true,
    }),
};
router.patch(
    "/:userId",
    ...pipeMiddleware(authGuard)
        .pipe(validateRequest(patchUserIdSchema))
        .pipe(accessControl(() => userPolicy.editProfile()))
        .build(),
    async (req, res, next) => {
        try {
            console.log(req.body);
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
    ...pipeMiddleware(authGuard)
        .pipe(validateRequest(resetPasswordSchema))
        .pipe(accessControl(() => userPolicy.changeEmail()))
        .build(),
    async (req, res) => {
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
);

const resetEmailSchema = {
    body: z.object({
        email: z.email(),
    }),
};

router.put(
    "/email",
    ...pipeMiddleware(authGuard)
        .pipe(validateRequest(resetEmailSchema))
        .pipe(accessControl(() => userPolicy.changeEmail()))
        .build(),
    async (req, res, next) => {
        if (!req.user) {
            throw new UnauthorizedError("Unauthorized");
        }

        try {
            const { email } = req.body;
            const auth0Id = req.user.sub;

            const tokenResponse = await authService.getToken();

            if (tokenResponse.status >= 400 || !tokenResponse.data.access_token) {
                throw new UnauthorizedError("Unauthorized by Auth0");
            }

            // TODO - set up cron job to synchronize from auth0 to database
            // Update email in Auth0
            await authService.setEmail(auth0Id, email, tokenResponse.data.access_token);
            // Update in application db
            const result = await userService.setEmail(email, req.user.id);

            res.status(200).json(result[0]);
        } catch (error) {
            console.error("Error updating email:", error);
            next(error);
        }
    },
);

export { router as userRouter };
