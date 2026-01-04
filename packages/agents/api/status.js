/**
 * Agent Status API Endpoint
 * GET /api/status - Check agent system health
 */

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Check environment variables
        const envStatus = {
            supabase_url: !!process.env.SUPABASE_URL,
            supabase_key: !!process.env.SUPABASE_SERVICE_KEY,
            gemini_key: !!process.env.GEMINI_API_KEY
        };

        const allConfigured = Object.values(envStatus).every(v => v);

        // List of agents
        const agents = [
            { id: 'agent_001_policy', name: 'Policy Monitor', status: 'ready' },
            { id: 'agent_002_community', name: 'Community Listener', status: 'ready' },
            { id: 'agent_003_narrative', name: 'Content Generator', status: 'ready' },
            { id: 'agent_004_funding', name: 'Grant Finder', status: 'ready' },
            { id: 'agent_005_chatbot', name: 'Inga GPT', status: 'ready' },
            { id: 'agent_006_milestone', name: 'Progress Tracker', status: 'ready' },
            { id: 'agent_007_research', name: 'Research Synthesizer', status: 'ready' },
            { id: 'agent_008_due_diligence', name: 'Stakeholder Vetter', status: 'ready' }
        ];

        return res.status(200).json({
            status: allConfigured ? 'healthy' : 'configuration_needed',
            environment: envStatus,
            agents: agents,
            count: agents.length,
            timestamp: new Date().toISOString(),
            version: '0.5.0',
            project: 'Ubuntu Initiative Agent System'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
