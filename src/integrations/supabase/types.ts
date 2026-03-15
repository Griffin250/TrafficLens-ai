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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      analyses: {
        Row: {
          annotated_video_path: string | null
          average_speed: number | null
          average_vehicles_per_frame: number | null
          buses: number | null
          cars: number | null
          created_at: string
          detailed_metrics: Json | null
          id: string
          left_turns: number | null
          motorcycles: number | null
          movement_distribution: Json | null
          peak_vehicles: number | null
          processing_time: number | null
          right_turns: number | null
          straight_movements: number | null
          total_frames_processed: number | null
          total_vehicles: number | null
          traffic_density: string | null
          trucks: number | null
          updated_at: string
          vehicle_type_distribution: Json | null
          video_id: string
        }
        Insert: {
          annotated_video_path?: string | null
          average_speed?: number | null
          average_vehicles_per_frame?: number | null
          buses?: number | null
          cars?: number | null
          created_at?: string
          detailed_metrics?: Json | null
          id?: string
          left_turns?: number | null
          motorcycles?: number | null
          movement_distribution?: Json | null
          peak_vehicles?: number | null
          processing_time?: number | null
          right_turns?: number | null
          straight_movements?: number | null
          total_frames_processed?: number | null
          total_vehicles?: number | null
          traffic_density?: string | null
          trucks?: number | null
          updated_at?: string
          vehicle_type_distribution?: Json | null
          video_id: string
        }
        Update: {
          annotated_video_path?: string | null
          average_speed?: number | null
          average_vehicles_per_frame?: number | null
          buses?: number | null
          cars?: number | null
          created_at?: string
          detailed_metrics?: Json | null
          id?: string
          left_turns?: number | null
          motorcycles?: number | null
          movement_distribution?: Json | null
          peak_vehicles?: number | null
          processing_time?: number | null
          right_turns?: number | null
          straight_movements?: number | null
          total_frames_processed?: number | null
          total_vehicles?: number | null
          traffic_density?: string | null
          trucks?: number | null
          updated_at?: string
          vehicle_type_distribution?: Json | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analyses_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: true
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      detections: {
        Row: {
          confidence: number | null
          created_at: string
          extra_metadata: Json | null
          frame_number: number | null
          id: string
          timestamp: number | null
          track_id: string | null
          vehicle_class: string | null
          video_id: string
          x_max: number | null
          x_min: number | null
          y_max: number | null
          y_min: number | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          extra_metadata?: Json | null
          frame_number?: number | null
          id?: string
          timestamp?: number | null
          track_id?: string | null
          vehicle_class?: string | null
          video_id: string
          x_max?: number | null
          x_min?: number | null
          y_max?: number | null
          y_min?: number | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          extra_metadata?: Json | null
          frame_number?: number | null
          id?: string
          timestamp?: number | null
          track_id?: string | null
          vehicle_class?: string | null
          video_id?: string
          x_max?: number | null
          x_min?: number | null
          y_max?: number | null
          y_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "detections_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detections_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      processing_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          progress: number | null
          started_at: string | null
          status: string | null
          updated_at: string
          video_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          progress?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string
          video_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          progress?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "processing_jobs_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: true
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          average_speed: number | null
          created_at: string
          end_frame: number | null
          end_position: Json | null
          id: string
          movement_confidence: number | null
          movement_type: string | null
          start_frame: number | null
          start_position: Json | null
          total_detections: number | null
          track_id: number | null
          trajectory_points: Json | null
          vehicle_class: string | null
          video_id: string
        }
        Insert: {
          average_speed?: number | null
          created_at?: string
          end_frame?: number | null
          end_position?: Json | null
          id?: string
          movement_confidence?: number | null
          movement_type?: string | null
          start_frame?: number | null
          start_position?: Json | null
          total_detections?: number | null
          track_id?: number | null
          trajectory_points?: Json | null
          vehicle_class?: string | null
          video_id: string
        }
        Update: {
          average_speed?: number | null
          created_at?: string
          end_frame?: number | null
          end_position?: Json | null
          id?: string
          movement_confidence?: number | null
          movement_type?: string | null
          start_frame?: number | null
          start_position?: Json | null
          total_detections?: number | null
          track_id?: number | null
          trajectory_points?: Json | null
          vehicle_class?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracks_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          created_at: string
          duration: number | null
          error_message: string | null
          file_path: string | null
          file_size: number | null
          filename: string
          fps: number | null
          id: string
          original_filename: string
          processing_completed_at: string | null
          processing_started_at: string | null
          resolution: string | null
          status: Database["public"]["Enums"]["video_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration?: number | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          filename: string
          fps?: number | null
          id?: string
          original_filename: string
          processing_completed_at?: string | null
          processing_started_at?: string | null
          resolution?: string | null
          status?: Database["public"]["Enums"]["video_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration?: number | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          filename?: string
          fps?: number | null
          id?: string
          original_filename?: string
          processing_completed_at?: string | null
          processing_started_at?: string | null
          resolution?: string | null
          status?: Database["public"]["Enums"]["video_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      video_status: "uploaded" | "processing" | "completed" | "failed"
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
      video_status: ["uploaded", "processing", "completed", "failed"],
    },
  },
} as const
