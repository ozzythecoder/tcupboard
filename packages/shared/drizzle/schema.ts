import { sql } from "drizzle-orm";
import {
    bigint,
    boolean,
    check,
    foreignKey,
    index,
    integer,
    json,
    jsonb,
    pgEnum,
    pgSchema,
    pgTable,
    pgView,
    primaryKey,
    real,
    serial,
    text,
    timestamp,
    unique,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import type { DraftJsContent, ImageMetadata, TipTapContent } from "@/index.ts";

export const auth = pgSchema("auth");
export const pgrst = pgSchema("pgrst");
export const userRole = pgEnum("user_role", ["user", "admin", "moderator", "superadmin"]);

export const blockRichtext = pgTable("block_richtext", {
    id: serial().primaryKey(),
    theme: integer()
        .default(1)
        .references(() => themes.id, { onDelete: "set null" }),
    content: json(),
});

export const callsToAction = pgTable("calls_to_action", {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }),
    callout: varchar({ length: 255 }),
    action: varchar({ length: 255 }),
    url: varchar({ length: 255 }),
    theme: json(),
});

export const campaigns = pgTable("campaigns", {
    id: serial().primaryKey(),
    sort: integer(),
    dateCreated: timestamp("date_created", { withTimezone: true }),
    dateUpdated: timestamp("date_updated", { withTimezone: true }),
    title: varchar({ length: 255 }).default(sql`NULL`).notNull(),
    image: uuid().references(() => directusFiles.id, { onDelete: "set null" }),
    slug: varchar({ length: 255 }).default(sql`NULL`).notNull(),
    callToAction: integer("call_to_action").references(() => callsToAction.id, {
        onDelete: "set null",
    }),
    subtitle: varchar({ length: 255 }),
    showFooter: boolean("show_footer").default(true).notNull(),
    theme: integer()
        .default(1)
        .references(() => themes.id, { onDelete: "set null" }),
});

export const campaignsBlocks = pgTable("campaigns_blocks", {
    id: serial().primaryKey(),
    campaignsId: integer("campaigns_id").references(() => campaigns.id, { onDelete: "set null" }),
    item: varchar({ length: 255 }),
    collection: varchar({ length: 255 }),
    sort: integer(),
});

export const campaignsContentBlocks = pgTable("campaigns_content_blocks", {
    id: serial().primaryKey(),
    campaignsId: integer("campaigns_id").references(() => campaigns.id, { onDelete: "set null" }),
    item: varchar({ length: 255 }),
    collection: varchar({ length: 255 }),
});

export const conversationParticipants = pgTable(
    "conversation_participants",
    {
        conversationId: integer()
            .notNull()
            .references(() => conversations.id, { onDelete: "cascade" }),
        userId: integer()
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
    },
    (table) => [
        primaryKey({
            columns: [table.userId, table.conversationId],
            name: "conversation_participants_conversationId_userId_pk",
        }),
    ],
);

export const conversations = pgTable("conversations", {
    id: serial().primaryKey(),
});

export const directusAccess = pgTable("directus_access", {
    id: uuid().primaryKey(),
    role: uuid().references(() => directusRoles.id, { onDelete: "cascade" }),
    user: uuid().references(() => directusUsers.id, { onDelete: "cascade" }),
    policy: uuid()
        .notNull()
        .references(() => directusPolicies.id, { onDelete: "cascade" }),
    sort: integer(),
});

export const directusActivity = pgTable(
    "directus_activity",
    {
        id: serial().primaryKey(),
        action: varchar({ length: 45 }).notNull(),
        user: uuid(),
        timestamp: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
        ip: varchar({ length: 50 }),
        userAgent: text("user_agent"),
        collection: varchar({ length: 64 }).notNull(),
        item: varchar({ length: 255 }).notNull(),
        origin: varchar({ length: 255 }),
    },
    (table) => [
        index("directus_activity_timestamp_index").using(
            "btree",
            table.timestamp.asc().nullsLast(),
        ),
    ],
);

export const directusCollections = pgTable(
    "directus_collections",
    {
        collection: varchar({ length: 64 }).primaryKey(),
        icon: varchar({ length: 64 }),
        note: text(),
        displayTemplate: varchar("display_template", { length: 255 }),
        hidden: boolean().default(false).notNull(),
        singleton: boolean().default(false).notNull(),
        translations: json(),
        archiveField: varchar("archive_field", { length: 64 }),
        archiveAppFilter: boolean("archive_app_filter").default(true).notNull(),
        archiveValue: varchar("archive_value", { length: 255 }),
        unarchiveValue: varchar("unarchive_value", { length: 255 }),
        sortField: varchar("sort_field", { length: 64 }),
        accountability: varchar({ length: 255 }).default("all"),
        color: varchar({ length: 255 }),
        itemDuplicationFields: json("item_duplication_fields"),
        sort: integer(),
        group: varchar({ length: 64 }),
        collapse: varchar({ length: 255 }).default("open").notNull(),
        previewUrl: varchar("preview_url", { length: 255 }),
        versioning: boolean().default(false).notNull(),
        status: varchar({ length: 255 }).default("active").notNull(),
        autosaveRevisionInterval: real("autosave_revision_interval"),
    },
    (table) => [
        foreignKey({
            columns: [table.group],
            foreignColumns: [table.collection],
            name: "directus_collections_group_foreign",
        }),
    ],
);

