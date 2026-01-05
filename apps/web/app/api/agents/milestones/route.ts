import { NextResponse } from 'next/server';
import { ProgressMilestoneAgent } from '@/lib/agents/progress-milestone-agent';

/**
 * API Route for Milestone Agent
 * Handles manual submissions and could be extended for GitHub webhooks
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { trigger, data } = body;

        if (!trigger || !data) {
            return NextResponse.json({
                success: false,
                errors: ['Missing trigger or data']
            }, { status: 400 });
        }

        const agent = new ProgressMilestoneAgent();
        const result = await agent.execute({
            trigger,
            data
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error('Milestone Agent API Error:', error);
        return NextResponse.json({
            success: false,
            errors: [error instanceof Error ? error.message : 'Internal server error']
        }, { status: 500 });
    }
}

/**
 * GET route to check agent status
 */
export async function GET() {
    const agent = new ProgressMilestoneAgent();
    return NextResponse.json({
        id: agent.getConfig().id,
        name: agent.getConfig().name,
        version: agent.getConfig().version,
        status: 'online',
        triggers: ['github_webhook', 'manual_submission', 'validate_milestone']
    });
}
