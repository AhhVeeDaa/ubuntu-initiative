// Ubuntu Initiative - Agent Cron Endpoint
// GET /api/agents/cron
// Triggered by Vercel Cron for scheduled agent runs

import { NextResponse } from 'next/server';
import { PolicyAgent } from '@/lib/agents/policy';

export async function GET(request: Request) {
  try {
    // Verify Vercel Cron Secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Run Policy Agent
    const policyAgent = new PolicyAgent({
      agentId: 'agent_001_policy_monitor',
      version: '1.0.0',
      dryRun: false,
      relevanceThreshold: 0.4
    });

    const result = await policyAgent.execute({ trigger: 'scheduled' });

    return NextResponse.json({
      agent: 'policy_monitor',
      ...result,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown cron error';
    console.error('Cron agent error:', errorMessage);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
