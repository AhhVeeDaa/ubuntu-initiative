import { NextResponse } from 'next/server';
import { PolicyAgent } from '@/lib/agents/policy';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trigger, data } = body;

    const agent = new PolicyAgent({
      agentId: 'agent_001',
      version: '1.0.0',
      dryRun: false,
      relevanceThreshold: 0.5
    });

    const result = await agent.execute({
      trigger: trigger || 'api',
      data: data || {}
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Policy Agent API Error:', error);
    return NextResponse.json({
      success: false,
      errors: [error instanceof Error ? error.message : 'Internal server error']
    }, { status: 500 });
  }
}

export async function GET() {
  const agent = new PolicyAgent({ agentId: 'agent_001', version: '1.0.0', dryRun: true });
  return NextResponse.json({
    id: agent.getConfig().id,
    name: agent.getConfig().name,
    version: agent.getConfig().version,
    status: 'online',
    triggers: ['manual', 'api', 'scheduled']
  });
}
