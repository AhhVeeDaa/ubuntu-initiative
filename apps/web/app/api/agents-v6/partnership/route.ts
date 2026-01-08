import { createAgentUIStreamResponse } from 'ai';
import { partnershipAgent } from '../../../../../packages/agents/src/agents-v6/partnership-agent';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: partnershipAgent,
    uiMessages: messages,
  });
}
