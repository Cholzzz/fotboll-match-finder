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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          client_user_id: string
          created_at: string
          end_time: string
          id: string
          notes: string | null
          service_name: string | null
          staff_user_id: string
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          booking_date: string
          client_user_id: string
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          service_name?: string | null
          staff_user_id: string
          start_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          booking_date?: string
          client_user_id?: string
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          service_name?: string | null
          staff_user_id?: string
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      connections: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      highlights: {
        Row: {
          created_at: string
          description: string | null
          id: string
          position: string | null
          title: string | null
          user_id: string
          video_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          position?: string | null
          title?: string | null
          user_id: string
          video_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          position?: string | null
          title?: string | null
          user_id?: string
          video_url?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      player_performance: {
        Row: {
          created_at: string
          id: string
          test_name: string
          test_type: string
          unit: string
          user_id: string
          value: number
          verified_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          test_name: string
          test_type: string
          unit: string
          user_id: string
          value: number
          verified_by?: string
        }
        Update: {
          created_at?: string
          id?: string
          test_name?: string
          test_type?: string
          unit?: string
          user_id?: string
          value?: number
          verified_by?: string
        }
        Relationships: []
      }
      player_profiles: {
        Row: {
          age: number | null
          bio: string | null
          contract_status: string | null
          created_at: string
          current_club: string | null
          id: string
          position: string | null
          preferred_foot: string | null
          region: string | null
          updated_at: string
          user_id: string
          visibility: string | null
        }
        Insert: {
          age?: number | null
          bio?: string | null
          contract_status?: string | null
          created_at?: string
          current_club?: string | null
          id?: string
          position?: string | null
          preferred_foot?: string | null
          region?: string | null
          updated_at?: string
          user_id: string
          visibility?: string | null
        }
        Update: {
          age?: number | null
          bio?: string | null
          contract_status?: string | null
          created_at?: string
          current_club?: string | null
          id?: string
          position?: string | null
          preferred_foot?: string | null
          region?: string | null
          updated_at?: string
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      player_statistics: {
        Row: {
          assists: number
          created_at: string
          goals: number
          id: string
          matches: number
          minutes_played: number
          red_cards: number
          season: string
          updated_at: string
          user_id: string
          yellow_cards: number
        }
        Insert: {
          assists?: number
          created_at?: string
          goals?: number
          id?: string
          matches?: number
          minutes_played?: number
          red_cards?: number
          season?: string
          updated_at?: string
          user_id: string
          yellow_cards?: number
        }
        Update: {
          assists?: number
          created_at?: string
          goals?: number
          id?: string
          matches?: number
          minutes_played?: number
          red_cards?: number
          season?: string
          updated_at?: string
          user_id?: string
          yellow_cards?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string
          id: string
          location: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name: string
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_players: {
        Row: {
          club_user_id: string
          created_at: string
          id: string
          player_user_id: string
        }
        Insert: {
          club_user_id: string
          created_at?: string
          id?: string
          player_user_id: string
        }
        Update: {
          club_user_id?: string
          created_at?: string
          id?: string
          player_user_id?: string
        }
        Relationships: []
      }
      staff_profiles: {
        Row: {
          available_days: Json | null
          available_hours_end: string | null
          available_hours_start: string | null
          certifications: Json | null
          created_at: string
          experience_years: number | null
          id: string
          package_price: number | null
          package_sessions: number | null
          services: Json | null
          session_duration: number | null
          session_price: number | null
          specialization: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          available_days?: Json | null
          available_hours_end?: string | null
          available_hours_start?: string | null
          certifications?: Json | null
          created_at?: string
          experience_years?: number | null
          id?: string
          package_price?: number | null
          package_sessions?: number | null
          services?: Json | null
          session_duration?: number | null
          session_price?: number | null
          specialization?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          available_days?: Json | null
          available_hours_end?: string | null
          available_hours_start?: string | null
          certifications?: Json | null
          created_at?: string
          experience_years?: number | null
          id?: string
          package_price?: number | null
          package_sessions?: number | null
          services?: Json | null
          session_duration?: number | null
          session_price?: number | null
          specialization?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trial_applications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          player_user_id: string
          status: string
          trial_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          player_user_id: string
          status?: string
          trial_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          player_user_id?: string
          status?: string
          trial_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_applications_trial_id_fkey"
            columns: ["trial_id"]
            isOneToOne: false
            referencedRelation: "trials"
            referencedColumns: ["id"]
          },
        ]
      }
      trials: {
        Row: {
          club_user_id: string
          created_at: string
          description: string | null
          end_time: string
          id: string
          location: string
          max_spots: number
          positions: Json
          start_time: string
          title: string | null
          trial_date: string
          updated_at: string
        }
        Insert: {
          club_user_id: string
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          location: string
          max_spots?: number
          positions?: Json
          start_time: string
          title?: string | null
          trial_date: string
          updated_at?: string
        }
        Update: {
          club_user_id?: string
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          location?: string
          max_spots?: number
          positions?: Json
          start_time?: string
          title?: string | null
          trial_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_player_rankings: {
        Args: { limit_count?: number }
        Returns: {
          age: number
          avatar_url: string
          full_name: string
          player_position: string
          player_user_id: string
          region: string
          view_count: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role:
        | "player"
        | "club"
        | "physiotherapist"
        | "coach"
        | "analyst"
        | "scout"
        | "nutritionist"
        | "mental_coach"
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
    Enums: {
      user_role: [
        "player",
        "club",
        "physiotherapist",
        "coach",
        "analyst",
        "scout",
        "nutritionist",
        "mental_coach",
      ],
    },
  },
} as const
