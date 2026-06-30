import type { ErrorRequestHandler } from "express";
import { isApplicationError } from "@/types/errors.js";

export const ErrorHandlerMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error("[MIDDLEWARE] Caught error:", err);
    if (isApplicationError(err)) {
        return err.convertResponse(res);
    }
    return res.status(500).json({ message: "Internal Server Error" });
};
