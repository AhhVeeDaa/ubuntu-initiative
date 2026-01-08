/**
 * Agent SLA Metrics API
 * GET /api/agents/sla
 * 
 * Returns service-level agreement metrics across all agents
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateSLAMetrics } from '@/lib/agent-metrics';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '7', 10);

    const slaMetrics = await calculateSLAMetrics(days);

    return NextResponse.json({
      success: true,
      timeRange: `${days} days`,
      sla: slaMetrics,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[AgentSLA] Error:', error);
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
