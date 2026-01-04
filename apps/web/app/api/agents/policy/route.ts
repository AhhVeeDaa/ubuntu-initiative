// Ubuntu Initiative - Policy Agent Manual Trigger
// POST /api/agents/policy

import { NextResponse } from 'next/server';
import { PolicyAgent } from '@/lib/agents/policy';

export async function POST(request: Request) {
  try {
    // TODO: Add authentication check here
    // For Phase 0, we'll allow manual triggers
    // In production, verify user has 'admin' or 'approver' role
    
    const agent = new PolicyAgent({
      agentId: 'agent_001_policy_monitor',
      version: '1.0.0',
      dryRun: false,
      relevanceThreshold: 0.4
    });

    const result = await agent.run('manual', 'system'); // TODO: Use actual user ID
    
    return NextResponse.json({
      success: true,
      ...result
    });
    
  } catch (error: any) {
    console.error('Policy agent error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    agent: 'Policy Monitor',
    id: 'agent_001_policy_monitor',
    version: '1.0.0',
    status: 'active',
    methods: ['POST']
  });
}
