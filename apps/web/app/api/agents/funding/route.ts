import { NextResponse } from 'next/server';
import { FundingGrantAgent } from '@/lib/agents/funding-grant-agent';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { trigger, data } = body;

        const agent = new FundingGrantAgent();
        const result = await agent.execute({
            trigger: trigger || 'scan_grants',
            data: data || {}
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Funding Agent API Error:', error);
        return NextResponse.json({
            success: false,
            errors: [error instanceof Error ? error.message : 'Internal server error']
        }, { status: 500 });
    }
}

export async function GET() {
    const agent = new FundingGrantAgent();
    return NextResponse.json({
        id: agent.getConfig().id,
        name: agent.getConfig().name,
        version: agent.getConfig().version,
        status: 'online',
        triggers: ['donation_webhook', 'scan_grants', 'generate_funding_report']
    });
}
