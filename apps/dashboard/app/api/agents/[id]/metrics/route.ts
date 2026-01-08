/**
 * Agent Metrics API - PRODUCTION VERSION
 * GET /api/agents/[id]/metrics
 * 
 * Returns real metrics calculated from agent_runs data
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateAgentMetrics } from '@/lib/agent-metrics';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;
    const { searchParams } = new URL(req.url);
    const timeRangeDays = parseInt(searchParams.get('days') || '7', 10);

    // Calculate real metrics
    const metrics = await calculateAgentMetrics(agentId, timeRangeDays);

    return NextResponse.json({
      success: true,
      agentId,
      timeRangeDays,
      metrics
    });

  } catch (error: any) {
    console.error('[AgentMetrics] Error calculating metrics:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to calculate metrics'
      },
      { status: 500 }
    );
  }
}
