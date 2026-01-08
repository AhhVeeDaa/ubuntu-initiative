/**
 * Agent Trigger API - PRODUCTION VERSION
 * POST /api/agents/trigger
 * 
 * Triggers real agent execution with:
 * - Circuit breaker protection
 * - Automatic retry on failure
 * - Real-time event streaming
 * - Cost tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { executeWithCircuitBreaker } from '@/lib/agent-retry';
import { isAgentAvailable, getAgentConfig } from '@/lib/agent-factory';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { agentId, triggeredBy = 'dashboard', inputData } = await req.json();

    // Validate input
    if (!agentId) {
      return NextResponse.json(
        { success: false, error: 'agentId is required' },
        { status: 400 }
      );
    }

    // Check if agent is available
    if (!isAgentAvailable(agentId)) {
      const config = getAgentConfig(agentId);
      return NextResponse.json(
        {
          success: false,
          error: config
            ? `Agent ${agentId} is not available. Missing environment variables.`
            : `Unknown agent: ${agentId}`
        },
        { status: 400 }
      );
    }

    // Create run record
    const { data: run, error: runError } = await supabase
      .from('agent_runs')
      .insert({
        agent_id: agentId,
        status: 'pending',
        started_at: new Date().toISOString(),
        triggered_by: triggeredBy,
        input_data: inputData || null
      })
      .select()
      .single();

    if (runError || !run) {
      console.error('[AgentTrigger] Failed to create run:', runError);
      return NextResponse.json(
        { success: false, error: 'Failed to create agent run' },
        { status: 500 }
      );
    }

    console.log(`[AgentTrigger] Created run ${run.id} for agent ${agentId}`);

    // Emit initial event
    await supabase.from('agent_events').insert({
      run_id: run.id,
      agent_id: agentId,
      event_type: 'queued',
      message: `Agent ${agentId} execution queued`,
      severity: 'info',
      data: { triggeredBy }
    });

    // Execute agent asynchronously with circuit breaker protection
    executeAgentAsync(agentId, run.id, inputData).catch(error => {
      console.error(`[AgentTrigger] Async execution error for ${agentId}:`, error);
    });

    return NextResponse.json({
      success: true,
      runId: run.id,
      status: 'pending',
      message: 'Agent execution initiated',
      agentId
    });

  } catch (error: any) {
    console.error('[AgentTrigger] Trigger error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Execute agent in background with full error handling
 */
async function executeAgentAsync(
  agentId: string,
  runId: string,
  inputData?: any
): Promise<void> {
  try {
    console.log(`[AgentTrigger] Starting async execution for ${agentId}, run ${runId}`);

    // Execute with circuit breaker and retry logic
    const result = await executeWithCircuitBreaker(
      agentId,
      runId,
      'manual',
      inputData
    );

    console.log(`[AgentTrigger] Execution completed successfully for ${agentId}`);
    console.log(`[AgentTrigger] Result:`, result);

  } catch (error: any) {
    console.error(`[AgentTrigger] Execution failed for ${agentId}:`, error);
    
    // Error is already logged to database by retry logic
    // Just log to console for monitoring
  }
}

/**
 * GET endpoint to check trigger availability
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get('agentId');

  if (!agentId) {
    return NextResponse.json(
      { error: 'agentId query parameter required' },
      { status: 400 }
    );
  }

  const available = isAgentAvailable(agentId);
  const config = getAgentConfig(agentId);

  if (!config) {
    return NextResponse.json(
      { available: false, error: 'Agent not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    available,
    agentId: config.id,
    name: config.name,
    enabled: config.enabled,
    autonomyLevel: config.autonomyLevel
  });
}
