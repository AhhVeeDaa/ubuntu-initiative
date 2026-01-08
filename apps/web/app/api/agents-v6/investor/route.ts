import { createAgentUIStreamResponse } from 'ai';
import { investorRelationsAgent } from '../../../../../packages/agents/src/agents-v6/investor-relations-agent';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: investorRelationsAgent,
    uiMessages: messages,
  });
}
