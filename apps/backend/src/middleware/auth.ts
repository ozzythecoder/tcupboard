import { auth } from "express-oauth2-jwt-bearer";
import { env } from "@/config/env.js";
import { db, s } from "@/db/index.js";
import { UserGateway } from "@/modules/users/users.gateway.js";
import { UserService } from "@/modules/users/users.service.js";

// Create the JWT validator
const checkJwt = auth({
    audience: env.auth0.apiIdentifier,
    issuerBaseURL: env.auth0.domain,
    tokenSigningAlg: "RS256",
});

const userGateway = new UserGateway(db, s);
const userService = new UserService(userGateway);

/**
 *  Simple middleware to ensure that request is authenticated.
 */
const authGuard = (req, res, next) => {
    checkJwt(req, res, async (err) => {
        if (err) {
            console.warn("Authentication failed.", err);
            console.log(req.headers);
            return res.status(401).json({ error: "Unauthorized", details: err.message });
        }

        try {
            const dbUser = await userService.getOneByAuth0Id(req.auth.payload.sub);
            if (!dbUser) {
                return res
                    .status(401)
                    .json({ error: "Unauthorized", details: "User does not exist" });
            }
            req.user = {
                ...req.auth.payload,
                id: dbUser.id,
                sub: req.auth.payload.sub,
                roles: (req.auth.payload["https://tcupboard.org/roles"] as string[]) || [],
            };

            next();
        } catch (error) {
            console.error("Error processing token:", error);
            return res.status(500).json({ error: "Error processing authentication" });
        }
    });
};

// Role checking middleware stays the same
export const checkRole = (requiredRoles) => {
    return (req, res, next) => {
        console.log("Checking roles:", {
            requiredRoles,
            userRoles: req.user?.roles,
            user: req.user?.sub,
        });

        // If no token/auth, deny access
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        // Get user roles
        const userRoles = req.user.roles || [];

        // Check if user has any of the required roles
        const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

        console.log("Has required role?", hasRequiredRole);

        if (hasRequiredRole) {
            return next();
        }

        console.log("Access denied - insufficient permissions");
        return res.status(403).json({ message: "Insufficient permissions" });
    };
};

export default authGuard;
