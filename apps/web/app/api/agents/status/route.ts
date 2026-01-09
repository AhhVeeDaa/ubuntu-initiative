/**
 * Agent Status API
 * GET /api/agents/status
 * Returns real-time status of all agents and environment configuration
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Check environment configuration
    const envStatus = {
      supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      gemini_key: !!process.env.GOOGLE_AI_API_KEY,
      stripe_key: !!process.env.STRIPE_SECRET_KEY,
      cron_secret: !!process.env.CRON_SECRET
    };

    const allConfigured = envStatus.supabase_url && envStatus.supabase_service_key && envStatus.gemini_key;

    // Try to get last agent runs from database
    let lastRuns: Record<string, string | null> = {};

    if (envStatus.supabase_url && envStatus.supabase_service_key) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: auditLogs } = await supabase
          .from('agent_audit_log')
          .select('agent_id, timestamp')
          .order('timestamp', { ascending: false })
          .limit(50);

        if (auditLogs) {
          // Get most recent run per agent
          const runsByAgent: Record<string, string> = {};
          auditLogs.forEach((log: any) => {
            if (!runsByAgent[log.agent_id]) {
              runsByAgent[log.agent_id] = log.timestamp;
            }
          });
          lastRuns = runsByAgent;
        }
      } catch (e) {
        console.error('Failed to fetch agent logs:', e);
      }
    }

    // Agent definitions with real status
    const agents = [
      {
        id: 'agent_001_policy',
        name: 'Policy Monitor',
        status: envStatus.gemini_key ? 'ready' : 'missing_api_key',
        lastRun: lastRuns['agent_001_policy'] || lastRuns['agent_001'] || null,
        triggers: ['scheduled', 'manual', 'api']
      },
      {
        id: 'agent_002_funding',
        name: 'Funding & Grant Agent',
        status: envStatus.stripe_key ? 'ready' : 'missing_api_key',
        lastRun: lastRuns['agent_002'] || null,
        triggers: ['donation_webhook', 'scan_grants', 'generate_funding_report']
      },
      {
        id: 'agent_004_milestone',
        name: 'Progress Tracker',
        status: 'ready',
        lastRun: lastRuns['agent_004'] || null,
        triggers: ['github_webhook', 'manual_submission', 'validate_milestone']
      },
      {
        id: 'agent_005_chatbot',
        name: 'Inga GPT',
        status: envStatus.gemini_key ? 'ready' : 'missing_api_key',
        lastRun: null,
        triggers: ['chat']
      }
    ];

    return NextResponse.json({
      status: allConfigured ? 'healthy' : 'configuration_needed',
      environment: envStatus,
      agents: agents,
      count: agents.length,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      project: 'Ubuntu Initiative Agent Network (UIAN)'
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        status: 'error',
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
