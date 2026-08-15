import type { NextFunction, Request, Response } from "express";
import type { Authed } from "./auth.js";
import authGuard from "./auth.js";
import { pipeMiddleware } from "./pipe.js";

const whatever = (_req: Request, _res: Response, next: NextFunction) => {
    next();
};

const needsAuth = (req: Request & Authed, _res: Response, next: NextFunction) => {
    req.user.id;
    next();
};

// @ts-expect-error - {@link Authed} has not been provided
pipeMiddleware(needsAuth);
// no error here - Auth has been provided
pipeMiddleware(authGuard).pipe(needsAuth);
// @ts-expect-error - {@link Authed} has not been provided
pipeMiddleware(whatever).pipe(needsAuth);
