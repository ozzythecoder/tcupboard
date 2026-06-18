import type { Router } from "express";
import route from "./threads.route.js";

export * from './threads.gateway.js'
export * from './threads.service.js'

export function registerThreadsRoute(e: Router) {
    e.use("/threads", route);
}
