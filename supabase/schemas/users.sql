CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" serial not null,
    "auth0_id" text not null,
    "email" "text",
    "username" "text",
    "avatar_url" "text",
    "last_activity" timestamp with time zone,
    "register_date" timestamp with time zone,
    "user_state" "text",
    "message_count" integer,
    "receive_admin_email" boolean,
    "is_banned" boolean,
    "is_staff" boolean,
    "user_group_id" integer,
    "is_unregistered" boolean,
    "is_registered" boolean,
    "is_admin" boolean,
    "is_moderator" boolean,
    "is_tcup_member" boolean,
    "is_core_team_leader" boolean,
    "created_at" timestamp with time zone default now()
);


ALTER TABLE "public"."users" OWNER TO "postgres";
ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";
