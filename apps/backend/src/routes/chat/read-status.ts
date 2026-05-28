import express, { type Request } from "express";
import supabase from "../../lib/supabase.js";
import authMiddleware from "../../middleware/auth.js";

const router = express.Router();


// Mark thread as read
router.post("/:threadId", authMiddleware, async (req: Request<{ threadId: string }>, res) => {
    try {
        const auth0Id = req.auth?.payload?.sub;
        if (!auth0Id) return res.status(401);
        const { threadId } = req.params;

        const { data, error } = await supabase
            .from("thread_read_status")
            .upsert(
                {
                    auth0_id: auth0Id,
                    thread_id: parseInt(threadId),
                    last_read_at: new Date().toISOString(),
                },
                { onConflict: "auth0_id,thread_id" },
            )
            .select();

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error("Error marking thread as read:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get read status for current user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const auth0Id = req.auth?.payload?.sub;

        if (!auth0Id) {
            return res.status(401);
        }

        const { data, error } = await supabase
            .from("thread_read_status")
            .select("thread_id, last_read_at")
            .eq("auth0_id", auth0Id);

        if (error) throw error;

        const readStatus = Object.fromEntries(
            data.map(v => [v.thread_id, v.last_read_at])
        )
        res.status(200).json(readStatus);
    } catch (error) {
        console.error("Error fetching read status:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
