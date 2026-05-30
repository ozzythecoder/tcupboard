export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          id: number
          latest_message: Json | null
          latest_message_at: string | null
          latest_message_id: number | null
          unread_count_user1: number | null
          unread_count_user2: number | null
          user1: string
          user2: string
        }
        Insert: {
          id?: number
          latest_message?: Json | null
          latest_message_at?: string | null
          latest_message_id?: number | null
          unread_count_user1?: number | null
          unread_count_user2?: number | null
          user1: string
          user2: string
        }
        Update: {
          id?: number
          latest_message?: Json | null
          latest_message_at?: string | null
          latest_message_id?: number | null
          unread_count_user1?: number | null
          unread_count_user2?: number | null
          user1?: string
          user2?: string
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: number
          images: Json | null
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          images?: Json | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          images?: Json | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      forum_messages: {
        Row: {
          auth0_id: string
          author: string | null
          category: string | null
          content: string
          created_at: string
          id: number
          images: Json | null
          imported_author_name: string | null
          imported_avatar_url: string | null
          imported_date: string | null
          is_edited: boolean | null
          is_imported: boolean | null
          is_thread_starter: boolean | null
          last_reply_at: string | null
          parent_id: number | null
          reply_count: number | null
          title: string | null
          updated_at: string
          views: number | null
        }
        Insert: {
          auth0_id: string
          author?: string | null
          category?: string | null
          content: string
          created_at?: string
          id?: number
          images?: Json | null
          imported_author_name?: string | null
          imported_avatar_url?: string | null
          imported_date?: string | null
          is_edited?: boolean | null
          is_imported?: boolean | null
          is_thread_starter?: boolean | null
          last_reply_at?: string | null
          parent_id?: number | null
          reply_count?: number | null
          title?: string | null
          updated_at?: string
          views?: number | null
        }
        Update: {
          auth0_id?: string
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string
          id?: number
          images?: Json | null
          imported_author_name?: string | null
          imported_avatar_url?: string | null
          imported_date?: string | null
          is_edited?: boolean | null
          is_imported?: boolean | null
          is_thread_starter?: boolean | null
          last_reply_at?: string | null
          parent_id?: number | null
          reply_count?: number | null
          title?: string | null
          updated_at?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "forum_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "forum_messages_with_last_reply"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "thread_activity_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "thread_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          author_name: string
          channel: string
          created_at: string
          id: number
          text: string
          text_search: unknown
          user_id: string
        }
        Insert: {
          author_name: string
          channel: string
          created_at?: string
          id?: number
          text: string
          text_search?: unknown
          user_id: string
        }
        Update: {
          author_name?: string
          channel?: string
          created_at?: string
          id?: number
          text?: string
          text_search?: unknown
          user_id?: string
        }
        Relationships: []
      }
      post_tags: {
        Row: {
          post_id: number
          tag_id: number
        }
        Insert: {
          post_id: number
          tag_id: number
        }
        Update: {
          post_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_messages_with_last_reply"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "thread_activity_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "thread_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      test_messages: {
        Row: {
          author: string | null
          content: string
          created_at: string
          id: number
          user_id: string | null
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Relationships: []
      }
      thread_read_status: {
        Row: {
          auth0_id: string
          id: number
          last_read_at: string
          thread_id: number
        }
        Insert: {
          auth0_id: string
          id?: number
          last_read_at?: string
          thread_id: number
        }
        Update: {
          auth0_id?: string
          id?: number
          last_read_at?: string
          thread_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "thread_read_status_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_read_status_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_messages_with_last_reply"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_read_status_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "thread_activity_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_read_status_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "thread_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reactions: {
        Row: {
          created_at: string
          id: number
          post_id: number | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          post_id?: number | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_messages_with_last_reply"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "thread_activity_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "thread_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth0_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          id: number
          role: string | null
          tagline: string | null
          username: string | null
        }
        Insert: {
          auth0_id: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          role?: string | null
          tagline?: string | null
          username?: string | null
        }
        Update: {
          auth0_id?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          role?: string | null
          tagline?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      forum_messages_with_last_reply: {
        Row: {
          auth0_id: string | null
          author: string | null
          author_avatar: string | null
          category: string | null
          content: string | null
          created_at: string | null
          id: number | null
          images: Json | null
          imported_author_name: string | null
          imported_avatar_url: string | null
          imported_date: string | null
          is_edited: boolean | null
          is_imported: boolean | null
          is_thread_starter: boolean | null
          last_reply_at: string | null
          latest_reply_author: string | null
          latest_reply_author_avatar: string | null
          latest_reply_author_id: string | null
          latest_reply_date: string | null
          parent_id: number | null
          reply_count: number | null
          replyCount: number | null
          tags: Json | null
          title: string | null
          updated_at: string | null
          views: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "forum_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "forum_messages_with_last_reply"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "thread_activity_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "thread_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          count: number | null
          post_id: number | null
          type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_messages_with_last_reply"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "thread_activity_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "thread_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_activity_view: {
        Row: {
          auth0_id: string | null
          author: string | null
          category: string | null
          content: string | null
          created_at: string | null
          id: number | null
          images: Json | null
          is_edited: boolean | null
          is_thread_starter: boolean | null
          last_reply_at: string | null
          latest_activity_at: string | null
          parent_id: number | null
          reply_count: number | null
          title: string | null
          updated_at: string | null
          views: number | null
        }
        Insert: {
          auth0_id?: string | null
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: number | null
          images?: Json | null
          is_edited?: boolean | null
          is_thread_starter?: boolean | null
          last_reply_at?: string | null
          latest_activity_at?: never
          parent_id?: number | null
          reply_count?: number | null
          title?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          auth0_id?: string | null
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: number | null
          images?: Json | null
          is_edited?: boolean | null
          is_thread_starter?: boolean | null
          last_reply_at?: string | null
          latest_activity_at?: never
          parent_id?: number | null
          reply_count?: number | null
          title?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "forum_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "forum_messages_with_last_reply"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "thread_activity_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "thread_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_listings: {
        Row: {
          auth0_id: string | null
          author: string | null
          category: string | null
          content: string | null
          created_at: string | null
          id: number | null
          images: Json | null
          imported_date: string | null
          is_edited: boolean | null
          is_imported: boolean | null
          is_thread_starter: boolean | null
          last_reply_at: string | null
          latest_activity_at: string | null
          parent_id: number | null
          reply_count: number | null
          title: string | null
          updated_at: string | null
          views: number | null
        }
        Insert: {
          auth0_id?: string | null
          author?: never
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: number | null
          images?: Json | null
          imported_date?: string | null
          is_edited?: boolean | null
          is_imported?: boolean | null
          is_thread_starter?: boolean | null
          last_reply_at?: string | null
          latest_activity_at?: never
          parent_id?: number | null
          reply_count?: number | null
          title?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          auth0_id?: string | null
          author?: never
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: number | null
          images?: Json | null
          imported_date?: string | null
          is_edited?: boolean | null
          is_imported?: boolean | null
          is_thread_starter?: boolean | null
          last_reply_at?: string | null
          latest_activity_at?: never
          parent_id?: number | null
          reply_count?: number | null
          title?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "forum_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "forum_messages_with_last_reply"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "thread_activity_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "thread_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_conversations: {
        Row: {
          latest_message: Json | null
          latest_message_at: string | null
          latest_message_id: number | null
          unread_count_user1: number | null
          unread_count_user2: number | null
          user1: string | null
          user2: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_reply_to_thread: {
        Args: {
          p_auth0_id: string
          p_author: string
          p_content: string
          p_thread_id: number
        }
        Returns: Json
      }
      delete_thread_reactions: {
        Args: { thread_id: number }
        Returns: undefined
      }
      replies_by_thread: {
        Args: { thread_id_in: string }
        Returns: {
          auth0_id: string
          author: string | null
          category: string | null
          content: string
          created_at: string
          id: number
          images: Json | null
          imported_author_name: string | null
          imported_avatar_url: string | null
          imported_date: string | null
          is_edited: boolean | null
          is_imported: boolean | null
          is_thread_starter: boolean | null
          last_reply_at: string | null
          parent_id: number | null
          reply_count: number | null
          title: string | null
          updated_at: string
          views: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "forum_messages"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
