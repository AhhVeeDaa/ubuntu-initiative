export type Database = {
    public: {
        Tables: {
            admin_roles: {
                Row: {
                    id: string
                    user_id: string
                    role: 'super_admin' | 'operations_admin' | 'finance_admin' | 'viewer'
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    role: 'super_admin' | 'operations_admin' | 'finance_admin' | 'viewer'
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    role?: 'super_admin' | 'operations_admin' | 'finance_admin' | 'viewer'
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            admin_activity_log: {
                Row: {
                    id: string
                    action: string
                    status: string
                    details: any | null
                    resource: string | null
                    user_agent: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    action: string
                    status: string
                    details?: any | null
                    resource?: string | null
                    user_agent?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    action?: string
                    status?: string
                    details?: any | null
                    resource?: string | null
                    user_agent?: string | null
                    created_at?: string
                }
            }
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
            }
        }
    }
}
