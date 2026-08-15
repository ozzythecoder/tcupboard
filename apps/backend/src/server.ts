import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { ErrorHandlerMiddleware } from "./middleware/error-handler.js";
import { LoggerMiddleware } from "./middleware/logger.js";
import { campaignRouter } from "./modules/campaigns/index.js";
import { cloudinarySignatureRouter } from "./modules/cloudinary/signature.route.js";
import { directMessagesRouter } from "./modules/direct-messages/index.js";
import { globalsRouter } from "./modules/globals/index.js";
import { tcupUpdatesRouter } from "./modules/tcup-updates/index.js";
import { threadsRouter } from "./modules/threads/index.js";
import { userRouter } from "./modules/users/index.js";

const app = express();
const PORT = process.env.PORT || 3001;
app.use(
    LoggerMiddleware({ withTimestamp: true }),
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
apiRouter.use("/updates", tcupUpdatesRouter);
apiRouter.use("/campaigns", campaignRouter);
apiRouter.use("/globals", globalsRouter);
apiRouter.use("/direct-messages", directMessagesRouter);

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
// apiRouter.use("/scrapers", scrapersRouter);
// apiRouter.use("/sseroutes", sseRouter);
// apiRouter.use("/adminshows", adminShowsRouter);

app.use("/api", apiRouter);
app.use(ErrorHandlerMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
