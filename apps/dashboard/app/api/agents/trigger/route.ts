/**
 * Agent Trigger API
 * POST /api/agents/trigger
 * 
 * Triggers an agent execution and logs it to the database.
 * Returns immediately with run ID while agent executes in background.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { agentId, triggeredBy = 'dashboard' } = await req.json();

    if (!agentId) {
      return NextResponse.json(
        { error: 'agentId is required' },
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
        triggered_by: triggeredBy
      })
      .select()
      .single();

    if (runError || !run) {
      console.error('Failed to create run:', runError);
      return NextResponse.json(
        { error: 'Failed to create agent run' },
        { status: 500 }
      );
    }

    // Emit start event
    await supabase.from('agent_events').insert({
      run_id: run.id,
      agent_id: agentId,
      event_type: 'started',
      message: `Agent ${agentId} execution started`,
      severity: 'info'
    });

    // Trigger actual agent execution (async - don't await)
    executeAgent(agentId, run.id).catch(console.error);

    return NextResponse.json({
      success: true,
      runId: run.id,
      status: 'started',
      message: 'Agent execution initiated'
    });

  } catch (error) {
    console.error('Trigger error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Execute agent in background
 * This is where you'd integrate with actual agent code
 */
async function executeAgent(agentId: string, runId: string) {
  const startTime = Date.now();

  try {
    // Update status to running
    await supabase
      .from('agent_runs')
      .update({ status: 'running' })
      .eq('id', runId);

    // Log progress event
    await supabase.from('agent_events').insert({
      run_id: runId,
      agent_id: agentId,
      event_type: 'progress',
      message: 'Executing agent logic...',
      severity: 'info'
    });

    // PLACEHOLDER: Call actual agent code here
    // For now, simulate work with timeout
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate processing items
    const itemsProcessed = Math.floor(Math.random() * 10) + 1;

    // Calculate execution time
    const executionTime = Date.now() - startTime;

    // Update to success
    await supabase
      .from('agent_runs')
      .update({
        status: 'success',
        completed_at: new Date().toISOString(),
        execution_time_ms: executionTime,
        items_processed: itemsProcessed
      })
      .eq('id', runId);

    // Log completion event
    await supabase.from('agent_events').insert({
      run_id: runId,
      agent_id: agentId,
      event_type: 'completed',
      message: `Agent completed successfully. Processed ${itemsProcessed} items in ${executionTime}ms`,
      severity: 'info',
      data: { itemsProcessed, executionTime }
    });

  } catch (error: any) {
    const executionTime = Date.now() - startTime;
    
    // Update to error
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
    await supabase.from('agent_events').insert({
      run_id: runId,
      agent_id: agentId,
      event_type: 'error',
      message: `Agent execution failed: ${error.message}`,
      severity: 'error',
      data: { error: error.message, stack: error.stack }
    });
  }
}
