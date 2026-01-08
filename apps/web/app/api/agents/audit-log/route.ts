/**
 * Public Agent Audit Log API - PRODUCTION VERSION
 * GET /api/agents/audit-log
 * 
 * Returns approved agent actions visible to the public
 * Falls back to recent successful runs if audit table doesn't exist yet
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Try to get from public audit log table first
    const { data: auditLogs, error: auditError } = await supabase
      .from('agent_audit_trail')
      .select('*')
      .eq('public_visible', true)
      .order('created_at', { ascending: false })
      .limit(50);

    // If audit_trail exists, use it
    if (!auditError && auditLogs && auditLogs.length > 0) {
      return NextResponse.json({
        logs: auditLogs.map((log: any) => ({
          id: log.id,
          agent_id: log.agent_id,
          action_type: log.action_type,
          description: log.reasoning || log.action_type,
          impact: determineImpact(log.confidence_score),
          approved_at: log.created_at
        })),
        count: auditLogs.length,
        timestamp: new Date().toISOString()
      });
    }

    // Fallback: Generate from recent successful runs
    const { data: recentRuns, error: runsError } = await supabase
      .from('agent_runs')
      .select('id, agent_id, started_at, items_processed')
      .eq('status', 'success')
      .order('started_at', { ascending: false })
      .limit(20);

    if (runsError) {
      console.error('[AuditLog] Error fetching runs:', runsError);
      return NextResponse.json({
        logs: [],
        count: 0,
        timestamp: new Date().toISOString()
      });
    }

    // Transform runs into audit log format
    const logs = (recentRuns || []).map((run: any) => ({
      id: run.id,
      agent_id: run.agent_id,
      action_type: getActionType(run.agent_id),
      description: getDescription(run.agent_id, run.items_processed),
      impact: run.items_processed > 10 ? 'medium' : 'low',
      approved_at: run.started_at
    }));

    return NextResponse.json({
      logs,
      count: logs.length,
      timestamp: new Date().toISOString(),
      source: 'agent_runs' // Indicate this is fallback data
    });

  } catch (error) {
    console.error('[AuditLog] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', logs: [], count: 0 },
      { status: 500 }
    );
  }
}

/**
 * Helper: Determine impact level from confidence score
 */
function determineImpact(confidence?: number): 'low' | 'medium' | 'high' {
  if (!confidence) return 'low';
  if (confidence >= 0.9) return 'low';
  if (confidence >= 0.7) return 'medium';
  return 'high';
}

/**
 * Helper: Get human-readable action type
 */
function getActionType(agentId: string): string {
  const actions: Record<string, string> = {
    'agent_001_policy': 'Policy Review',
    'agent_002_funding': 'Funding Check',
    'agent_004_milestones': 'Milestone Validation'
  };
  return actions[agentId] || 'Agent Action';
}

/**
 * Helper: Generate description from agent run
 */
function getDescription(agentId: string, itemsProcessed: number): string {
  const descriptions: Record<string, (n: number) => string> = {
    'agent_001_policy': (n) => `Reviewed ${n} policy documents and identified relevant updates`,
    'agent_002_funding': (n) => `Processed ${n} funding sources and grant opportunities`,
    'agent_004_milestones': (n) => `Validated ${n} milestone completions and progress updates`
  };
  
  const generator = descriptions[agentId];
  return generator ? generator(itemsProcessed) : `Processed ${itemsProcessed} items`;
}
