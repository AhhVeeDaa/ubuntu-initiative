/**
 * Agent Status API
 * GET /api/agents/status
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envStatus = {
      supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_key: !!process.env.SUPABASE_SERVICE_KEY,
      gemini_key: !!process.env.GOOGLE_AI_API_KEY
    };

    const allConfigured = Object.values(envStatus).every(v => v);

    const agents = [
      { id: 'agent_001_policy', name: 'Policy Monitor', status: 'ready' },
      { id: 'agent_002_community', name: 'Community Listener', status: 'ready' },
      { id: 'agent_003_narrative', name: 'Content Generator', status: 'ready' },
      { id: 'agent_004_funding', name: 'Grant Finder', status: 'ready' },
      { id: 'agent_005_chatbot', name: 'Inga GPT', status: 'ready' },
      { id: 'agent_006_milestone', name: 'Progress Tracker', status: 'ready' },
      { id: 'agent_007_research', name: 'Research Synthesizer', status: 'ready' },
      { id: 'agent_008_due_diligence', name: 'Stakeholder Vetter', status: 'ready' }
    ];

    return NextResponse.json({
      status: allConfigured ? 'healthy' : 'configuration_needed',
      environment: envStatus,
      agents: agents,
      count: agents.length,
      timestamp: new Date().toISOString(),
      version: '0.5.0',
      project: 'Ubuntu Initiative Agent System'
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
