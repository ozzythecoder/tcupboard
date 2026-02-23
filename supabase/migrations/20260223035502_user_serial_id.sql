create extension if not exists "pg_net" with schema "extensions";

create sequence "public"."users_id_seq";

alter table "public"."users" add column "auth0_id" text not null;

alter table "public"."users" add column "created_at" timestamp with time zone default now();

alter table "public"."users" alter column "id" set data type integer using "id"::integer;

alter table "public"."users" alter column "id" set default nextval('public.users_id_seq'::regclass);

alter sequence "public"."users_id_seq" owned by "public"."users"."id";


