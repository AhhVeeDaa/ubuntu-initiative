import { createAgentUIStreamResponse } from 'ai';
import { contentAgent } from '../../../../../packages/agents/src/agents-v6/content-agent';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: contentAgent,
    uiMessages: messages,
  });
}
