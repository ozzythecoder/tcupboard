import { defineRelations } from "drizzle-orm";
import * as schema from "./schema.js";

export const relations = defineRelations(schema, (r) => ({
	blockRichtext: {
		themeRelation: r.one.themes({
			from: r.blockRichtext.theme,
			to: r.themes.id
		}),
	},
	themes: {
		blockRichtexts: r.many.blockRichtext(),
		campaigns: r.many.campaigns(),
	},
	campaigns: {
		callsToAction: r.one.callsToAction({
			from: r.campaigns.callToAction,
			to: r.callsToAction.id
		}),
		directusFile: r.one.directusFiles({
			from: r.campaigns.image,
			to: r.directusFiles.id
		}),
		themeRelation: r.one.themes({
			from: r.campaigns.theme,
			to: r.themes.id
		}),
		campaignsBlocks: r.many.campaignsBlocks(),
		campaignsContentBlocks: r.many.campaignsContentBlocks(),
		globalCampaignHighlights: r.many.globalCampaignHighlight(),
	},
	callsToAction: {
		campaigns: r.many.campaigns(),
	},
	directusFiles: {
		campaigns: r.many.campaigns(),
		directusFolder: r.one.directusFolders({
			from: r.directusFiles.folder,
			to: r.directusFolders.id
		}),
		directusUserModifiedBy: r.one.directusUsers({
			from: r.directusFiles.modifiedBy,
			to: r.directusUsers.id,
			alias: "directusFiles_modifiedBy_directusUsers_id"
		}),
		directusUserUploadedBy: r.one.directusUsers({
			from: r.directusFiles.uploadedBy,
			to: r.directusUsers.id,
			alias: "directusFiles_uploadedBy_directusUsers_id"
		}),
		directusSettingsProjectLogo: r.many.directusSettings({
			alias: "directusSettings_projectLogo_directusFiles_id"
		}),
		directusSettingsPublicBackground: r.many.directusSettings({
			alias: "directusSettings_publicBackground_directusFiles_id"
		}),
		directusSettingsPublicFavicon: r.many.directusSettings({
			alias: "directusSettings_publicFavicon_directusFiles_id"
		}),
		directusSettingsPublicForeground: r.many.directusSettings({
			alias: "directusSettings_publicForeground_directusFiles_id"
		}),
		tcupUpdates: r.many.tcupUpdates(),
	},
	campaignsBlocks: {
		campaign: r.one.campaigns({
			from: r.campaignsBlocks.campaignsId,
			to: r.campaigns.id
		}),
	},
	campaignsContentBlocks: {
		campaign: r.one.campaigns({
			from: r.campaignsContentBlocks.campaignsId,
			to: r.campaigns.id
		}),
	},
	conversations: {
		usersViaConversationParticipants: r.many.users({
			from: r.conversations.id.through(r.conversationParticipants.conversationId),
			to: r.users.id.through(r.conversationParticipants.userId),
			alias: "conversations_id_users_id_via_conversationParticipants"
		}),
		usersViaPrivateMessages: r.many.users({
			from: r.conversations.id.through(r.privateMessages.conversationId),
			to: r.users.id.through(r.privateMessages.senderId),
			alias: "conversations_id_users_id_via_privateMessages"
		}),
	},
	users: {
		conversationsViaConversationParticipants: r.many.conversations({
			alias: "conversations_id_users_id_via_conversationParticipants"
		}),
		postsViaPostReactions: r.many.posts({
			alias: "posts_id_users_id_via_postReactions"
		}),
		postsAuthorId: r.many.posts({
			alias: "posts_authorId_users_id"
		}),
		conversationsViaPrivateMessages: r.many.conversations({
			alias: "conversations_id_users_id_via_privateMessages"
		}),
		postsViaThreadReadStatus: r.many.posts({
			alias: "posts_id_users_id_via_threadReadStatus"
		}),
	},
	directusAccess: {
		directusPolicy: r.one.directusPolicies({
			from: r.directusAccess.policy,
			to: r.directusPolicies.id
		}),
		directusRole: r.one.directusRoles({
			from: r.directusAccess.role,
			to: r.directusRoles.id
		}),
		directusUser: r.one.directusUsers({
			from: r.directusAccess.user,
			to: r.directusUsers.id
		}),
	},
	directusPolicies: {
		directusAccesses: r.many.directusAccess(),
		directusPermissions: r.many.directusPermissions(),
	},
	directusRoles: {
		directusAccesses: r.many.directusAccess(),
		directusUsersViaDirectusPresets: r.many.directusUsers({
			from: r.directusRoles.id.through(r.directusPresets.role),
			to: r.directusUsers.id.through(r.directusPresets.user),
			alias: "directusRoles_id_directusUsers_id_via_directusPresets"
		}),
		directusRole: r.one.directusRoles({
			from: r.directusRoles.parent,
			to: r.directusRoles.id,
			alias: "directusRoles_parent_directusRoles_id"
		}),
		directusRoles: r.many.directusRoles({
			alias: "directusRoles_parent_directusRoles_id"
		}),
		directusSettings: r.many.directusSettings(),
		directusShares: r.many.directusShares(),
		directusUsersRole: r.many.directusUsers({
			alias: "directusUsers_role_directusRoles_id"
		}),
	},
	directusUsers: {
		directusAccesses: r.many.directusAccess(),
		directusDashboardsUserCreated: r.many.directusDashboards({
			alias: "directusDashboards_userCreated_directusUsers_id"
		}),
		directusDeploymentsViaDirectusDeploymentProjects: r.many.directusDeployments({
			alias: "directusDeployments_id_directusUsers_id_via_directusDeploymentProjects"
		}),
		directusDeploymentProjects: r.many.directusDeploymentProjects(),
		directusDeploymentsUserCreated: r.many.directusDeployments({
			alias: "directusDeployments_userCreated_directusUsers_id"
		}),
		directusFilesModifiedBy: r.many.directusFiles({
			alias: "directusFiles_modifiedBy_directusUsers_id"
		}),
		directusFilesUploadedBy: r.many.directusFiles({
			alias: "directusFiles_uploadedBy_directusUsers_id"
		}),
		directusFlows: r.many.directusFlows(),
		directusOauthClientsViaDirectusOauthCodes: r.many.directusOauthClients({
			alias: "directusOauthClients_clientId_directusUsers_id_via_directusOauthCodes"
		}),
		directusOauthClientsViaDirectusOauthConsents: r.many.directusOauthClients({
			alias: "directusOauthClients_clientId_directusUsers_id_via_directusOauthConsents"
		}),
		directusOauthClientsViaDirectusOauthTokens: r.many.directusOauthClients({
			alias: "directusOauthClients_clientId_directusUsers_id_via_directusOauthTokens"
		}),
		directusOperations: r.many.directusOperations(),
		directusDashboardsViaDirectusPanels: r.many.directusDashboards({
			alias: "directusDashboards_id_directusUsers_id_via_directusPanels"
		}),
		directusRoles: r.many.directusRoles({
			alias: "directusRoles_id_directusUsers_id_via_directusPresets"
		}),
		directusSessions: r.many.directusSessions(),
		directusShares: r.many.directusShares(),
		directusRole: r.one.directusRoles({
			from: r.directusUsers.role,
			to: r.directusRoles.id,
			alias: "directusUsers_role_directusRoles_id"
		}),
		directusVersionsUserCreated: r.many.directusVersions({
			alias: "directusVersions_userCreated_directusUsers_id"
		}),
		directusVersionsUserUpdated: r.many.directusVersions({
			alias: "directusVersions_userUpdated_directusUsers_id"
		}),
	},
	directusCollections: {
		directusCollection: r.one.directusCollections({
			from: r.directusCollections.group,
			to: r.directusCollections.collection,
			alias: "directusCollections_group_directusCollections_collection"
		}),
		directusCollections: r.many.directusCollections({
			alias: "directusCollections_group_directusCollections_collection"
		}),
		directusShares: r.many.directusShares(),
		directusVersions: r.many.directusVersions(),
	},
	directusDashboards: {
		directusUser: r.one.directusUsers({
			from: r.directusDashboards.userCreated,
			to: r.directusUsers.id,
			alias: "directusDashboards_userCreated_directusUsers_id"
		}),
		directusUsers: r.many.directusUsers({
			from: r.directusDashboards.id.through(r.directusPanels.dashboard),
			to: r.directusUsers.id.through(r.directusPanels.userCreated),
			alias: "directusDashboards_id_directusUsers_id_via_directusPanels"
		}),
	},
	directusDeployments: {
		directusUsers: r.many.directusUsers({
			from: r.directusDeployments.id.through(r.directusDeploymentProjects.deployment),
			to: r.directusUsers.id.through(r.directusDeploymentProjects.userCreated),
			alias: "directusDeployments_id_directusUsers_id_via_directusDeploymentProjects"
		}),
		directusUser: r.one.directusUsers({
			from: r.directusDeployments.userCreated,
			to: r.directusUsers.id,
			alias: "directusDeployments_userCreated_directusUsers_id"
		}),
	},
	directusDeploymentProjects: {
		directusUsers: r.many.directusUsers({
			from: r.directusDeploymentProjects.id.through(r.directusDeploymentRuns.project),
			to: r.directusUsers.id.through(r.directusDeploymentRuns.userCreated)
		}),
	},
	directusFolders: {
		directusFiles: r.many.directusFiles(),
		directusFolder: r.one.directusFolders({
			from: r.directusFolders.parent,
			to: r.directusFolders.id,
			alias: "directusFolders_parent_directusFolders_id"
		}),
		directusFolders: r.many.directusFolders({
			alias: "directusFolders_parent_directusFolders_id"
		}),
		directusSettings: r.many.directusSettings(),
	},
	directusFlows: {
		directusUser: r.one.directusUsers({
			from: r.directusFlows.userCreated,
			to: r.directusUsers.id
		}),
		directusOperations: r.many.directusOperations(),
	},
	directusOauthClients: {
		directusUsersViaDirectusOauthCodes: r.many.directusUsers({
			from: r.directusOauthClients.clientId.through(r.directusOauthCodes.client),
			to: r.directusUsers.id.through(r.directusOauthCodes.user),
			alias: "directusOauthClients_clientId_directusUsers_id_via_directusOauthCodes"
		}),
		directusUsersViaDirectusOauthConsents: r.many.directusUsers({
			from: r.directusOauthClients.clientId.through(r.directusOauthConsents.client),
			to: r.directusUsers.id.through(r.directusOauthConsents.user),
			alias: "directusOauthClients_clientId_directusUsers_id_via_directusOauthConsents"
		}),
		directusUsersViaDirectusOauthTokens: r.many.directusUsers({
			from: r.directusOauthClients.clientId.through(r.directusOauthTokens.client),
			to: r.directusUsers.id.through(r.directusOauthTokens.user),
			alias: "directusOauthClients_clientId_directusUsers_id_via_directusOauthTokens"
		}),
		directusSessions: r.many.directusSessions(),
	},
	directusOperations: {
		directusFlow: r.one.directusFlows({
			from: r.directusOperations.flow,
			to: r.directusFlows.id
		}),
		directusOperationReject: r.one.directusOperations({
			from: r.directusOperations.reject,
			to: r.directusOperations.id,
			alias: "directusOperations_reject_directusOperations_id"
		}),
		directusOperationsReject: r.one.directusOperations({
			alias: "directusOperations_reject_directusOperations_id"
		}),
		directusOperationResolve: r.one.directusOperations({
			from: r.directusOperations.resolve,
			to: r.directusOperations.id,
			alias: "directusOperations_resolve_directusOperations_id"
		}),
		directusOperationsResolve: r.one.directusOperations({
			alias: "directusOperations_resolve_directusOperations_id"
		}),
		directusUser: r.one.directusUsers({
			from: r.directusOperations.userCreated,
			to: r.directusUsers.id
		}),
	},
	directusPermissions: {
		directusPolicy: r.one.directusPolicies({
			from: r.directusPermissions.policy,
			to: r.directusPolicies.id
		}),
	},
	directusRevisions: {
		directusActivity: r.one.directusActivity({
			from: r.directusRevisions.activity,
			to: r.directusActivity.id
		}),
		directusRevision: r.one.directusRevisions({
			from: r.directusRevisions.parent,
			to: r.directusRevisions.id,
			alias: "directusRevisions_parent_directusRevisions_id"
		}),
		directusRevisions: r.many.directusRevisions({
			alias: "directusRevisions_parent_directusRevisions_id"
		}),
		directusVersion: r.one.directusVersions({
			from: r.directusRevisions.version,
			to: r.directusVersions.id
		}),
	},
	directusActivity: {
		directusRevisions: r.many.directusRevisions(),
	},
	directusVersions: {
		directusRevisions: r.many.directusRevisions(),
		directusCollection: r.one.directusCollections({
			from: r.directusVersions.collection,
			to: r.directusCollections.collection
		}),
		directusUserUserCreated: r.one.directusUsers({
			from: r.directusVersions.userCreated,
			to: r.directusUsers.id,
			alias: "directusVersions_userCreated_directusUsers_id"
		}),
		directusUserUserUpdated: r.one.directusUsers({
			from: r.directusVersions.userUpdated,
			to: r.directusUsers.id,
			alias: "directusVersions_userUpdated_directusUsers_id"
		}),
	},
	directusSessions: {
		directusOauthClient: r.one.directusOauthClients({
			from: r.directusSessions.oauthClient,
			to: r.directusOauthClients.clientId
		}),
		directusShare: r.one.directusShares({
			from: r.directusSessions.share,
			to: r.directusShares.id
		}),
		directusUser: r.one.directusUsers({
			from: r.directusSessions.user,
			to: r.directusUsers.id
		}),
	},
	directusShares: {
		directusSessions: r.many.directusSessions(),
		directusCollection: r.one.directusCollections({
			from: r.directusShares.collection,
			to: r.directusCollections.collection
		}),
		directusRole: r.one.directusRoles({
			from: r.directusShares.role,
			to: r.directusRoles.id
		}),
		directusUser: r.one.directusUsers({
			from: r.directusShares.userCreated,
			to: r.directusUsers.id
		}),
	},
	directusSettings: {
		directusFileProjectLogo: r.one.directusFiles({
			from: r.directusSettings.projectLogo,
			to: r.directusFiles.id,
			alias: "directusSettings_projectLogo_directusFiles_id"
		}),
		directusFilePublicBackground: r.one.directusFiles({
			from: r.directusSettings.publicBackground,
			to: r.directusFiles.id,
			alias: "directusSettings_publicBackground_directusFiles_id"
		}),
		directusFilePublicFavicon: r.one.directusFiles({
			from: r.directusSettings.publicFavicon,
			to: r.directusFiles.id,
			alias: "directusSettings_publicFavicon_directusFiles_id"
		}),
		directusFilePublicForeground: r.one.directusFiles({
			from: r.directusSettings.publicForeground,
			to: r.directusFiles.id,
			alias: "directusSettings_publicForeground_directusFiles_id"
		}),
		directusRole: r.one.directusRoles({
			from: r.directusSettings.publicRegistrationRole,
			to: r.directusRoles.id
		}),
		directusFolder: r.one.directusFolders({
			from: r.directusSettings.storageDefaultFolder,
			to: r.directusFolders.id
		}),
	},
	globalCampaignHighlight: {
		campaignRelation: r.one.campaigns({
			from: r.globalCampaignHighlight.campaign,
			to: r.campaigns.id
		}),
	},
	posts: {
		usersViaPostReactions: r.many.users({
			from: r.posts.id.through(r.postReactions.postId),
			to: r.users.id.through(r.postReactions.userId),
			alias: "posts_id_users_id_via_postReactions"
		}),
		postTagsPostId: r.many.postTags({
			alias: "postTags_postId_posts_id"
		}),
		post: r.one.posts({
			from: r.posts.parentId,
			to: r.posts.id,
			alias: "posts_parentId_posts_id"
		}),
		posts: r.many.posts({
			alias: "posts_parentId_posts_id"
		}),
		userAuthorId: r.one.users({
			from: r.posts.authorId,
			to: r.users.id,
			alias: "posts_authorId_users_id"
		}),
		usersViaThreadReadStatus: r.many.users({
			from: r.posts.id.through(r.threadReadStatus.threadId),
			to: r.users.id.through(r.threadReadStatus.userId),
			alias: "posts_id_users_id_via_threadReadStatus"
		}),
	},
	postTags: {
		postPostId: r.one.posts({
			from: r.postTags.postId,
			to: r.posts.id,
			alias: "postTags_postId_posts_id"
		}),
		tagTagId: r.one.tags({
			from: r.postTags.tagId,
			to: r.tags.id,
			alias: "postTags_tagId_tags_id"
		}),
	},
	tags: {
		postTagsTagId: r.many.postTags({
			alias: "postTags_tagId_tags_id"
		}),
	},
	tcupUpdates: {
		directusFile: r.one.directusFiles({
			from: r.tcupUpdates.image,
			to: r.directusFiles.id
		}),
	},
}))