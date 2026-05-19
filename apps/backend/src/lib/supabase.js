// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

// Use environment variables already loaded by loadEnv.js (or server.js)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    const e = [
        "Missing Supabase configuration:",
        {
            supabaseUrl: supabaseUrl ? "found" : "missing",
            supabaseServiceKey: supabaseServiceKey ? "found" : "missing",
        },
    ];
    throw new Error(e.join("\n"));
}

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

// Optional: Test the Supabase connection
// (This IIFE uses top-level await; if your Node version supports it, this is fine.)
(async () => {
    try {
        const { data, error } = await supabase.from("forum_messages").select("count");
        if (error) {
            console.error("Supabase connection test error:", error);
        } else {
            console.log("Supabase connection test succeeded:", data);
        }
    } catch (err) {
        console.error("Supabase connection test failed:", err);
    }
})();

export default supabase;
