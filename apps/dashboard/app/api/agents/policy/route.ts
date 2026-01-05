/**
 * Policy Agent Trigger API
 * POST /api/agents/policy
 * 
 * Triggers a manual run of the policy monitoring agent
 * This is a proxy endpoint that calls the main web app's agent endpoint
 */

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Get the main web app URL from environment or use default
    const webAppUrl = process.env.NEXT_PUBLIC_WEB_APP_URL || 'https://ubuntu-initiative-web.vercel.app';

    // Call the actual policy agent endpoint on the web app
    const response = await fetch(`${webAppUrl}/api/agents/policy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Check if response is ok
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Agent returned ${response.status}: ${response.statusText}`
        },
        { status: response.status }
      );
    }

    // Parse the response
    const result = await response.json();

    return NextResponse.json(result);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to trigger agent';
    console.error('Error triggering policy agent:', errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: 'The policy agent endpoint may not exist yet. This is expected if the policy agent has not been deployed.'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests with info about the endpoint
export async function GET() {
  return NextResponse.json({
    name: 'Policy Agent Trigger',
    description: 'Triggers a manual run of the policy monitoring agent',
    method: 'POST',
    status: 'ready',
    note: 'Use POST method to trigger the agent'
  });
}
