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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      hotdog_stamps: {
        Row: {
          created_at: string
          hotdog_id: string
          id: string
          last_modified: number
          photo_url: string | null
          rating: number | null
          review: string | null
          timestamp: number
          tried: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          hotdog_id: string
          id?: string
          last_modified: number
          photo_url?: string | null
          rating?: number | null
          review?: string | null
          timestamp: number
          tried?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          hotdog_id?: string
          id?: string
          last_modified?: number
          photo_url?: string | null
          rating?: number | null
          review?: string | null
          timestamp?: number
          tried?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      hotdogs: {
        Row: {
          city: string
          country: string
          created_at: string | null
          description: string
          explore_links: Json | null
          fun_facts: string[] | null
          id: string
          ingredients: Json | null
          instructions: string[] | null
          latitude: number
          longitude: number
          method_and_soul: string | null
          name: string
          needs_sprite_update: boolean | null
          origin_story: string | null
          slug: string
          sprite_height: number | null
          sprite_sheet_version: number | null
          sprite_width: number | null
          sprite_x: number | null
          sprite_y: number | null
        }
        Insert: {
          city: string
          country: string
          created_at?: string | null
          description: string
          explore_links?: Json | null
          fun_facts?: string[] | null
          id?: string
          ingredients?: Json | null
          instructions?: string[] | null
          latitude: number
          longitude: number
          method_and_soul?: string | null
          name: string
          needs_sprite_update?: boolean | null
          origin_story?: string | null
          slug: string
          sprite_height?: number | null
          sprite_sheet_version?: number | null
          sprite_width?: number | null
          sprite_x?: number | null
          sprite_y?: number | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string | null
          description?: string
          explore_links?: Json | null
          fun_facts?: string[] | null
          id?: string
          ingredients?: Json | null
          instructions?: string[] | null
          latitude?: number
          longitude?: number
          method_and_soul?: string | null
          name?: string
          needs_sprite_update?: boolean | null
          origin_story?: string | null
          slug?: string
          sprite_height?: number | null
          sprite_sheet_version?: number | null
          sprite_width?: number | null
          sprite_x?: number | null
          sprite_y?: number | null
        }
        Relationships: []
      }
      revealed_facts: {
        Row: {
          created_at: string
          fact_index: number
          hotdog_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fact_index: number
          hotdog_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fact_index?: number
          hotdog_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      sprite_sheets: {
        Row: {
          created_at: string | null
          grid_size: number
          hotdogs_count: number
          id: string
          image_data: string
          name: string
          sheet_size: number
          sprite_size: number
          updated_at: string | null
          version: number
        }
        Insert: {
          created_at?: string | null
          grid_size: number
          hotdogs_count: number
          id?: string
          image_data: string
          name: string
          sheet_size: number
          sprite_size: number
          updated_at?: string | null
          version: number
        }
        Update: {
          created_at?: string | null
          grid_size?: number
          hotdogs_count?: number
          id?: string
          image_data?: string
          name?: string
          sheet_size?: number
          sprite_size?: number
          updated_at?: string | null
          version?: number
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          display_name: string
          email: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name: string
          email?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_display_name: { Args: never; Returns: string }
      get_leaderboard_data: {
        Args: never
        Returns: {
          display_name: string
          first_stamp_time: number
          stamp_count: number
          user_id: string
        }[]
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
