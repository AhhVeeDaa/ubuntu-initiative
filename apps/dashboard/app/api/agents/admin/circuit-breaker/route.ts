/**
 * Admin Circuit Breaker Controls
 * POST /api/agents/admin/circuit-breaker
 * 
 * Allows manual reset of circuit breaker for stuck agents
 */

import { NextRequest, NextResponse } from 'next/server';
import { circuitBreaker } from '@/lib/agent-retry';

export async function POST(req: NextRequest) {
  try {
    const { agentId, action } = await req.json();

    if (!agentId) {
      return NextResponse.json(
        { error: 'agentId required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'reset': {
        await circuitBreaker.reset(agentId);
        
        return NextResponse.json({
          success: true,
          message: `Circuit breaker reset for ${agentId}`,
          state: circuitBreaker.getState(agentId)
        });
      }

      case 'status': {
        const state = circuitBreaker.getState(agentId);
        const failures = circuitBreaker.getFailureCount(agentId);
        
        return NextResponse.json({
          success: true,
          agentId,
          state,
          failures
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "reset" or "status"' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET all circuit breaker states
 */
export async function GET() {
  try {
    const states = circuitBreaker.getAllStates();
    
    return NextResponse.json({
      success: true,
      circuits: states,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
