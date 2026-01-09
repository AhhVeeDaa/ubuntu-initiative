// Ubuntu Initiative - Agent Cron Endpoint
// GET /api/agents/cron
// Triggered by Vercel Cron for scheduled agent runs

import { NextResponse } from 'next/server';
import { PolicyAgent } from '@/lib/agents/policy';

// Vercel Cron configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    // Verify Vercel Cron Secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // In production, require secret. In development, allow without.
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize Policy Agent
    const policyAgent = new PolicyAgent({
      agentId: 'agent_001_policy_monitor',
      version: '1.0.0',
      dryRun: false,
      relevanceThreshold: 0.4
    });

    // Execute the agent
    const result = await policyAgent.execute({
      trigger: 'scheduled',
      context: {
        source: 'vercel_cron',
        timestamp: new Date().toISOString()
      }
    });

    return NextResponse.json({
      agent: 'policy_monitor',
      runId: (result.data as any)?.runId,
      success: result.success,
      itemsProcessed: (result.data as any)?.itemsProcessed || 0,
      requiresReview: result.requiresReview,
      errors: result.errors,
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
