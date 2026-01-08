/**
 * Agent Health API
 * GET /api/agents/health
 * 
 * Returns real-time health status for all agents
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAgentHealth } from '@/lib/agent-metrics';
import { circuitBreaker } from '@/lib/agent-retry';
import { getAllAgents } from '@/lib/agent-factory';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');

    // Get health data
    const healthData = await getAgentHealth(agentId || undefined);

    // Get circuit breaker states
    const circuitStates = circuitBreaker.getAllStates();

    // Combine with agent registry
    const agents = getAllAgents();

    const combinedHealth = agents.map(agent => {
      const health = healthData.find(h => h.agentId === agent.id);
      const circuit = circuitStates[agent.id];

      return {
        agentId: agent.id,
        name: agent.name,
        enabled: agent.enabled,
        autonomyLevel: agent.autonomyLevel,
        health: health || {
          status: 'unknown',
          totalRuns: 0,
          successRate: 0,
          lastRunAt: null
        },
        circuitBreaker: {
          state: circuit?.state || 'closed',
          failures: circuit?.failures || 0,
          lastFailure: circuit?.lastFailure || null
        }
      };
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      agents: combinedHealth
    });

  } catch (error: any) {
    console.error('[AgentHealth] Error:', error);
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
