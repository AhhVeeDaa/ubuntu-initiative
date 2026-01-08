/**
 * Database type definitions
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
          key_contacts: Json
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
          metadata: Json
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
      agent_runs: {
        Row: {
          id: string
          agent_id: string
          agent_version: string
          trigger_type: string | null
          trigger_by: string | null
          status: string
          items_found: number
          items_processed: number
          items_written: number
          error_count: number
          error_details: Json
          started_at: string
          completed_at: string | null
          duration_ms: number | null
          config_snapshot: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['agent_runs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['agent_runs']['Insert']>
      }
      policy_updates: {
        Row: {
          id: string
          agent_run_id: string | null
          headline: string
          summary: string
          full_text: string | null
          source_url: string
          source_name: string
          jurisdiction: string
          policy_category: string
          relevance_score: number
          confidence_score: number
          risk_flag: boolean | null
          risk_notes: string | null
          publication_date: string
          detection_date: string | null
          status: string
          approved_at: string | null
          approved_by: string | null
          rejection_reason: string | null
          revision_of: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['policy_updates']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['policy_updates']['Insert']>
      }
      agent_audit_log: {
        Row: {
          id: string
          agent_run_id: string | null
          agent_id: string
          action_type: string
          action_description: string
          input_data: Json
          output_data: Json
          confidence_score: number | null
          reasoning: string | null
          human_review_required: boolean | null
          human_review_status: string | null
          reviewed_by: string | null
          review_notes: string | null
          timestamp: string
        }
        Insert: Omit<Database['public']['Tables']['agent_audit_log']['Row'], 'id' | 'timestamp'>
        Update: Partial<Database['public']['Tables']['agent_audit_log']['Insert']>
      }
      approval_queue: {
        Row: {
          id: string
          item_type: string
          item_id: string
          agent_recommendation: Json
          priority: string
          priority_reason: string | null
          auto_expire_at: string | null
          assigned_to: string | null
          assigned_at: string | null
          status: string
          reviewed_at: string | null
          review_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['approval_queue']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['approval_queue']['Insert']>
      }
      policy_corrections: {
        Row: {
          id: string
          policy_update_id: string
          correction_text: string
          submitter_email: string | null
          status: string
          reviewed_by: string | null
          review_notes: string | null
          created_at: string
          reviewed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['policy_corrections']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['policy_corrections']['Insert']>
      }
      milestone_events: {
        Row: {
          id: string
          category: string
          status: string
          title: string | null
          description: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['milestone_events']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['milestone_events']['Insert']>
      }
    }
  }
}
