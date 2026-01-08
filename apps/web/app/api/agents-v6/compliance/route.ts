import { createAgentUIStreamResponse } from 'ai';
import { complianceAgent } from '../../../../../packages/agents/src/agents-v6/compliance-agent';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: complianceAgent,
    uiMessages: messages,
  });
}