export const directusComments = pgTable("directus_comments", {
    id: uuid().primaryKey(),
    collection: varchar({ length: 64 }).notNull(),
    item: varchar({ length: 255 }).notNull(),
    comment: text().notNull(),
    dateCreated: timestamp("date_created", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    dateUpdated: timestamp("date_updated", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    userCreated: uuid("user_created").references(() => directusUsers.id, { onDelete: "set null" }),
    userUpdated: uuid("user_updated").references(() => directusUsers.id),
});

export const directusDashboards = pgTable("directus_dashboards", {
    id: uuid().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    icon: varchar({ length: 64 }).default("dashboard").notNull(),
    note: text(),
    dateCreated: timestamp("date_created", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    userCreated: uuid("user_created").references(() => directusUsers.id, { onDelete: "set null" }),
    color: varchar({ length: 255 }),
});

export const directusDeploymentProjects = pgTable(
    "directus_deployment_projects",
    {
        id: uuid().primaryKey(),
        deployment: uuid()
            .notNull()
            .references(() => directusDeployments.id, { onDelete: "cascade" }),
        externalId: varchar("external_id", { length: 255 }).notNull(),
        name: varchar({ length: 255 }).notNull(),
        dateCreated: timestamp("date_created", { withTimezone: true }).default(
            sql`CURRENT_TIMESTAMP`,
        ),
        userCreated: uuid("user_created").references(() => directusUsers.id, {
            onDelete: "set null",
        }),
        url: varchar({ length: 255 }),
        framework: varchar({ length: 255 }),
        deployable: boolean().default(true).notNull(),
    },
    (table) => [
        unique("directus_deployment_projects_deployment_external_id_unique").on(
            table.deployment,
            table.externalId,
        ),
    ],
);

export const directusDeploymentRuns = pgTable("directus_deployment_runs", {
    id: uuid().primaryKey(),
    project: uuid()
        .notNull()
        .references(() => directusDeploymentProjects.id, { onDelete: "cascade" }),
    externalId: varchar("external_id", { length: 255 }).notNull(),
    target: varchar({ length: 255 }).notNull(),
    dateCreated: timestamp("date_created", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    userCreated: uuid("user_created").references(() => directusUsers.id, { onDelete: "set null" }),
    status: varchar({ length: 255 }),
    url: varchar({ length: 255 }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const directusDeployments = pgTable(
    "directus_deployments",
    {
        id: uuid().primaryKey(),
        provider: varchar({ length: 255 }).notNull(),
        credentials: text(),
        options: text(),
        dateCreated: timestamp("date_created", { withTimezone: true }).default(
            sql`CURRENT_TIMESTAMP`,
        ),
        userCreated: uuid("user_created").references(() => directusUsers.id, {
            onDelete: "set null",
        }),
        webhookIds: json("webhook_ids"),
        webhookSecret: varchar("webhook_secret", { length: 255 }),
        lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    },
    (table) => [unique("directus_deployments_provider_unique").on(table.provider)],
);

export const directusExtensions = pgTable("directus_extensions", {
    enabled: boolean().default(true).notNull(),
    id: uuid().primaryKey(),
    folder: varchar({ length: 255 }).notNull(),
    source: varchar({ length: 255 }).notNull(),
    bundle: uuid(),
});

export const directusFields = pgTable("directus_fields", {
    id: serial().primaryKey(),
    collection: varchar({ length: 64 }).notNull(),
    field: varchar({ length: 64 }).notNull(),
    special: varchar({ length: 64 }),
    interface: varchar({ length: 64 }),
    options: json(),
    display: varchar({ length: 64 }),
    displayOptions: json("display_options"),
    readonly: boolean().default(false).notNull(),
    hidden: boolean().default(false).notNull(),
    sort: integer(),
    width: varchar({ length: 30 }).default("full"),
    translations: json(),
    note: text(),
    conditions: json(),
    required: boolean().default(false),
    group: varchar({ length: 64 }),
    validation: json(),
    validationMessage: text("validation_message"),
    searchable: boolean().default(true).notNull(),
});

export const directusFiles = pgTable("directus_files", {
    id: uuid().primaryKey(),
    storage: varchar({ length: 255 }).notNull(),
    filenameDisk: varchar("filename_disk", { length: 255 }),
    filenameDownload: varchar("filename_download", { length: 255 }).notNull(),
    title: varchar({ length: 255 }),
    type: varchar({ length: 255 }),
    folder: uuid().references(() => directusFolders.id, { onDelete: "set null" }),
    uploadedBy: uuid("uploaded_by").references(() => directusUsers.id),
    createdOn: timestamp("created_on", { withTimezone: true })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    modifiedBy: uuid("modified_by").references(() => directusUsers.id),
    modifiedOn: timestamp("modified_on", { withTimezone: true })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    charset: varchar({ length: 50 }),
    filesize: bigint({ mode: "number" }),
    width: integer(),
    height: integer(),
    duration: integer(),
    embed: varchar({ length: 200 }),
    description: text(),
    location: text(),
    tags: text(),
    metadata: json(),
    focalPointX: integer("focal_point_x"),
    focalPointY: integer("focal_point_y"),
    tusId: varchar("tus_id", { length: 64 }),
    tusData: json("tus_data"),
    uploadedOn: timestamp("uploaded_on", { withTimezone: true }),
});

export const directusFlows = pgTable(
    "directus_flows",
    {
        id: uuid().primaryKey(),
        name: varchar({ length: 255 }).notNull(),
        icon: varchar({ length: 64 }),
        color: varchar({ length: 255 }),
        description: text(),
        status: varchar({ length: 255 }).default("active").notNull(),
        trigger: varchar({ length: 255 }),
        accountability: varchar({ length: 255 }).default("all"),
        options: json(),
        operation: uuid(),
        dateCreated: timestamp("date_created", { withTimezone: true }).default(
            sql`CURRENT_TIMESTAMP`,
        ),
        userCreated: uuid("user_created").references(() => directusUsers.id, {
            onDelete: "set null",
        }),
    },
    (table) => [unique("directus_flows_operation_unique").on(table.operation)],
);

export const directusFolders = pgTable(
    "directus_folders",
    {
        id: uuid().primaryKey(),
        name: varchar({ length: 255 }).notNull(),
        parent: uuid(),
    },
    (table) => [
        foreignKey({
            columns: [table.parent],
            foreignColumns: [table.id],
            name: "directus_folders_parent_foreign",
        }),
    ],
);

export const directusMigrations = pgTable("directus_migrations", {
    version: varchar({ length: 255 }).primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    timestamp: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
});

export const directusNotifications = pgTable("directus_notifications", {
    id: serial().primaryKey(),
    timestamp: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    status: varchar({ length: 255 }).default("inbox"),
    recipient: uuid()
        .notNull()
        .references(() => directusUsers.id, { onDelete: "cascade" }),
    sender: uuid().references(() => directusUsers.id),
    subject: varchar({ length: 255 }).notNull(),
    message: text(),
    collection: varchar({ length: 64 }),
    item: varchar({ length: 255 }),
});

export const directusOauthClients = pgTable(
    "directus_oauth_clients",
    {
        clientId: varchar("client_id", { length: 255 }).primaryKey(),
        clientName: varchar("client_name", { length: 200 }).notNull(),
        redirectUris: json("redirect_uris").notNull(),
        grantTypes: json("grant_types").notNull(),
        tokenEndpointAuthMethod: varchar("token_endpoint_auth_method", { length: 255 })
            .default("none")
            .notNull(),
        clientSecretHash: varchar("client_secret_hash", { length: 64 }),
        registrationType: varchar("registration_type", { length: 10 }).default("dcr").notNull(),
        clientUri: text("client_uri"),
        logoUri: text("logo_uri"),
        tosUri: text("tos_uri"),
        policyUri: text("policy_uri"),
        metadataFetchedAt: timestamp("metadata_fetched_at", { withTimezone: true }),
        metadataExpiresAt: timestamp("metadata_expires_at", { withTimezone: true }),
        metadataEtag: varchar("metadata_etag", { length: 255 }),
        dateCreated: timestamp("date_created", { withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [
        index("directus_oauth_clients_date_created_index").using(
            "btree",
            table.dateCreated.asc().nullsLast(),
        ),
    ],
);

export const directusOauthCodes = pgTable(
    "directus_oauth_codes",
    {
        id: uuid().primaryKey(),
        codeHash: varchar("code_hash", { length: 64 }).notNull(),
        client: varchar({ length: 255 })
            .notNull()
            .references(() => directusOauthClients.clientId, { onDelete: "cascade" }),
        user: uuid()
            .notNull()
            .references(() => directusUsers.id, { onDelete: "cascade" }),
        redirectUri: varchar("redirect_uri", { length: 255 }).notNull(),
        resource: varchar({ length: 255 }).notNull(),
        codeChallenge: varchar("code_challenge", { length: 128 }).notNull(),
        codeChallengeMethod: varchar("code_challenge_method", { length: 10 }).notNull(),
        scope: varchar({ length: 255 }),
        expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
        usedAt: timestamp("used_at", { withTimezone: true }),
    },
    (table) => [
        index("directus_oauth_codes_expires_at_index").using(
            "btree",
            table.expiresAt.asc().nullsLast(),
        ),
        index("directus_oauth_codes_used_at_index").using("btree", table.usedAt.asc().nullsLast()),
        unique("directus_oauth_codes_code_hash_unique").on(table.codeHash),
    ],
);

export const directusOauthConsents = pgTable(
    "directus_oauth_consents",
    {
        id: uuid().primaryKey(),
        user: uuid()
            .notNull()
            .references(() => directusUsers.id, { onDelete: "cascade" }),
        client: varchar({ length: 255 })
            .notNull()
            .references(() => directusOauthClients.clientId, { onDelete: "cascade" }),
        redirectUri: varchar("redirect_uri", { length: 255 }).notNull(),
        scope: varchar({ length: 255 }),
        dateCreated: timestamp("date_created", { withTimezone: true }).notNull(),
        dateUpdated: timestamp("date_updated", { withTimezone: true }).notNull(),
    },
    (table) => [
        index("directus_oauth_consents_client_index").using(
            "btree",
            table.client.asc().nullsLast(),
        ),
        unique("directus_oauth_consents_user_client_redirect_uri_unique").on(
            table.user,
            table.client,
            table.redirectUri,
        ),
    ],
);

export const directusOauthTokens = pgTable(
    "directus_oauth_tokens",
    {
        id: uuid().primaryKey(),
        client: varchar({ length: 255 })
            .notNull()
            .references(() => directusOauthClients.clientId, { onDelete: "cascade" }),
        user: uuid()
            .notNull()
            .references(() => directusUsers.id, { onDelete: "cascade" }),
        session: varchar({ length: 64 }).notNull(),
        previousSession: varchar("previous_session", { length: 64 }),
        resource: varchar({ length: 255 }).notNull(),
        codeHash: varchar("code_hash", { length: 64 }).notNull(),
        scope: varchar({ length: 255 }),
        expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
        dateCreated: timestamp("date_created", { withTimezone: true }).notNull(),
    },
    (table) => [
        index("directus_oauth_tokens_code_hash_index").using(
            "btree",
            table.codeHash.asc().nullsLast(),
        ),
        index("directus_oauth_tokens_expires_at_index").using(
            "btree",
            table.expiresAt.asc().nullsLast(),
        ),
        index("directus_oauth_tokens_previous_session_index").using(
            "btree",
            table.previousSession.asc().nullsLast(),
        ),
        index("directus_oauth_tokens_session_index").using(
            "btree",
            table.session.asc().nullsLast(),
        ),
        unique("directus_oauth_tokens_client_user_unique").on(table.client, table.user),
    ],
);

export const directusOperations = pgTable(
    "directus_operations",
    {
        id: uuid().primaryKey(),
        name: varchar({ length: 255 }),
        key: varchar({ length: 255 }).notNull(),
        type: varchar({ length: 255 }).notNull(),
        positionX: integer("position_x").notNull(),
        positionY: integer("position_y").notNull(),
        options: json(),
        resolve: uuid(),
        reject: uuid(),
        flow: uuid()
            .notNull()
            .references(() => directusFlows.id, { onDelete: "cascade" }),
        dateCreated: timestamp("date_created", { withTimezone: true }).default(
            sql`CURRENT_TIMESTAMP`,
        ),
        userCreated: uuid("user_created").references(() => directusUsers.id, {
            onDelete: "set null",
        }),
    },
    (table) => [
        foreignKey({
            columns: [table.reject],
            foreignColumns: [table.id],
            name: "directus_operations_reject_foreign",
        }),
        foreignKey({
            columns: [table.resolve],
            foreignColumns: [table.id],
            name: "directus_operations_resolve_foreign",
        }),
        unique("directus_operations_reject_unique").on(table.reject),
        unique("directus_operations_resolve_unique").on(table.resolve),
    ],
);

export const directusPanels = pgTable("directus_panels", {
    id: uuid().primaryKey(),
    dashboard: uuid()
        .notNull()
        .references(() => directusDashboards.id, { onDelete: "cascade" }),
    name: varchar({ length: 255 }),
    icon: varchar({ length: 64 }).default(sql`NULL`),
    color: varchar({ length: 10 }),
    showHeader: boolean("show_header").default(false).notNull(),
    note: text(),
    type: varchar({ length: 255 }).notNull(),
    positionX: integer("position_x").notNull(),
    positionY: integer("position_y").notNull(),
    width: integer().notNull(),
    height: integer().notNull(),
    options: json(),
    dateCreated: timestamp("date_created", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    userCreated: uuid("user_created").references(() => directusUsers.id, { onDelete: "set null" }),
});

export const directusPermissions = pgTable("directus_permissions", {
    id: serial().primaryKey(),
    collection: varchar({ length: 64 }).notNull(),
    action: varchar({ length: 10 }).notNull(),
    permissions: json(),
    validation: json(),
    presets: json(),
    fields: text(),
    policy: uuid()
        .notNull()
        .references(() => directusPolicies.id, { onDelete: "cascade" }),
});

export const directusPolicies = pgTable("directus_policies", {
    id: uuid().primaryKey(),
    name: varchar({ length: 100 }).notNull(),
    icon: varchar({ length: 64 }).default("badge").notNull(),
    description: text(),
    ipAccess: text("ip_access"),
    enforceTfa: boolean("enforce_tfa").default(false).notNull(),
    adminAccess: boolean("admin_access").default(false).notNull(),
    appAccess: boolean("app_access").default(false).notNull(),
});

export const directusPresets = pgTable("directus_presets", {
    id: serial().primaryKey(),
    bookmark: varchar({ length: 255 }),
    user: uuid().references(() => directusUsers.id, { onDelete: "cascade" }),
    role: uuid().references(() => directusRoles.id, { onDelete: "cascade" }),
    collection: varchar({ length: 64 }),
    search: varchar({ length: 100 }),
    layout: varchar({ length: 100 }).default("tabular"),
    layoutQuery: json("layout_query"),
    layoutOptions: json("layout_options"),
    refreshInterval: integer("refresh_interval"),
    filter: json(),
    icon: varchar({ length: 64 }).default("bookmark"),
    color: varchar({ length: 255 }),
});

export const directusRelations = pgTable("directus_relations", {
    id: serial().primaryKey(),
    manyCollection: varchar("many_collection", { length: 64 }).notNull(),
    manyField: varchar("many_field", { length: 64 }).notNull(),
    oneCollection: varchar("one_collection", { length: 64 }),
    oneField: varchar("one_field", { length: 64 }),
    oneCollectionField: varchar("one_collection_field", { length: 64 }),
    oneAllowedCollections: text("one_allowed_collections"),
    junctionField: varchar("junction_field", { length: 64 }),
    sortField: varchar("sort_field", { length: 64 }),
    oneDeselectAction: varchar("one_deselect_action", { length: 255 }).default("nullify").notNull(),
});

export const directusRevisions = pgTable(
    "directus_revisions",
    {
        id: serial().primaryKey(),
        activity: integer()
            .notNull()
            .references(() => directusActivity.id, { onDelete: "cascade" }),
        collection: varchar({ length: 64 }).notNull(),
        item: varchar({ length: 255 }).notNull(),
        data: json(),
        delta: json(),
        parent: integer(),
        version: uuid().references(() => directusVersions.id, { onDelete: "cascade" }),
    },
    (table) => [
        foreignKey({
            columns: [table.parent],
            foreignColumns: [table.id],
            name: "directus_revisions_parent_foreign",
        }),
        index("directus_revisions_activity_index").using("btree", table.activity.asc().nullsLast()),
        index("directus_revisions_parent_index").using("btree", table.parent.asc().nullsLast()),
    ],
);

export const directusRoles = pgTable(
    "directus_roles",
    {
        id: uuid().primaryKey(),
        name: varchar({ length: 100 }).notNull(),
        icon: varchar({ length: 64 }).default("supervised_user_circle").notNull(),
        description: text(),
        parent: uuid(),
    },
    (table) => [
        foreignKey({
            columns: [table.parent],
            foreignColumns: [table.id],
            name: "directus_roles_parent_foreign",
        }),
    ],
);

export const directusSessions = pgTable(
    "directus_sessions",
    {
        token: varchar({ length: 64 }).primaryKey(),
        user: uuid().references(() => directusUsers.id, { onDelete: "cascade" }),
        expires: timestamp({ withTimezone: true }).notNull(),
        ip: varchar({ length: 255 }),
        userAgent: text("user_agent"),
        share: uuid().references(() => directusShares.id, { onDelete: "cascade" }),
        origin: varchar({ length: 255 }),
        nextToken: varchar("next_token", { length: 64 }),
        oauthClient: varchar("oauth_client", { length: 255 }).references(
            () => directusOauthClients.clientId,
            { onDelete: "cascade" },
        ),
    },
    (table) => [
        index("directus_sessions_oauth_client_index").using(
            "btree",
            table.oauthClient.asc().nullsLast(),
        ),
    ],
);

export const directusSettings = pgTable("directus_settings", {
    id: serial().primaryKey(),
    projectName: varchar("project_name", { length: 100 }).default("Directus").notNull(),
    projectUrl: varchar("project_url", { length: 255 }),
    projectColor: varchar("project_color", { length: 255 }).default("#6644FF").notNull(),
    projectLogo: uuid("project_logo").references(() => directusFiles.id),
    publicForeground: uuid("public_foreground").references(() => directusFiles.id),
    publicBackground: uuid("public_background").references(() => directusFiles.id),
    publicNote: text("public_note"),
    authLoginAttempts: integer("auth_login_attempts").default(25),
    authPasswordPolicy: varchar("auth_password_policy", { length: 100 }),
    storageAssetTransform: varchar("storage_asset_transform", { length: 7 }).default("all"),
    storageAssetPresets: json("storage_asset_presets"),
    customCss: text("custom_css"),
    storageDefaultFolder: uuid("storage_default_folder").references(() => directusFolders.id, {
        onDelete: "set null",
    }),
    basemaps: json(),
    mapboxKey: varchar("mapbox_key", { length: 255 }),
    moduleBar: json("module_bar"),
    projectDescriptor: varchar("project_descriptor", { length: 100 }),
    defaultLanguage: varchar("default_language", { length: 255 }).default("en-US").notNull(),
    customAspectRatios: json("custom_aspect_ratios"),
    publicFavicon: uuid("public_favicon").references(() => directusFiles.id),
    defaultAppearance: varchar("default_appearance", { length: 255 }).default("auto").notNull(),
    defaultThemeLight: varchar("default_theme_light", { length: 255 }),
    themeLightOverrides: json("theme_light_overrides"),
    defaultThemeDark: varchar("default_theme_dark", { length: 255 }),
    themeDarkOverrides: json("theme_dark_overrides"),
    reportErrorUrl: varchar("report_error_url", { length: 255 }),
    reportBugUrl: varchar("report_bug_url", { length: 255 }),
    reportFeatureUrl: varchar("report_feature_url", { length: 255 }),
    publicRegistration: boolean("public_registration").default(false).notNull(),
    publicRegistrationVerifyEmail: boolean("public_registration_verify_email")
        .default(true)
        .notNull(),
    publicRegistrationRole: uuid("public_registration_role").references(() => directusRoles.id, {
        onDelete: "set null",
    }),
    publicRegistrationEmailFilter: json("public_registration_email_filter"),
    visualEditorUrls: json("visual_editor_urls"),
    projectId: uuid("project_id"),
    mcpEnabled: boolean("mcp_enabled").default(false).notNull(),
    mcpAllowDeletes: boolean("mcp_allow_deletes").default(false).notNull(),
    mcpPromptsCollection: varchar("mcp_prompts_collection", { length: 255 }).default(sql`NULL`),
    mcpSystemPromptEnabled: boolean("mcp_system_prompt_enabled").default(true).notNull(),
    mcpSystemPrompt: text("mcp_system_prompt"),
    projectOwner: varchar("project_owner", { length: 255 }),
    projectUsage: varchar("project_usage", { length: 255 }),
    orgName: varchar("org_name", { length: 255 }),
    productUpdates: boolean("product_updates"),
    projectStatus: varchar("project_status", { length: 255 }),
    aiOpenaiApiKey: text("ai_openai_api_key"),
    aiAnthropicApiKey: text("ai_anthropic_api_key"),
    aiSystemPrompt: text("ai_system_prompt"),
    aiGoogleApiKey: text("ai_google_api_key"),
    aiOpenaiCompatibleApiKey: text("ai_openai_compatible_api_key"),
    aiOpenaiCompatibleBaseUrl: text("ai_openai_compatible_base_url"),
    aiOpenaiCompatibleName: text("ai_openai_compatible_name"),
    aiOpenaiCompatibleModels: json("ai_openai_compatible_models"),
    aiOpenaiCompatibleHeaders: json("ai_openai_compatible_headers"),
    aiOpenaiAllowedModels: json("ai_openai_allowed_models"),
    aiAnthropicAllowedModels: json("ai_anthropic_allowed_models"),
    aiGoogleAllowedModels: json("ai_google_allowed_models"),
    collaborativeEditingEnabled: boolean("collaborative_editing_enabled").default(false).notNull(),
    aiTranslationDefaultModel: text("ai_translation_default_model"),
    aiTranslationGlossary: json("ai_translation_glossary"),
    aiTranslationStyleGuide: text("ai_translation_style_guide"),
    licenseKey: varchar("license_key", { length: 255 }).default(sql`NULL`),
    licenseToken: text("license_token"),
    mcpOauthEnabled: boolean("mcp_oauth_enabled").default(false).notNull(),
    mcpOauthDcrEnabled: boolean("mcp_oauth_dcr_enabled").default(false).notNull(),
    mcpOauthCimdEnabled: boolean("mcp_oauth_cimd_enabled").default(false).notNull(),
});

export const directusShares = pgTable("directus_shares", {
    id: uuid().primaryKey(),
    name: varchar({ length: 255 }),
    collection: varchar({ length: 64 })
        .notNull()
        .references(() => directusCollections.collection, { onDelete: "cascade" }),
    item: varchar({ length: 255 }).notNull(),
    role: uuid().references(() => directusRoles.id, { onDelete: "cascade" }),
    password: varchar({ length: 255 }),
    userCreated: uuid("user_created").references(() => directusUsers.id, { onDelete: "set null" }),
    dateCreated: timestamp("date_created", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    dateStart: timestamp("date_start", { withTimezone: true }),
    dateEnd: timestamp("date_end", { withTimezone: true }),
    timesUsed: integer("times_used").default(0),
    maxUses: integer("max_uses"),
});

export const directusTranslations = pgTable("directus_translations", {
    id: uuid().primaryKey(),
    language: varchar({ length: 255 }).notNull(),
    key: varchar({ length: 255 }).notNull(),
    value: text().notNull(),
});

export const directusUsers = pgTable(
    "directus_users",
    {
        id: uuid().primaryKey(),
        firstName: varchar("first_name", { length: 50 }),
        lastName: varchar("last_name", { length: 50 }),
        email: varchar({ length: 128 }),
        password: varchar({ length: 255 }),
        location: varchar({ length: 255 }),
        title: varchar({ length: 50 }),
        description: text(),
        tags: json(),
        avatar: uuid(),
        language: varchar({ length: 255 }).default(sql`NULL`),
        tfaSecret: varchar("tfa_secret", { length: 255 }),
        status: varchar({ length: 16 }).default("active").notNull(),
        role: uuid().references(() => directusRoles.id, { onDelete: "set null" }),
        token: varchar({ length: 255 }),
        lastAccess: timestamp("last_access", { withTimezone: true }),
        lastPage: varchar("last_page", { length: 255 }),
        provider: varchar({ length: 128 }).default("default").notNull(),
        externalIdentifier: varchar("external_identifier", { length: 255 }),
        authData: json("auth_data"),
        emailNotifications: boolean("email_notifications").default(true),
        appearance: varchar({ length: 255 }),
        themeDark: varchar("theme_dark", { length: 255 }),
        themeLight: varchar("theme_light", { length: 255 }),
        themeLightOverrides: json("theme_light_overrides"),
        themeDarkOverrides: json("theme_dark_overrides"),
        textDirection: varchar("text_direction", { length: 255 }).default("auto").notNull(),
    },
    (table) => [
        unique("directus_users_email_unique").on(table.email),
        unique("directus_users_external_identifier_unique").on(table.externalIdentifier),
        unique("directus_users_token_unique").on(table.token),
    ],
);

export const directusVersions = pgTable("directus_versions", {
    id: uuid().primaryKey(),
    key: varchar({ length: 64 }).notNull(),
    name: varchar({ length: 255 }),
    collection: varchar({ length: 64 })
        .notNull()
        .references(() => directusCollections.collection, { onDelete: "cascade" }),
    item: varchar({ length: 255 }),
    hash: varchar({ length: 255 }),
    dateCreated: timestamp("date_created", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    dateUpdated: timestamp("date_updated", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    userCreated: uuid("user_created").references(() => directusUsers.id, { onDelete: "set null" }),
    userUpdated: uuid("user_updated").references(() => directusUsers.id),
    delta: json(),
});

export const globalCampaignHighlight = pgTable("global_campaign_highlight", {
    id: serial().primaryKey(),
    campaign: integer().references(() => campaigns.id, { onDelete: "set null" }),
});

export const globalCampaignHighlightCampaigns = pgTable("global_campaign_highlight_campaigns", {
    id: serial().primaryKey(),
    globalCampaignHighlightId: integer("global_campaign_highlight_id"),
    campaignsId: integer("campaigns_id"),
});

export const globalSiteIntro = pgTable("global_site_intro", {
    id: serial().primaryKey(),
    content: json(),
});

export const postReactions = pgTable("post_reactions", {
    id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "user_reactions_id_seq" }),
    postId: integer("post_id")
        .notNull()
        .references(() => posts.id, { onDelete: "cascade" }),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    type: varchar({ length: 12 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
        .default(sql`timezone('utc'::text, now())`)
        .notNull(),
});

export const postTags = pgTable(
    "post_tags",
    {
        postId: integer("post_id")
            .notNull()
            .references(() => posts.id)
            .references(() => posts.id, { onDelete: "cascade" }),
        tagId: integer("tag_id")
            .notNull()
            .references(() => tags.id)
            .references(() => tags.id, { onDelete: "cascade" }),
    },
    (table) => [primaryKey({ columns: [table.tagId, table.postId], name: "post_tags_pkey" })],
);

export const posts = pgTable(
    "posts",
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity(),
        content: jsonb().$type<TipTapContent | DraftJsContent | string>().notNull(),
        authorId: integer("author_id")
            .notNull()
            .references(() => users.id)
            .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
        createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        deletedAt: timestamp("deleted_at", { mode: "string", withTimezone: true }),
        isEdited: boolean("is_edited").default(false),
        parentId: integer("parent_id"),
        title: text(),
        images: jsonb().$type<ImageMetadata[]>().notNull().default([]),
        isImported: boolean("is_imported").default(false),
        importedAuthorName: text("imported_author_name"),
        importedDate: text("imported_date"),
        importedAvatarUrl: text("imported_avatar_url"),
    },
    (table) => [
        foreignKey({
            columns: [table.parentId],
            foreignColumns: [table.id],
            name: "forum_messages_parent_id_fkey",
        }),
        index("forum_messages_authorid_idx").using("btree", table.authorId.asc().nullsLast()),
        index("forum_messages_id_authorid_idx").using(
            "btree",
            table.id.asc().nullsLast(),
            table.authorId.asc().nullsLast(),
        ),
        index("idx_parent_id").using("btree", table.parentId.asc().nullsLast()),
        check("no_self_reference", sql`(parent_id <> id)`),
        check("thread_starter_has_title", sql`((parent_id IS NOT NULL) OR (title IS NOT NULL))`),
    ],
);

export const privateMessages = pgTable(
    "private_messages",
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity(),
        conversationId: integer("conversation_id")
            .notNull()
            .references(() => conversations.id, { onDelete: "cascade" }),
        senderId: integer("sender_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        content: jsonb().$type<TipTapContent | DraftJsContent>().notNull(),
        createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        images: jsonb().$type<ImageMetadata[]>().notNull().default([]),
    },
    (table) => [
        index("direct_messages_sender_id_idx").using("btree", table.senderId.asc().nullsLast()),
        index("idx_direct_messages_created_at").using("btree", table.createdAt.asc().nullsLast()),
    ],
);

export const tags = pgTable(
    "tags",
    {
        id: serial().primaryKey(),
        name: text().notNull(),
        description: text(),
    },
    (table) => [unique("tags_name_key").on(table.name)],
);

export const tcupUpdates = pgTable("tcup_updates", {
    id: serial().primaryKey(),
    archived: boolean().default(false).notNull(),
    sort: integer(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }),
    title: varchar({ length: 255 }),
    content: json(),
    image: uuid().references(() => directusFiles.id, { onDelete: "set null" }),
    publishDate: timestamp("publish_date").default(new Date("2026-07-23T13:41:41.116873Z")),
});

export const themes = pgTable("themes", {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }),
    slug: varchar({ length: 255 }),
    foreground: varchar({ length: 255 }).default(sql`NULL`).notNull(),
    background: varchar({ length: 255 }),
});

export const threadReadStatus = pgTable(
    "thread_read_status",
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity(),
        userId: integer("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        threadId: integer("thread_id")
            .notNull()
            .references(() => posts.id, { onDelete: "cascade" }),
        lastReadAt: timestamp("last_read_at", { withTimezone: true, mode: "string" })
            .default(sql`timezone('utc'::text, now())`)
            .notNull(),
    },
    (table) => [
        index("idx_thread_read_status_thread_id").using("btree", table.threadId.asc().nullsLast()),
        index("idx_thread_read_status_user_id").using("btree", table.userId.asc().nullsLast()),
        unique("thread_read_status_user_id_thread_id_key").on(table.userId, table.threadId),
    ],
);

export const users = pgTable(
    "users",
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity(),
        email: text().notNull(),
        username: varchar({ length: 255 }).notNull(),
        avatarUrl: text("avatar_url"),
        auth0Id: varchar("auth0_id", { length: 255 }).notNull(),
        bio: text(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).default(
            sql`CURRENT_TIMESTAMP`,
        ),
        role: userRole().default("user").notNull(),
        tagline: text(),
    },
    (table) => [
        index("users_id_auth0id_idx").using(
            "btree",
            table.id.asc().nullsLast(),
            table.auth0Id.asc().nullsLast(),
        ),
        index("users_username_idx").using("btree", table.username.asc().nullsLast()),
        unique("users_auth0_id_key").on(table.auth0Id),
    ],
);
export const postsWithReplies = pgView("posts_with_replies", {
    id: integer(),
    content: jsonb().$type<TipTapContent | DraftJsContent>(),
    authorId: integer("author_id"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
    isEdited: boolean("is_edited"),
    parentId: integer("parent_id"),
    title: text(),
    images: jsonb().$type<ImageMetadata[]>().notNull().default([]),
    isImported: boolean("is_imported"),
    importedAuthorName: text("imported_author_name"),
    importedDate: text("imported_date"),
    importedAvatarUrl: text("imported_avatar_url"),
    authorAvatar: text("author_avatar"),
    authorName: varchar("author_name", { length: 255 }),
    tags: json(),
    latestReplyDate: timestamp("latest_reply_date"),
    latestReplyAuthor: varchar("latest_reply_author", { length: 255 }),
    latestReplyAuthorId: integer("latest_reply_author_id"),
    latestReplyAuthorAvatar: text("latest_reply_author_avatar"),
    replyCount: bigint({ mode: "number" }),
}).as(
    sql`SELECT threads.id, threads.content, threads.author_id, threads.created_at, threads.updated_at, threads.deleted_at, threads.is_edited, threads.parent_id, threads.title, threads.images, threads.is_imported, threads.imported_author_name, threads.imported_date, threads.imported_avatar_url, thread_authors.avatar_url AS author_avatar, thread_authors.username AS author_name, COALESCE(thread_tags.tags, '[]'::json) AS tags, replies.latest_reply_date, replies.latest_reply_author, replies.latest_reply_author_id, replies.latest_reply_author_avatar, replies_count.reply_count AS "replyCount" FROM posts threads LEFT JOIN users thread_authors ON threads.author_id = thread_authors.id LEFT JOIN ( SELECT pt.post_id, json_agg(json_build_object('id', t.id, 'name', t.name, 'description', t.description)) AS tags FROM post_tags pt JOIN tags t ON pt.tag_id = t.id GROUP BY pt.post_id) thread_tags ON thread_tags.post_id = threads.id LEFT JOIN ( SELECT DISTINCT ON (m.parent_id) m.parent_id, m.author_id AS latest_reply_author_id, u.username AS latest_reply_author, u.avatar_url AS latest_reply_author_avatar, m.created_at AS latest_reply_date FROM posts m LEFT JOIN users u ON u.id = m.author_id WHERE m.parent_id IS NOT NULL ORDER BY m.parent_id, m.created_at DESC) replies ON replies.parent_id = threads.id LEFT JOIN ( SELECT posts.parent_id, count(*) AS reply_count FROM posts WHERE posts.parent_id IS NOT NULL GROUP BY posts.parent_id) replies_count ON replies_count.parent_id = threads.id WHERE threads.parent_id IS NULL ORDER BY (COALESCE(replies.latest_reply_date, threads.created_at)) DESC`,
);
