export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          gst_number: string | null
          id: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          cgst_amount: number | null
          created_at: string
          discount_amount: number | null
          gst_rate: number | null
          id: string
          invoice_id: string
          item_id: string
          item_type: string
          name: string
          quantity: number
          sac_hsn_code: string | null
          sgst_amount: number | null
          total_amount: number
          unit_price: number
        }
        Insert: {
          cgst_amount?: number | null
          created_at?: string
          discount_amount?: number | null
          gst_rate?: number | null
          id?: string
          invoice_id: string
          item_id: string
          item_type: string
          name: string
          quantity?: number
          sac_hsn_code?: string | null
          sgst_amount?: number | null
          total_amount?: number
          unit_price?: number
        }
        Update: {
          cgst_amount?: number | null
          created_at?: string
          discount_amount?: number | null
          gst_rate?: number | null
          id?: string
          invoice_id?: string
          item_id?: string
          item_type?: string
          name?: string
          quantity?: number
          sac_hsn_code?: string | null
          sgst_amount?: number | null
          total_amount?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          cgst_amount: number | null
          created_at: string
          customer_id: string
          discount_amount: number | null
          discount_percentage: number | null
          due_date: string | null
          extra_charges: Json | null
          id: string
          invoice_number: string
          invoice_type: string
          kilometers: number | null
          labor_charges: number | null
          notes: string | null
          paid_at: string | null
          sgst_amount: number | null
          status: string
          subtotal: number
          total: number
          total_gst_amount: number | null
          vehicle_id: string
        }
        Insert: {
          cgst_amount?: number | null
          created_at?: string
          customer_id: string
          discount_amount?: number | null
          discount_percentage?: number | null
          due_date?: string | null
          extra_charges?: Json | null
          id?: string
          invoice_number: string
          invoice_type: string
          kilometers?: number | null
          labor_charges?: number | null
          notes?: string | null
          paid_at?: string | null
          sgst_amount?: number | null
          status?: string
          subtotal?: number
          total?: number
          total_gst_amount?: number | null
          vehicle_id: string
        }
        Update: {
          cgst_amount?: number | null
          created_at?: string
          customer_id?: string
          discount_amount?: number | null
          discount_percentage?: number | null
          due_date?: string | null
          extra_charges?: Json | null
          id?: string
          invoice_number?: string
          invoice_type?: string
          kilometers?: number | null
          labor_charges?: number | null
          notes?: string | null
          paid_at?: string | null
          sgst_amount?: number | null
          status?: string
          subtotal?: number
          total?: number
          total_gst_amount?: number | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      parts: {
        Row: {
          category: string | null
          created_at: string
          gst_rate: number
          hsn_code: string | null
          id: string
          is_active: boolean
          min_stock_level: number | null
          name: string
          price: number
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          gst_rate?: number
          hsn_code?: string | null
          id?: string
          is_active?: boolean
          min_stock_level?: number | null
          name: string
          price?: number
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          gst_rate?: number
          hsn_code?: string | null
          id?: string
          is_active?: boolean
          min_stock_level?: number | null
          name?: string
          price?: number
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          method: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          method: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          method?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          base_price: number
          category: string | null
          created_at: string
          estimated_time: number | null
          gst_rate: number
          id: string
          is_active: boolean
          name: string
          sac_code: string | null
          updated_at: string
        }
        Insert: {
          base_price?: number
          category?: string | null
          created_at?: string
          estimated_time?: number | null
          gst_rate?: number
          id?: string
          is_active?: boolean
          name: string
          sac_code?: string | null
          updated_at?: string
        }
        Update: {
          base_price?: number
          category?: string | null
          created_at?: string
          estimated_time?: number | null
          gst_rate?: number
          id?: string
          is_active?: boolean
          name?: string
          sac_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          chassis_number: string | null
          color: string | null
          created_at: string
          customer_id: string
          engine_number: string | null
          id: string
          make: string
          model: string
          updated_at: string
          vehicle_number: string
          vehicle_type: string
          year: number | null
        }
        Insert: {
          chassis_number?: string | null
          color?: string | null
          created_at?: string
          customer_id: string
          engine_number?: string | null
          id?: string
          make: string
          model: string
          updated_at?: string
          vehicle_number: string
          vehicle_type?: string
          year?: number | null
        }
        Update: {
          chassis_number?: string | null
          color?: string | null
          created_at?: string
          customer_id?: string
          engine_number?: string | null
          id?: string
          make?: string
          model?: string
          updated_at?: string
          vehicle_number?: string
          vehicle_type?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
