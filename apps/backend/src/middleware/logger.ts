import type { RequestHandler } from "express";
import { formatDate } from "@/utils/formatDate.js";

type LoggerConfig = {
    withTimestamp: boolean;
};

export const LoggerMiddleware =
    (config?: LoggerConfig): RequestHandler =>
    async (req, _res, next) => {
        const timestamp = config?.withTimestamp ? `[${formatDate(new Date())}]: ` : "";
        console.log(`${timestamp}${req.method} ${req.url}`);
        if (req.body) {
            console.log(req.body);
        }
        next();
    };
