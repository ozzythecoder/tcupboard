-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "pgrst";
--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('user', 'admin', 'moderator', 'superadmin');--> statement-breakpoint
CREATE TABLE "block_richtext" (
	"id" serial PRIMARY KEY,
	"theme" integer DEFAULT 1,
	"content" json
);
--> statement-breakpoint
CREATE TABLE "calls_to_action" (
	"id" serial PRIMARY KEY,
	"name" varchar(255),
	"callout" varchar(255),
	"action" varchar(255),
	"url" varchar(255),
	"theme" json
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" serial PRIMARY KEY,
	"sort" integer,
	"date_created" timestamp with time zone,
	"date_updated" timestamp with time zone,
	"title" varchar(255) DEFAULT NULL NOT NULL,
	"image" uuid,
	"slug" varchar(255) DEFAULT NULL NOT NULL,
	"call_to_action" integer,
	"subtitle" varchar(255),
	"show_footer" boolean DEFAULT true NOT NULL,
	"theme" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "campaigns_blocks" (
	"id" serial PRIMARY KEY,
	"campaigns_id" integer,
	"item" varchar(255),
	"collection" varchar(255),
	"sort" integer
);
--> statement-breakpoint
CREATE TABLE "campaigns_content_blocks" (
	"id" serial PRIMARY KEY,
	"campaigns_id" integer,
	"item" varchar(255),
	"collection" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "conversation_participants" (
	"conversationId" integer,
	"userId" integer,
	CONSTRAINT "conversation_participants_conversationId_userId_pk" PRIMARY KEY("userId","conversationId")
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY
);
--> statement-breakpoint
CREATE TABLE "directus_access" (
	"id" uuid PRIMARY KEY,
	"role" uuid,
	"user" uuid,
	"policy" uuid NOT NULL,
	"sort" integer
);
--> statement-breakpoint
CREATE TABLE "directus_activity" (
	"id" serial PRIMARY KEY,
	"action" varchar(45) NOT NULL,
	"user" uuid,
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"ip" varchar(50),
	"user_agent" text,
	"collection" varchar(64) NOT NULL,
	"item" varchar(255) NOT NULL,
	"origin" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "directus_collections" (
	"collection" varchar(64) PRIMARY KEY,
	"icon" varchar(64),
	"note" text,
	"display_template" varchar(255),
	"hidden" boolean DEFAULT false NOT NULL,
	"singleton" boolean DEFAULT false NOT NULL,
	"translations" json,
	"archive_field" varchar(64),
	"archive_app_filter" boolean DEFAULT true NOT NULL,
	"archive_value" varchar(255),
	"unarchive_value" varchar(255),
	"sort_field" varchar(64),
	"accountability" varchar(255) DEFAULT 'all',
	"color" varchar(255),
	"item_duplication_fields" json,
	"sort" integer,
	"group" varchar(64),
	"collapse" varchar(255) DEFAULT 'open' NOT NULL,
	"preview_url" varchar(255),
	"versioning" boolean DEFAULT false NOT NULL,
	"status" varchar(255) DEFAULT 'active' NOT NULL,
	"autosave_revision_interval" real
);
--> statement-breakpoint
CREATE TABLE "directus_comments" (
	"id" uuid PRIMARY KEY,
	"collection" varchar(64) NOT NULL,
	"item" varchar(255) NOT NULL,
	"comment" text NOT NULL,
	"date_created" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"date_updated" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"user_created" uuid,
	"user_updated" uuid
);
--> statement-breakpoint
CREATE TABLE "directus_dashboards" (
	"id" uuid PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"icon" varchar(64) DEFAULT 'dashboard' NOT NULL,
	"note" text,
	"date_created" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"user_created" uuid,
	"color" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "directus_deployment_projects" (
	"id" uuid PRIMARY KEY,
	"deployment" uuid NOT NULL,
	"external_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"date_created" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"user_created" uuid,
	"url" varchar(255),
	"framework" varchar(255),
	"deployable" boolean DEFAULT true NOT NULL,
	CONSTRAINT "directus_deployment_projects_deployment_external_id_unique" UNIQUE("deployment","external_id")
);
--> statement-breakpoint
CREATE TABLE "directus_deployment_runs" (
	"id" uuid PRIMARY KEY,
	"project" uuid NOT NULL,
	"external_id" varchar(255) NOT NULL,
	"target" varchar(255) NOT NULL,
	"date_created" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"user_created" uuid,
	"status" varchar(255),
	"url" varchar(255),
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "directus_deployments" (
	"id" uuid PRIMARY KEY,
	"provider" varchar(255) NOT NULL CONSTRAINT "directus_deployments_provider_unique" UNIQUE,
	"credentials" text,
	"options" text,
	"date_created" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"user_created" uuid,
	"webhook_ids" json,
	"webhook_secret" varchar(255),
	"last_synced_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "directus_extensions" (
	"enabled" boolean DEFAULT true NOT NULL,
	"id" uuid PRIMARY KEY,
	"folder" varchar(255) NOT NULL,
	"source" varchar(255) NOT NULL,
	"bundle" uuid
);
--> statement-breakpoint
CREATE TABLE "directus_fields" (
	"id" serial PRIMARY KEY,
	"collection" varchar(64) NOT NULL,
	"field" varchar(64) NOT NULL,
	"special" varchar(64),
	"interface" varchar(64),
	"options" json,
	"display" varchar(64),
	"display_options" json,
	"readonly" boolean DEFAULT false NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL,
	"sort" integer,
	"width" varchar(30) DEFAULT 'full',
	"translations" json,
	"note" text,
	"conditions" json,
	"required" boolean DEFAULT false,
	"group" varchar(64),
	"validation" json,
	"validation_message" text,
	"searchable" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directus_files" (
	"id" uuid PRIMARY KEY,
	"storage" varchar(255) NOT NULL,
	"filename_disk" varchar(255),
	"filename_download" varchar(255) NOT NULL,
	"title" varchar(255),
	"type" varchar(255),
	"folder" uuid,
	"uploaded_by" uuid,
	"created_on" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"modified_by" uuid,
	"modified_on" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"charset" varchar(50),
	"filesize" bigint,
	"width" integer,
	"height" integer,
	"duration" integer,
	"embed" varchar(200),
	"description" text,
	"location" text,
	"tags" text,
	"metadata" json,
	"focal_point_x" integer,
	"focal_point_y" integer,
	"tus_id" varchar(64),
	"tus_data" json,
	"uploaded_on" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "directus_flows" (
	"id" uuid PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"icon" varchar(64),
	"color" varchar(255),
	"description" text,
	"status" varchar(255) DEFAULT 'active' NOT NULL,
	"trigger" varchar(255),
	"accountability" varchar(255) DEFAULT 'all',
	"options" json,
	"operation" uuid CONSTRAINT "directus_flows_operation_unique" UNIQUE,
	"date_created" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"user_created" uuid
);
--> statement-breakpoint
CREATE TABLE "directus_folders" (
	"id" uuid PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"parent" uuid
);
--> statement-breakpoint
CREATE TABLE "directus_migrations" (
	"version" varchar(255) PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "directus_notifications" (
	"id" serial PRIMARY KEY,
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"status" varchar(255) DEFAULT 'inbox',
	"recipient" uuid NOT NULL,
	"sender" uuid,
	"subject" varchar(255) NOT NULL,
	"message" text,
	"collection" varchar(64),
	"item" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "directus_oauth_clients" (
	"client_id" varchar(255) PRIMARY KEY,
	"client_name" varchar(200) NOT NULL,
	"redirect_uris" json NOT NULL,
	"grant_types" json NOT NULL,
	"token_endpoint_auth_method" varchar(255) DEFAULT 'none' NOT NULL,
	"client_secret_hash" varchar(64),
	"registration_type" varchar(10) DEFAULT 'dcr' NOT NULL,
	"client_uri" text,
	"logo_uri" text,
	"tos_uri" text,
	"policy_uri" text,
	"metadata_fetched_at" timestamp with time zone,
	"metadata_expires_at" timestamp with time zone,
	"metadata_etag" varchar(255),
	"date_created" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directus_oauth_codes" (
	"id" uuid PRIMARY KEY,
	"code_hash" varchar(64) NOT NULL CONSTRAINT "directus_oauth_codes_code_hash_unique" UNIQUE,
	"client" varchar(255) NOT NULL,
	"user" uuid NOT NULL,
	"redirect_uri" varchar(255) NOT NULL,
	"resource" varchar(255) NOT NULL,
	"code_challenge" varchar(128) NOT NULL,
	"code_challenge_method" varchar(10) NOT NULL,
	"scope" varchar(255),
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "directus_oauth_consents" (
	"id" uuid PRIMARY KEY,
	"user" uuid NOT NULL,
	"client" varchar(255) NOT NULL,
	"redirect_uri" varchar(255) NOT NULL,
	"scope" varchar(255),
	"date_created" timestamp with time zone NOT NULL,
	"date_updated" timestamp with time zone NOT NULL,
	CONSTRAINT "directus_oauth_consents_user_client_redirect_uri_unique" UNIQUE("user","client","redirect_uri")
);
--> statement-breakpoint
CREATE TABLE "directus_oauth_tokens" (
	"id" uuid PRIMARY KEY,
	"client" varchar(255) NOT NULL,
	"user" uuid NOT NULL,
	"session" varchar(64) NOT NULL,
	"previous_session" varchar(64),
	"resource" varchar(255) NOT NULL,
	"code_hash" varchar(64) NOT NULL,
	"scope" varchar(255),
	"expires_at" timestamp with time zone NOT NULL,
	"date_created" timestamp with time zone NOT NULL,
	CONSTRAINT "directus_oauth_tokens_client_user_unique" UNIQUE("client","user")
);
--> statement-breakpoint
CREATE TABLE "directus_operations" (
	"id" uuid PRIMARY KEY,
	"name" varchar(255),
	"key" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"position_x" integer NOT NULL,
	"position_y" integer NOT NULL,
	"options" json,
	"resolve" uuid CONSTRAINT "directus_operations_resolve_unique" UNIQUE,
	"reject" uuid CONSTRAINT "directus_operations_reject_unique" UNIQUE,
	"flow" uuid NOT NULL,
	"date_created" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"user_created" uuid
);
--> statement-breakpoint
CREATE TABLE "directus_panels" (
	"id" uuid PRIMARY KEY,
	"dashboard" uuid NOT NULL,
	"name" varchar(255),
	"icon" varchar(64) DEFAULT NULL,
	"color" varchar(10),
	"show_header" boolean DEFAULT false NOT NULL,
	"note" text,
	"type" varchar(255) NOT NULL,
	"position_x" integer NOT NULL,
	"position_y" integer NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"options" json,
	"date_created" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"user_created" uuid
);
--> statement-breakpoint
CREATE TABLE "directus_permissions" (
	"id" serial PRIMARY KEY,
	"collection" varchar(64) NOT NULL,
	"action" varchar(10) NOT NULL,
	"permissions" json,
	"validation" json,
	"presets" json,
	"fields" text,
	"policy" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directus_policies" (
	"id" uuid PRIMARY KEY,
	"name" varchar(100) NOT NULL,
	"icon" varchar(64) DEFAULT 'badge' NOT NULL,
	"description" text,
	"ip_access" text,
	"enforce_tfa" boolean DEFAULT false NOT NULL,
	"admin_access" boolean DEFAULT false NOT NULL,
	"app_access" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directus_presets" (
	"id" serial PRIMARY KEY,
	"bookmark" varchar(255),
	"user" uuid,
	"role" uuid,
	"collection" varchar(64),
	"search" varchar(100),
	"layout" varchar(100) DEFAULT 'tabular',
	"layout_query" json,
	"layout_options" json,
	"refresh_interval" integer,
	"filter" json,
	"icon" varchar(64) DEFAULT 'bookmark',
	"color" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "directus_relations" (
	"id" serial PRIMARY KEY,
	"many_collection" varchar(64) NOT NULL,
	"many_field" varchar(64) NOT NULL,
	"one_collection" varchar(64),
	"one_field" varchar(64),
	"one_collection_field" varchar(64),
	"one_allowed_collections" text,
	"junction_field" varchar(64),
	"sort_field" varchar(64),
	"one_deselect_action" varchar(255) DEFAULT 'nullify' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directus_revisions" (
	"id" serial PRIMARY KEY,
	"activity" integer NOT NULL,
	"collection" varchar(64) NOT NULL,
	"item" varchar(255) NOT NULL,
	"data" json,
	"delta" json,
	"parent" integer,
	"version" uuid
);
--> statement-breakpoint
CREATE TABLE "directus_roles" (
	"id" uuid PRIMARY KEY,
	"name" varchar(100) NOT NULL,
	"icon" varchar(64) DEFAULT 'supervised_user_circle' NOT NULL,
	"description" text,
	"parent" uuid
);
--> statement-breakpoint
CREATE TABLE "directus_sessions" (
	"token" varchar(64) PRIMARY KEY,
	"user" uuid,
	"expires" timestamp with time zone NOT NULL,
	"ip" varchar(255),
	"user_agent" text,
	"share" uuid,
	"origin" varchar(255),
	"next_token" varchar(64),
	"oauth_client" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "directus_settings" (
	"id" serial PRIMARY KEY,
	"project_name" varchar(100) DEFAULT 'Directus' NOT NULL,
	"project_url" varchar(255),
	"project_color" varchar(255) DEFAULT '#6644FF' NOT NULL,
	"project_logo" uuid,
	"public_foreground" uuid,
	"public_background" uuid,
	"public_note" text,
	"auth_login_attempts" integer DEFAULT 25,
	"auth_password_policy" varchar(100),
	"storage_asset_transform" varchar(7) DEFAULT 'all',
	"storage_asset_presets" json,
	"custom_css" text,
	"storage_default_folder" uuid,
	"basemaps" json,
	"mapbox_key" varchar(255),
	"module_bar" json,
	"project_descriptor" varchar(100),
	"default_language" varchar(255) DEFAULT 'en-US' NOT NULL,
	"custom_aspect_ratios" json,
	"public_favicon" uuid,
	"default_appearance" varchar(255) DEFAULT 'auto' NOT NULL,
	"default_theme_light" varchar(255),
	"theme_light_overrides" json,
	"default_theme_dark" varchar(255),
	"theme_dark_overrides" json,
	"report_error_url" varchar(255),
	"report_bug_url" varchar(255),
	"report_feature_url" varchar(255),
	"public_registration" boolean DEFAULT false NOT NULL,
	"public_registration_verify_email" boolean DEFAULT true NOT NULL,
	"public_registration_role" uuid,
	"public_registration_email_filter" json,
	"visual_editor_urls" json,
	"project_id" uuid,
	"mcp_enabled" boolean DEFAULT false NOT NULL,
	"mcp_allow_deletes" boolean DEFAULT false NOT NULL,
	"mcp_prompts_collection" varchar(255) DEFAULT NULL,
	"mcp_system_prompt_enabled" boolean DEFAULT true NOT NULL,
	"mcp_system_prompt" text,
	"project_owner" varchar(255),
	"project_usage" varchar(255),
	"org_name" varchar(255),
	"product_updates" boolean,
	"project_status" varchar(255),
	"ai_openai_api_key" text,
	"ai_anthropic_api_key" text,
	"ai_system_prompt" text,
	"ai_google_api_key" text,
	"ai_openai_compatible_api_key" text,
	"ai_openai_compatible_base_url" text,
	"ai_openai_compatible_name" text,
	"ai_openai_compatible_models" json,
	"ai_openai_compatible_headers" json,
	"ai_openai_allowed_models" json,
	"ai_anthropic_allowed_models" json,
	"ai_google_allowed_models" json,
	"collaborative_editing_enabled" boolean DEFAULT false NOT NULL,
	"ai_translation_default_model" text,
	"ai_translation_glossary" json,
	"ai_translation_style_guide" text,
	"license_key" varchar(255) DEFAULT NULL,
	"license_token" text,
	"mcp_oauth_enabled" boolean DEFAULT false NOT NULL,
	"mcp_oauth_dcr_enabled" boolean DEFAULT false NOT NULL,
	"mcp_oauth_cimd_enabled" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directus_shares" (
	"id" uuid PRIMARY KEY,
	"name" varchar(255),
	"collection" varchar(64) NOT NULL,
	"item" varchar(255) NOT NULL,
	"role" uuid,
	"password" varchar(255),
	"user_created" uuid,
	"date_created" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"date_start" timestamp with time zone,
	"date_end" timestamp with time zone,
	"times_used" integer DEFAULT 0,
	"max_uses" integer
);
--> statement-breakpoint
CREATE TABLE "directus_translations" (
	"id" uuid PRIMARY KEY,
	"language" varchar(255) NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directus_users" (
	"id" uuid PRIMARY KEY,
	"first_name" varchar(50),
	"last_name" varchar(50),
	"email" varchar(128) CONSTRAINT "directus_users_email_unique" UNIQUE,
	"password" varchar(255),
	"location" varchar(255),
	"title" varchar(50),
	"description" text,
	"tags" json,
	"avatar" uuid,
	"language" varchar(255) DEFAULT NULL,
	"tfa_secret" varchar(255),
	"status" varchar(16) DEFAULT 'active' NOT NULL,
	"role" uuid,
	"token" varchar(255) CONSTRAINT "directus_users_token_unique" UNIQUE,
	"last_access" timestamp with time zone,
	"last_page" varchar(255),
	"provider" varchar(128) DEFAULT 'default' NOT NULL,
	"external_identifier" varchar(255) CONSTRAINT "directus_users_external_identifier_unique" UNIQUE,
	"auth_data" json,
	"email_notifications" boolean DEFAULT true,
	"appearance" varchar(255),
	"theme_dark" varchar(255),
	"theme_light" varchar(255),
	"theme_light_overrides" json,
	"theme_dark_overrides" json,
	"text_direction" varchar(255) DEFAULT 'auto' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directus_versions" (
	"id" uuid PRIMARY KEY,
	"key" varchar(64) NOT NULL,
	"name" varchar(255),
	"collection" varchar(64) NOT NULL,
	"item" varchar(255),
	"hash" varchar(255),
	"date_created" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"date_updated" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"user_created" uuid,
	"user_updated" uuid,
	"delta" json
);
--> statement-breakpoint
CREATE TABLE "global_campaign_highlight" (
	"id" serial PRIMARY KEY,
	"campaign" integer
);
--> statement-breakpoint
CREATE TABLE "global_campaign_highlight_campaigns" (
	"id" serial PRIMARY KEY,
	"global_campaign_highlight_id" integer,
	"campaigns_id" integer
);
--> statement-breakpoint
CREATE TABLE "global_site_intro" (
	"id" serial PRIMARY KEY,
	"content" json
);
--> statement-breakpoint
CREATE TABLE "post_reactions" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "user_reactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"type" varchar(12) NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_tags" (
	"post_id" integer,
	"tag_id" integer,
	CONSTRAINT "post_tags_pkey" PRIMARY KEY("tag_id","post_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"content" jsonb NOT NULL,
	"author_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp,
	"is_edited" boolean DEFAULT false,
	"parent_id" integer,
	"title" text,
	"images" jsonb DEFAULT '[]',
	"is_imported" boolean DEFAULT false,
	"imported_author_name" text,
	"imported_date" text,
	"imported_avatar_url" text,
	CONSTRAINT "no_self_reference" CHECK ((parent_id <> id)),
	CONSTRAINT "thread_starter_has_title" CHECK (((parent_id IS NOT NULL) OR (title IS NOT NULL)))
);
--> statement-breakpoint
CREATE TABLE "private_messages" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "private_messages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"conversation_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"images" jsonb DEFAULT '[]'
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL CONSTRAINT "tags_name_key" UNIQUE,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "tcup_updates" (
	"id" serial PRIMARY KEY,
	"archived" boolean DEFAULT false NOT NULL,
	"sort" integer,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"title" varchar(255),
	"content" json,
	"image" uuid,
	"publish_date" timestamp DEFAULT '2026-07-23 13:41:41.116873'
);
--> statement-breakpoint
CREATE TABLE "themes" (
	"id" serial PRIMARY KEY,
	"name" varchar(255),
	"slug" varchar(255),
	"foreground" varchar(255) DEFAULT NULL NOT NULL,
	"background" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "thread_read_status" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "thread_read_status_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"thread_id" integer NOT NULL,
	"last_read_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
	CONSTRAINT "thread_read_status_user_id_thread_id_key" UNIQUE("user_id","thread_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" text NOT NULL,
	"username" varchar(255) NOT NULL,
	"avatar_url" text,
	"auth0_id" varchar(255) NOT NULL CONSTRAINT "users_auth0_id_key" UNIQUE,
	"bio" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"role" "user_role" DEFAULT 'user'::"user_role" NOT NULL,
	"tagline" text
);
--> statement-breakpoint
CREATE INDEX "direct_messages_sender_id_idx" ON "private_messages" ("sender_id");--> statement-breakpoint
CREATE INDEX "idx_direct_messages_created_at" ON "private_messages" ("created_at");--> statement-breakpoint
CREATE INDEX "directus_activity_timestamp_index" ON "directus_activity" ("timestamp");--> statement-breakpoint
CREATE INDEX "directus_oauth_clients_date_created_index" ON "directus_oauth_clients" ("date_created");--> statement-breakpoint
CREATE INDEX "directus_oauth_codes_expires_at_index" ON "directus_oauth_codes" ("expires_at");--> statement-breakpoint
CREATE INDEX "directus_oauth_codes_used_at_index" ON "directus_oauth_codes" ("used_at");--> statement-breakpoint
CREATE INDEX "directus_oauth_consents_client_index" ON "directus_oauth_consents" ("client");--> statement-breakpoint
CREATE INDEX "directus_oauth_tokens_code_hash_index" ON "directus_oauth_tokens" ("code_hash");--> statement-breakpoint
CREATE INDEX "directus_oauth_tokens_expires_at_index" ON "directus_oauth_tokens" ("expires_at");--> statement-breakpoint
CREATE INDEX "directus_oauth_tokens_previous_session_index" ON "directus_oauth_tokens" ("previous_session");--> statement-breakpoint
CREATE INDEX "directus_oauth_tokens_session_index" ON "directus_oauth_tokens" ("session");--> statement-breakpoint
CREATE INDEX "directus_revisions_activity_index" ON "directus_revisions" ("activity");--> statement-breakpoint
CREATE INDEX "directus_revisions_parent_index" ON "directus_revisions" ("parent");--> statement-breakpoint
CREATE INDEX "directus_sessions_oauth_client_index" ON "directus_sessions" ("oauth_client");--> statement-breakpoint
CREATE INDEX "forum_messages_authorid_idx" ON "posts" ("author_id");--> statement-breakpoint
CREATE INDEX "forum_messages_id_authorid_idx" ON "posts" ("id","author_id");--> statement-breakpoint
CREATE INDEX "idx_parent_id" ON "posts" ("parent_id");--> statement-breakpoint
CREATE INDEX "idx_thread_read_status_thread_id" ON "thread_read_status" ("thread_id");--> statement-breakpoint
CREATE INDEX "idx_thread_read_status_user_id" ON "thread_read_status" ("user_id");--> statement-breakpoint
CREATE INDEX "users_id_auth0id_idx" ON "users" ("id","auth0_id");--> statement-breakpoint
CREATE INDEX "users_username_idx" ON "users" ("username");--> statement-breakpoint
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversationId_conversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "post_reactions" ADD CONSTRAINT "user_reactions_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "post_reactions" ADD CONSTRAINT "user_reactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id");--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id");--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "forum_messages_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "posts"("id");--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "forum_messages_user_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "private_messages" ADD CONSTRAINT "private_messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "private_messages" ADD CONSTRAINT "private_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "thread_read_status" ADD CONSTRAINT "thread_read_status_thread_id_posts_id_fk" FOREIGN KEY ("thread_id") REFERENCES "posts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "thread_read_status" ADD CONSTRAINT "thread_read_status_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_collections" ADD CONSTRAINT "directus_collections_group_foreign" FOREIGN KEY ("group") REFERENCES "directus_collections"("collection");--> statement-breakpoint
ALTER TABLE "directus_roles" ADD CONSTRAINT "directus_roles_parent_foreign" FOREIGN KEY ("parent") REFERENCES "directus_roles"("id");--> statement-breakpoint
ALTER TABLE "directus_users" ADD CONSTRAINT "directus_users_role_foreign" FOREIGN KEY ("role") REFERENCES "directus_roles"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "directus_folders" ADD CONSTRAINT "directus_folders_parent_foreign" FOREIGN KEY ("parent") REFERENCES "directus_folders"("id");--> statement-breakpoint
ALTER TABLE "directus_files" ADD CONSTRAINT "directus_files_folder_foreign" FOREIGN KEY ("folder") REFERENCES "directus_folders"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "directus_files" ADD CONSTRAINT "directus_files_modified_by_foreign" FOREIGN KEY ("modified_by") REFERENCES "directus_users"("id");--> statement-breakpoint
ALTER TABLE "directus_files" ADD CONSTRAINT "directus_files_uploaded_by_foreign" FOREIGN KEY ("uploaded_by") REFERENCES "directus_users"("id");--> statement-breakpoint
ALTER TABLE "directus_permissions" ADD CONSTRAINT "directus_permissions_policy_foreign" FOREIGN KEY ("policy") REFERENCES "directus_policies"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_presets" ADD CONSTRAINT "directus_presets_role_foreign" FOREIGN KEY ("role") REFERENCES "directus_roles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_presets" ADD CONSTRAINT "directus_presets_user_foreign" FOREIGN KEY ("user") REFERENCES "directus_users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_revisions" ADD CONSTRAINT "directus_revisions_activity_foreign" FOREIGN KEY ("activity") REFERENCES "directus_activity"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_revisions" ADD CONSTRAINT "directus_revisions_parent_foreign" FOREIGN KEY ("parent") REFERENCES "directus_revisions"("id");--> statement-breakpoint
ALTER TABLE "directus_revisions" ADD CONSTRAINT "directus_revisions_version_foreign" FOREIGN KEY ("version") REFERENCES "directus_versions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_sessions" ADD CONSTRAINT "directus_sessions_oauth_client_foreign" FOREIGN KEY ("oauth_client") REFERENCES "directus_oauth_clients"("client_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_sessions" ADD CONSTRAINT "directus_sessions_share_foreign" FOREIGN KEY ("share") REFERENCES "directus_shares"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_sessions" ADD CONSTRAINT "directus_sessions_user_foreign" FOREIGN KEY ("user") REFERENCES "directus_users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_settings" ADD CONSTRAINT "directus_settings_project_logo_foreign" FOREIGN KEY ("project_logo") REFERENCES "directus_files"("id");--> statement-breakpoint
ALTER TABLE "directus_settings" ADD CONSTRAINT "directus_settings_public_background_foreign" FOREIGN KEY ("public_background") REFERENCES "directus_files"("id");--> statement-breakpoint
ALTER TABLE "directus_settings" ADD CONSTRAINT "directus_settings_public_favicon_foreign" FOREIGN KEY ("public_favicon") REFERENCES "directus_files"("id");--> statement-breakpoint
ALTER TABLE "directus_settings" ADD CONSTRAINT "directus_settings_public_foreground_foreign" FOREIGN KEY ("public_foreground") REFERENCES "directus_files"("id");--> statement-breakpoint
ALTER TABLE "directus_settings" ADD CONSTRAINT "directus_settings_public_registration_role_foreign" FOREIGN KEY ("public_registration_role") REFERENCES "directus_roles"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "directus_settings" ADD CONSTRAINT "directus_settings_storage_default_folder_foreign" FOREIGN KEY ("storage_default_folder") REFERENCES "directus_folders"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "directus_dashboards" ADD CONSTRAINT "directus_dashboards_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "directus_panels" ADD CONSTRAINT "directus_panels_dashboard_foreign" FOREIGN KEY ("dashboard") REFERENCES "directus_dashboards"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_panels" ADD CONSTRAINT "directus_panels_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "directus_notifications" ADD CONSTRAINT "directus_notifications_recipient_foreign" FOREIGN KEY ("recipient") REFERENCES "directus_users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_notifications" ADD CONSTRAINT "directus_notifications_sender_foreign" FOREIGN KEY ("sender") REFERENCES "directus_users"("id");--> statement-breakpoint
ALTER TABLE "directus_shares" ADD CONSTRAINT "directus_shares_collection_foreign" FOREIGN KEY ("collection") REFERENCES "directus_collections"("collection") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_shares" ADD CONSTRAINT "directus_shares_role_foreign" FOREIGN KEY ("role") REFERENCES "directus_roles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_shares" ADD CONSTRAINT "directus_shares_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "directus_flows" ADD CONSTRAINT "directus_flows_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "directus_operations" ADD CONSTRAINT "directus_operations_flow_foreign" FOREIGN KEY ("flow") REFERENCES "directus_flows"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_operations" ADD CONSTRAINT "directus_operations_reject_foreign" FOREIGN KEY ("reject") REFERENCES "directus_operations"("id");--> statement-breakpoint
ALTER TABLE "directus_operations" ADD CONSTRAINT "directus_operations_resolve_foreign" FOREIGN KEY ("resolve") REFERENCES "directus_operations"("id");--> statement-breakpoint
ALTER TABLE "directus_operations" ADD CONSTRAINT "directus_operations_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "directus_versions" ADD CONSTRAINT "directus_versions_collection_foreign" FOREIGN KEY ("collection") REFERENCES "directus_collections"("collection") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_versions" ADD CONSTRAINT "directus_versions_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "directus_versions" ADD CONSTRAINT "directus_versions_user_updated_foreign" FOREIGN KEY ("user_updated") REFERENCES "directus_users"("id");--> statement-breakpoint
ALTER TABLE "directus_access" ADD CONSTRAINT "directus_access_policy_foreign" FOREIGN KEY ("policy") REFERENCES "directus_policies"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_access" ADD CONSTRAINT "directus_access_role_foreign" FOREIGN KEY ("role") REFERENCES "directus_roles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_access" ADD CONSTRAINT "directus_access_user_foreign" FOREIGN KEY ("user") REFERENCES "directus_users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_comments" ADD CONSTRAINT "directus_comments_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "directus_comments" ADD CONSTRAINT "directus_comments_user_updated_foreign" FOREIGN KEY ("user_updated") REFERENCES "directus_users"("id");--> statement-breakpoint
ALTER TABLE "directus_deployments" ADD CONSTRAINT "directus_deployments_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "directus_deployment_projects" ADD CONSTRAINT "directus_deployment_projects_deployment_foreign" FOREIGN KEY ("deployment") REFERENCES "directus_deployments"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_deployment_projects" ADD CONSTRAINT "directus_deployment_projects_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "directus_deployment_runs" ADD CONSTRAINT "directus_deployment_runs_project_foreign" FOREIGN KEY ("project") REFERENCES "directus_deployment_projects"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_deployment_runs" ADD CONSTRAINT "directus_deployment_runs_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "directus_users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "directus_oauth_consents" ADD CONSTRAINT "directus_oauth_consents_client_foreign" FOREIGN KEY ("client") REFERENCES "directus_oauth_clients"("client_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_oauth_consents" ADD CONSTRAINT "directus_oauth_consents_user_foreign" FOREIGN KEY ("user") REFERENCES "directus_users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_oauth_codes" ADD CONSTRAINT "directus_oauth_codes_client_foreign" FOREIGN KEY ("client") REFERENCES "directus_oauth_clients"("client_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_oauth_codes" ADD CONSTRAINT "directus_oauth_codes_user_foreign" FOREIGN KEY ("user") REFERENCES "directus_users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_oauth_tokens" ADD CONSTRAINT "directus_oauth_tokens_client_foreign" FOREIGN KEY ("client") REFERENCES "directus_oauth_clients"("client_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "directus_oauth_tokens" ADD CONSTRAINT "directus_oauth_tokens_user_foreign" FOREIGN KEY ("user") REFERENCES "directus_users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tcup_updates" ADD CONSTRAINT "tcup_updates_image_foreign" FOREIGN KEY ("image") REFERENCES "directus_files"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_call_to_action_foreign" FOREIGN KEY ("call_to_action") REFERENCES "calls_to_action"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_image_foreign" FOREIGN KEY ("image") REFERENCES "directus_files"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_theme_foreign" FOREIGN KEY ("theme") REFERENCES "themes"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "block_richtext" ADD CONSTRAINT "block_richtext_theme_foreign" FOREIGN KEY ("theme") REFERENCES "themes"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "campaigns_content_blocks" ADD CONSTRAINT "campaigns_content_blocks_campaigns_id_foreign" FOREIGN KEY ("campaigns_id") REFERENCES "campaigns"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "campaigns_blocks" ADD CONSTRAINT "campaigns_blocks_campaigns_id_foreign" FOREIGN KEY ("campaigns_id") REFERENCES "campaigns"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "global_campaign_highlight" ADD CONSTRAINT "global_campaign_highlight_campaign_foreign" FOREIGN KEY ("campaign") REFERENCES "campaigns"("id") ON DELETE SET NULL;--> statement-breakpoint
CREATE VIEW "posts_with_replies" AS (SELECT threads.id, threads.content, threads.author_id, threads.created_at, threads.updated_at, threads.deleted_at, threads.is_edited, threads.parent_id, threads.title, threads.images, threads.is_imported, threads.imported_author_name, threads.imported_date, threads.imported_avatar_url, thread_authors.avatar_url AS author_avatar, thread_authors.username AS author_name, COALESCE(thread_tags.tags, '[]'::json) AS tags, replies.latest_reply_date, replies.latest_reply_author, replies.latest_reply_author_id, replies.latest_reply_author_avatar, replies_count.reply_count AS "replyCount" FROM posts threads LEFT JOIN users thread_authors ON threads.author_id = thread_authors.id LEFT JOIN ( SELECT pt.post_id, json_agg(json_build_object('id', t.id, 'name', t.name, 'description', t.description)) AS tags FROM post_tags pt JOIN tags t ON pt.tag_id = t.id GROUP BY pt.post_id) thread_tags ON thread_tags.post_id = threads.id LEFT JOIN ( SELECT DISTINCT ON (m.parent_id) m.parent_id, m.author_id AS latest_reply_author_id, u.username AS latest_reply_author, u.avatar_url AS latest_reply_author_avatar, m.created_at AS latest_reply_date FROM posts m LEFT JOIN users u ON u.id = m.author_id WHERE m.parent_id IS NOT NULL ORDER BY m.parent_id, m.created_at DESC) replies ON replies.parent_id = threads.id LEFT JOIN ( SELECT posts.parent_id, count(*) AS reply_count FROM posts WHERE posts.parent_id IS NOT NULL GROUP BY posts.parent_id) replies_count ON replies_count.parent_id = threads.id WHERE threads.parent_id IS NULL ORDER BY (COALESCE(replies.latest_reply_date, threads.created_at)) DESC);
*/