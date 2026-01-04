/**
 * Agent Index API
 * GET /api/agents
 * Returns the list of all available agents for the Ubuntu Initiative
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const agents = [
      {
        id: 'agent_001_policy',
        name: 'Policy Monitor',
        description: 'Monitors policy discussions and regulatory changes affecting renewable energy and infrastructure projects',
        status: 'active',
        capabilities: [
          'Track policy updates',
          'Analyze regulatory impacts',
          'Generate policy briefs'
        ]
      },
      {
        id: 'agent_002_community',
        name: 'Community Listener',
        description: 'Engages with social media and community discussions to understand public sentiment',
        status: 'active',
        capabilities: [
          'Social media monitoring',
          'Sentiment analysis',
          'Community feedback synthesis'
        ]
      },
      {
        id: 'agent_003_narrative',
        name: 'Content Generator',
        description: 'Creates compelling narratives and content about the Inga Project and clean energy initiatives',
        status: 'active',
        capabilities: [
          'Content generation',
          'Storytelling',
          'Multi-format content creation'
        ]
      },
      {
        id: 'agent_004_funding',
        name: 'Grant Finder',
        description: 'Identifies funding opportunities, grants, and investment prospects for sustainable energy',
        status: 'active',
        capabilities: [
          'Grant discovery',
          'Funding opportunity matching',
          'Investment tracking'
        ]
      },
      {
        id: 'agent_005_chatbot',
        name: 'Inga GPT',
        description: 'Interactive chatbot providing information about the Inga Project and answering visitor questions',
        status: 'active',
        capabilities: [
          'Natural language Q&A',
          'Project information retrieval',
          'Interactive conversations'
        ]
      },
      {
        id: 'agent_006_milestone',
        name: 'Progress Tracker',
        description: 'Tracks project milestones, updates progress metrics, and generates status reports',
        status: 'active',
        capabilities: [
          'Milestone tracking',
          'Progress reporting',
          'Data visualization'
        ]
      },
      {
        id: 'agent_007_research',
        name: 'Research Synthesizer',
        description: 'Aggregates and synthesizes research papers and technical documents on renewable energy',
        status: 'active',
        capabilities: [
          'Research aggregation',
          'Technical document analysis',
          'Knowledge synthesis'
        ]
      },
      {
        id: 'agent_008_due_diligence',
        name: 'Stakeholder Vetter',
        description: 'Performs due diligence on potential stakeholders, partners, and investors',
        status: 'active',
        capabilities: [
          'Stakeholder research',
          'Risk assessment',
          'Reputation analysis'
        ]
      }
    ];

    return NextResponse.json({
      agents,
      count: agents.length,
      timestamp: new Date().toISOString(),
      version: '0.5.0',
      project: 'Ubuntu Initiative Agent System'
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
