// Base Agent Interface for Ubuntu Initiative Agent Network (UIAN)
// All agents implement this interface for consistency and audit trail

import { createClient } from '@supabase/supabase-js';

export interface AgentConfig {
  id: string;
  name: string;
  version: string;
  autonomyLevel: 'advisory' | 'semi-autonomous' | 'autonomous';
}

export interface AgentInput {
  trigger: string;
  data?: any;
  context?: Record<string, any>;
}

export interface AgentOutput {
  success: boolean;
  data?: any;
  confidence?: number;
  reasoning?: string;
  requiresReview: boolean;
  errors?: string[];
}

export interface AgentAuditEntry {
  agent_id: string;
  action_type: string;
  input_data: any;
  output_data: any;
  confidence_score?: number;
  human_review_status: 'not_required' | 'pending' | 'approved' | 'rejected';
  reasoning?: string;
}

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected supabase: ReturnType<typeof createClient>;

  constructor(config: AgentConfig) {
    this.config = config;
    
    // Initialize Supabase client with service role for agent operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  // Abstract methods that each agent must implement
  abstract execute(input: AgentInput): Promise<AgentOutput>;

  // Audit logging (called automatically after every agent action)
  protected async logAudit(entry: Omit<AgentAuditEntry, 'agent_id'>): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('agent_audit_log')
        .insert({
          agent_id: this.config.id,
          ...entry,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error(`[${this.config.id}] Audit log failed:`, error);
      }
    } catch (err) {
      console.error(`[${this.config.id}] Audit log exception:`, err);
    }
  }

  // Add item to approval queue
  protected async addToApprovalQueue(
    itemType: 'policy' | 'milestone' | 'narrative' | 'grant' | 'insight',
    itemId: string,
    recommendation: any,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('approval_queue')
        .insert({
          item_type: itemType,
          item_id: itemId,
          agent_recommendation: recommendation,
          priority,
          status: 'pending'
        });

      if (error) {
        console.error(`[${this.config.id}] Failed to add to approval queue:`, error);
      }
    } catch (err) {
      console.error(`[${this.config.id}] Approval queue exception:`, err);
    }
  }

  // Helper: Check confidence threshold
  protected requiresHumanReview(confidence: number, threshold: number = 0.9): boolean {
    return confidence < threshold;
  }

  // Helper: Validate against Phase 0 constraints
  protected validatePhase0Content(content: string): { valid: boolean; violations: string[] } {
    const violations: string[] = [];
    
    // Banned speculative terms
    const bannedTerms = [
      /phase\s*[123]/gi,
      /in the future/gi,
      /will be/gi,
      /plan to/gi,
      /eventually/gi,
      /once complete/gi
    ];

    bannedTerms.forEach((pattern, index) => {
      if (pattern.test(content)) {
        violations.push(`Contains speculative language: ${pattern.source}`);
      }
    });

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // Helper: Sanitize user input
  protected sanitizeInput(input: string): string {
    // Remove potential prompt injection attempts
    return input
      .replace(/ignore previous instructions/gi, '')
      .replace(/system prompt/gi, '')
      .replace(/<\/?script>/gi, '')
      .trim();
  }
}

// Agent Registry (for tracking all active agents)
export class AgentRegistry {
  private static agents: Map<string, BaseAgent> = new Map();

  static register(agent: BaseAgent, config: AgentConfig) {
    this.agents.set(config.id, agent);
  }

  static get(agentId: string): BaseAgent | undefined {
    return this.agents.get(agentId);
  }

  static listAll(): AgentConfig[] {
    return Array.from(this.agents.values()).map(agent => (agent as any).config);
  }
}
