import compression from "compression";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { ErrorHandlerMiddleware } from "./middleware/error-handler.js";
import { LoggerMiddleware } from "./middleware/logger.js";
import { cloudinarySignatureRouter } from "./modules/cloudinary/signature.route.js";
import { threadsRouter } from "./modules/threads/index.js";
import { userRouter } from "./modules/users/index.js";

// import authRoutes from "./routes/auth.js";
// import tagsRouter from "./routes/tags.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
    compression(),
    LoggerMiddleware({ withTimestamp: !env.dev }),
    cors({
        origin: env.allowedOrigins,
        credentials: true,
    }),
    express.json({ limit: "10mb" }),
    express.urlencoded({ extended: true, limit: "10mb" }),
);

const apiRouter = express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/threads", threadsRouter);
apiRouter.use("/cloudinary-signature", cloudinarySignatureRouter);
// apiRouter.use("/auth", authRoutes);
// apiRouter.use("/tags", tagsRouter);
// apiRouter.use("/venues", venuesRoutes);
// apiRouter.use("/bands", bandsRouter);
// apiRouter.use("/shows", showsRouter);
// apiRouter.use("/people", peopleRouter);
// apiRouter.use("/favorites", favoritesRouter);
// apiRouter.use("/sessionmusicians", sessionMusiciansRouter);
// apiRouter.use("/pledges", pledgesRouter);
// apiRouter.use("/flyering", flyeringRouter);
// apiRouter.use("/images", imagesRouter);
// apiRouter.use("/notifications", notificationsRouter);
// apiRouter.use("/updates", updatesRouter);
// apiRouter.use("/contact", contactRouter);
// apiRouter.use("/upload", uploadRouter);
// apiRouter.use("/read-status", readStatusRouter);
// apiRouter.use("/direct-messages", directMessagesRouter);
// apiRouter.use("/scrapers", scrapersRouter);
// apiRouter.use("/sseroutes", sseRouter);
// apiRouter.use("/adminshows", adminShowsRouter);

app.use("/api", apiRouter);

app.use(ErrorHandlerMiddleware);

// Print out routes (for debugging)
app._router.stack.forEach((r) => {
    if (r.route?.path) {
        console.log(`Route: ${r.route.path}`);
    }
});

// 11) Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
