/**
 * Agent Factory
 * Central registry for all agent instances
 * Handles instantiation, validation, and execution
 */

import { createClient } from '@supabase/supabase-js';

// Import agent classes
// Note: Adjust paths based on your monorepo structure
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Agent interface for type safety
interface Agent {
  execute(input: AgentInput): Promise<AgentOutput>;
}

interface AgentInput {
  trigger: string;
  data?: any;
  context?: Record<string, any>;
}

interface AgentOutput {
  success: boolean;
  data?: any;
  confidence?: number;
  requiresReview?: boolean;
  reasoning?: string;
  errors?: string[];
}

// Agent registry with configuration
interface AgentConfig {
  id: string;
  name: string;
  className: string;
  requiredEnvVars: string[];
  enabled: boolean;
  autonomyLevel: 'semi-autonomous' | 'autonomous';
}

const AGENT_REGISTRY: Record<string, AgentConfig> = {
  'agent_001_policy': {
    id: 'agent_001_policy',
    name: 'Policy Monitor',
    className: 'PolicyAgent',
    requiredEnvVars: ['GOOGLE_AI_API_KEY', 'NEXT_PUBLIC_SUPABASE_URL'],
    enabled: true,
    autonomyLevel: 'semi-autonomous'
  },
  'agent_002_funding': {
    id: 'agent_002_funding',
    name: 'Funding & Grants',
    className: 'FundingGrantAgent',
    requiredEnvVars: ['STRIPE_SECRET_KEY', 'NEXT_PUBLIC_SUPABASE_URL'],
    enabled: true,
    autonomyLevel: 'semi-autonomous'
  },
  'agent_004_milestones': {
    id: 'agent_004_milestones',
    name: 'Milestone Tracker',
    className: 'ProgressMilestoneAgent',
    requiredEnvVars: ['NEXT_PUBLIC_SUPABASE_URL'],
    enabled: true,
    autonomyLevel: 'semi-autonomous'
  }
};

/**
 * Validate agent environment
 */
export function validateAgentEnvironment(agentId: string): {
  valid: boolean;
  missing: string[];
} {
  const config = AGENT_REGISTRY[agentId];
  if (!config) {
    return { valid: false, missing: ['Agent not found in registry'] };
  }

  const missing = config.requiredEnvVars.filter(envVar => !process.env[envVar]);

  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Get agent instance
 * Dynamically imports and instantiates agent class
 */
export async function getAgent(agentId: string): Promise<Agent> {
  const config = AGENT_REGISTRY[agentId];

  if (!config) {
    throw new Error(`Unknown agent: ${agentId}`);
  }

  if (!config.enabled) {
    throw new Error(`Agent ${agentId} is disabled`);
  }

  // Validate environment
  const envCheck = validateAgentEnvironment(agentId);
  if (!envCheck.valid) {
    throw new Error(
      `Agent ${agentId} missing required environment variables: ${envCheck.missing.join(', ')}`
    );
  }

  // Dynamic import based on agent type
  // Adjust import paths based on your project structure
  try {
    switch (agentId) {
      case 'agent_002_funding': {
        const { FundingGrantAgent } = await import('../../web/lib/agents/funding-grant-agent');
        return new FundingGrantAgent();
      }

      case 'agent_004_milestones': {
        const { ProgressMilestoneAgent } = await import('../../web/lib/agents/progress-milestone-agent');
        return new ProgressMilestoneAgent();
      }

      case 'agent_001_policy': {
        // Policy agent import would go here when implemented
        throw new Error('Policy agent not yet implemented');
      }

      default:
        throw new Error(`No implementation for agent: ${agentId}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Cannot find module')) {
      throw new Error(`Agent ${agentId} implementation not found. Check import paths.`);
    }
    throw error;
  }
}

/**
 * Execute agent with full lifecycle management
 */
export async function executeAgent(
  agentId: string,
  runId: string,
  trigger: string = 'manual',
  inputData?: any
): Promise<AgentOutput> {
  const startTime = Date.now();

  // Event emitter helper
  const emitEvent = async (
    type: string,
    message: string,
    severity: 'debug' | 'info' | 'warning' | 'error' | 'critical' = 'info',
    data?: any
  ) => {
    await supabase.from('agent_events').insert({
      run_id: runId,
      agent_id: agentId,
      event_type: type,
      message,
      severity,
      data
    });
  };

  try {
    // Update status to running
    await supabase
      .from('agent_runs')
      .update({ status: 'running' })
      .eq('id', runId);

    await emitEvent('started', `Agent ${agentId} execution started`, 'info');

    // Get agent instance
    const agent = await getAgent(agentId);

    // Execute agent
    await emitEvent('progress', 'Agent initialized, beginning execution...', 'info');

    const result = await agent.execute({
      trigger,
      data: inputData,
      context: { runId }
    });

    // Calculate execution time
    const executionTime = Date.now() - startTime;

    if (result.success) {
      // Update run to success
      await supabase
        .from('agent_runs')
        .update({
          status: 'success',
          completed_at: new Date().toISOString(),
          execution_time_ms: executionTime,
          items_processed: result.data?.itemsProcessed || 0,
          output_data: result.data
        })
        .eq('id', runId);

      await emitEvent(
        'completed',
        `Agent completed successfully in ${executionTime}ms`,
        'info',
        { executionTime, itemsProcessed: result.data?.itemsProcessed }
      );

      return result;
    } else {
      // Handle agent-level failure
      throw new Error(result.errors?.join(', ') || 'Agent execution failed');
    }

  } catch (error: any) {
    const executionTime = Date.now() - startTime;

    // Update run to error
    await supabase
      .from('agent_runs')
      .update({
        status: 'error',
        completed_at: new Date().toISOString(),
        execution_time_ms: executionTime,
        error_message: error.message,
        error_stack: error.stack
      })
      .eq('id', runId);

    // Log error event
    await emitEvent(
      'error',
      `Agent execution failed: ${error.message}`,
      'error',
      { error: error.message, stack: error.stack }
    );

    // Add to dead letter queue for manual review
    await supabase.from('agent_failures').insert({
      run_id: runId,
      agent_id: agentId,
      error_message: error.message,
      error_stack: error.stack,
      input_data: inputData
    });

    throw error;
  }
}

/**
 * Get all registered agents
 */
export function getAllAgents(): AgentConfig[] {
  return Object.values(AGENT_REGISTRY);
}

/**
 * Get agent configuration
 */
export function getAgentConfig(agentId: string): AgentConfig | null {
  return AGENT_REGISTRY[agentId] || null;
}

/**
 * Check if agent is available
 */
export function isAgentAvailable(agentId: string): boolean {
  const config = AGENT_REGISTRY[agentId];
  if (!config || !config.enabled) return false;

  const envCheck = validateAgentEnvironment(agentId);
  return envCheck.valid;
}
