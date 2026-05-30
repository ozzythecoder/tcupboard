import type { TablesInsert, Tables, TablesUpdate } from "./models";

export type Tag = Tables<'tags'>

export type ThreadReadStatus = Tables<'thread_read_status'>

export type ForumMessage = Tables<'forum_messages'>
export type ForumMessageWithReplyDetails = Tables<'forum_messages_with_last_reply'>
