import { createAgentUIStreamResponse } from 'ai';
import { technicalAgent } from '../../../../../packages/agents/src/agents-v6/technical-agent';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: technicalAgent,
    uiMessages: messages,
  });
}
