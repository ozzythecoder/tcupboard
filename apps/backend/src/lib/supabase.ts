import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";
import type { Database } from "../types/models.js";

const supabaseUrl = env.supabase.url;
const supabaseServiceKey = env.supabase.serviceKey;

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
export const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

export default supabase;
