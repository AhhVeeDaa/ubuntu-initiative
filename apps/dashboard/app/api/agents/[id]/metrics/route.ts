/**
 * Agent Metrics API
 * GET /api/agents/[id]/metrics
 * 
 * Returns comprehensive performance metrics for a specific agent
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;

    // Fetch agent metrics from agent_metrics table
    const { data: metricsData, error: metricsError } = await supabase
      .from('agent_metrics')
      .select('*')
      .eq('agent_id', agentId)
      .single();

    if (metricsError && metricsError.code !== 'PGRST116') {
      console.error('Failed to fetch metrics:', metricsError);
    }

    // Fetch recent runs
    const { data: recentRuns, error: runsError } = await supabase
      .from('agent_runs')
      .select('*')
      .eq('agent_id', agentId)
      .order('started_at', { ascending: false })
      .limit(10);

    if (runsError) {
      console.error('Failed to fetch recent runs:', runsError);
    }

    // Fetch recent errors
    const { data: errorRuns, error: errorsError } = await supabase
      .from('agent_runs')
      .select('id, error_message, completed_at')
      .eq('agent_id', agentId)
      .eq('status', 'error')
      .order('completed_at', { ascending: false })
      .limit(5);

    if (errorsError) {
      console.error('Failed to fetch errors:', errorsError);
    }

    // Build response
    const metrics = {
      totalRuns: metricsData?.total_runs || 0,
      successRate: metricsData?.successful_runs && metricsData?.total_runs 
        ? Math.round((metricsData.successful_runs / metricsData.total_runs) * 100)
        : 0,
      avgTime: metricsData?.avg_execution_time_ms || 0,
      itemsProcessed: metricsData?.total_items_processed || 0,
      lastRunAt: metricsData?.last_run_at,
      lastSuccessAt: metricsData?.last_success_at,
      lastErrorAt: metricsData?.last_error_at,
      lastErrorMessage: metricsData?.last_error_message,
      recentRuns: recentRuns || [],
      errors: errorRuns || []
    };

    return NextResponse.json({
      success: true,
      agentId,
      metrics
    });

  } catch (error: any) {
    console.error('Metrics API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
