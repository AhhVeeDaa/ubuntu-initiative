// Supabase Client Configuration
// This provides typed access to your Ubuntu Initiative database

import { createClient } from '@supabase/supabase-js'

// Database type definitions based on schema.sql
export type Database = {
  public: {
    Tables: {
      milestones: {
        Row: {
          id: string
          title: string
          description: string | null
          phase: string
          category: string
          status: string
          progress: number
          owner: string | null
          deadline: string | null
          completed_at: string | null
          blockers: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['milestones']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['milestones']['Insert']>
      }
      partners: {
        Row: {
          id: string
          name: string
          category: string
          status: string
          country: string | null
          website: string | null
          description: string | null
          key_contacts: Record<string, unknown>[] | null
          interest_level: string | null
          next_action: string | null
          next_action_date: string | null
          notes: string[] | null
          documents: string[] | null
          created_at: string
          updated_at: string
        }
      }
      activities: {
        Row: {
          id: string
          type: string
          action: string
          entity_id: string | null
          entity_type: string | null
          title: string
          description: string | null
          actor: string
          metadata: Record<string, unknown> | null
          public: boolean
          created_at: string
        }
      }
      metrics: {
        Row: {
          id: string
          metric_name: string
          metric_value: number
          metric_unit: string | null
          category: string | null
          date: string
          notes: string | null
          created_at: string
        }
      }
    }
  }
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase credentials not found. Add to .env.local')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to check connection
export async function testConnection() {
  try {
    const { error } = await supabase.from('milestones').select('count')
    if (error) throw error
    return { success: true, message: 'Connected to Supabase' }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown connection error'
    return { success: false, message: 'Failed to connect', error: errorMessage }
  }
}
