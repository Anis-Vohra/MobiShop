export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string | null
          email: string | null
          address: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone?: string | null
          email?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          customer_id: string
          year: string | null
          make: string
          model: string
          vin: string | null
          license_plate: string | null
          color: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          year?: string | null
          make: string
          model: string
          vin?: string | null
          license_plate?: string | null
          color?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          year?: string | null
          make?: string
          model?: string
          vin?: string | null
          license_plate?: string | null
          color?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string | null
          customer_id: string
          service: string
          description: string | null
          date: string
          time: string
          duration: number
          address: string | null
          status: string
          notes: string | null
          reminder_email: boolean
          reminder_sms: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id?: string | null
          customer_id: string
          service: string
          description?: string | null
          date: string
          time: string
          duration?: number
          address?: string | null
          status?: string
          notes?: string | null
          reminder_email?: boolean
          reminder_sms?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string | null
          customer_id?: string
          service?: string
          description?: string | null
          date?: string
          time?: string
          duration?: number
          address?: string | null
          status?: string
          notes?: string | null
          reminder_email?: boolean
          reminder_sms?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          user_id: string
          appointment_id: string | null
          customer_id: string
          vehicle_id: string | null
          service: string
          description: string | null
          status: string
          notes: string | null
          technician: string | null
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          appointment_id?: string | null
          customer_id: string
          vehicle_id?: string | null
          service: string
          description?: string | null
          status?: string
          notes?: string | null
          technician?: string | null
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          appointment_id?: string | null
          customer_id?: string
          vehicle_id?: string | null
          service?: string
          description?: string | null
          status?: string
          notes?: string | null
          technician?: string | null
          images?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      estimates: {
        Row: {
          id: string
          job_id: string
          line_items: Json
          subtotal: number
          tax: number
          total: number
          approved: boolean
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          line_items: Json
          subtotal: number
          tax: number
          total: number
          approved?: boolean
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          line_items?: Json
          subtotal?: number
          tax?: number
          total?: number
          approved?: boolean
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          job_id: string
          line_items: Json
          subtotal: number
          tax: number
          total: number
          payment_status: string
          payment_method: string | null
          paid_at: string | null
          stripe_checkout_id: string | null
          stripe_payment_intent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          line_items: Json
          subtotal: number
          tax: number
          total: number
          payment_status?: string
          payment_method?: string | null
          paid_at?: string | null
          stripe_checkout_id?: string | null
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          line_items?: Json
          subtotal?: number
          tax?: number
          total?: number
          payment_status?: string
          payment_method?: string | null
          paid_at?: string | null
          stripe_checkout_id?: string | null
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
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
