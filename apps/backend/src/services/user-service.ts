import { supabase } from "../lib/supabase.js";
import type { TablesInsert, TablesUpdate } from "../types/models.js";
import { stripUndefined } from "../utils/stripUndefined.js";

type UserInsert = TablesInsert<"users">;
type UserUpdate = TablesUpdate<"users">;

export const userService = {
    getByAuthId: async (auth_id: string) => {
        const res = await supabase.from("users").select("*").eq("auth0_id", auth_id);
        if (res.error) throw res.error;
        return res.data[0];
    },
    getAll: async () => {
        const res = await supabase.from("users").select("*");
        if (res.error) throw res.error;
        return res.data;
    },

    create: async (user: UserInsert) => {
        const res = await supabase
            .from("users")
            .insert([
                {
                    auth0_id: user.auth0_id,
                    email: user.email,
                    username: user.username,
                },
            ])
            .select();
        if (res.error) throw res.error;
        return res.data;
    },

    update: async ({ username, avatar_url, bio, role, tagline }: UserUpdate, auth0_id: string) => {
        const update = stripUndefined({
            username,
            avatar_url,
            bio,
            role,
            tagline,
        });

        const res = await supabase.from("users").update(update).eq("auth0_id", auth0_id).select();

        if (res.error) throw res.error;
        return res.data;
    },
};
