// middleware/auth.js

import dotenv from "dotenv";
import { auth } from "express-oauth2-jwt-bearer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create the JWT validator
const checkJwt = auth({
    audience: process.env.AUTH0_API_IDENTIFIER,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    tokenSigningAlg: "RS256",
});

// Our custom middleware that uses checkJwt but preserves req.user
const authMiddleware = (req, res, next) => {
    // First run the official validator
    checkJwt(req, res, (err) => {
        if (err) {
            console.warn("Authentication failed.", err);
            return res.status(401).json({ error: "Authentication failed", details: err.message });
        }

        try {
            // After validation succeeds, copy the validated data to req.user
            // This preserves compatibility with your existing code
            req.user = {
                ...req.auth.payload,
                sub: req.auth.payload.sub,
                roles: req.auth.payload["https://tcupboard.org/roles"] || [],
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

export default authMiddleware;
