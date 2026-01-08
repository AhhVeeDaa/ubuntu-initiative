import { createAgentUIStreamResponse } from 'ai';
import { financialAgent } from '../../../../../packages/agents/src/agents-v6/financial-agent';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: financialAgent,
    uiMessages: messages,
  });
}
