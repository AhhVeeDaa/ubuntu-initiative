/**
 * Database type definitions
 */

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
          key_contacts: any
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
          metadata: any
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
      agent_audit_log: {
        Row: {
          id: string
          agent_id: string
          action_type: string
          reasoning: string | null
          confidence_score: number | null
          timestamp: string
        }
      }
      approval_queue: {
        Row: {
          id: string
          item_type: string
          item_id: string
          agent_recommendation: any
          priority: string
          status: string
          created_at: string
        }
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
