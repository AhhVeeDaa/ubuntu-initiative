import { createAgentUIStreamResponse } from 'ai';
import { researchAgent } from '../../../../../packages/agents/src/agents-v6/research-agent';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: researchAgent,
    uiMessages: messages,
  });
}
