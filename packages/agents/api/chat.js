/**
 * Chatbot API Endpoint (Inga GPT)
 * POST /api/chat - Send queries to Inga GPT
 */

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { query, session_id } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        // Initialize Supabase
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        // Check for escalation keywords
        const escalationKeywords = [
            'partner', 'partnership', 'invest', 'donate large', 'legal',
            'contract', 'commitment', 'promise', 'guarantee'
        ];

        const shouldEscalate = escalationKeywords.some(keyword =>
            query.toLowerCase().includes(keyword)
        );

        if (shouldEscalate) {
            return res.status(200).json({
                escalated: true,
                message: "Thank you for your question. This requires input from our team. We've added it to our review queue.",
                confidence: 1.0,
                session_id: session_id || `session_${Date.now()}`
            });
        }

        // Query knowledge base
        const { data: knowledge, error } = await supabase
            .from('knowledge_base')
            .select('question, answer, category, sources')
            .limit(5);

        if (error) throw error;

        // Simple keyword matching
        const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 3);
        const matches = knowledge?.filter(entry => {
            const entryText = (entry.question + ' ' + entry.answer).toLowerCase();
            return queryWords.some(word => entryText.includes(word));
        }) || [];

        if (matches.length === 0) {
            return res.status(200).json({
                response: "I don't have specific information about that in my knowledge base. For detailed questions, please contact the Ubuntu Initiative team directly.",
                confidence: 0.3,
                sources: [],
                session_id: session_id || `session_${Date.now()}`
            });
        }

        // Return best match
        const bestMatch = matches[0];
        return res.status(200).json({
            response: bestMatch.answer,
            confidence: 0.85,
            sources: bestMatch.sources || [],
            category: bestMatch.category,
            session_id: session_id || `session_${Date.now()}`
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
