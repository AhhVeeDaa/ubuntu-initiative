/**
 * Enhanced Chatbot Agent (Inga GPT)
 * Powers the public Q&A chatbot with enhanced knowledge base
 */

import { BaseAgent } from '../base-agent.js';

export class ChatbotAgent extends BaseAgent {
    constructor() {
        super('agent_005_chatbot', {
            confidenceThreshold: 0.85,
            maxResponseLength: 500,
            escalationKeywords: [
                'partner', 'partnership', 'invest', 'donate large', 'legal',
                'contract', 'commitment', 'promise', 'guarantee'
            ]
        });
    }

    /**
     * Generate response to user query
     */
    async generateResponse(query, context = {}) {
        console.log(`[ChatbotAgent] Processing query: "${query.substring(0, 50)}..."`);

        // Check if query should be escalated
        const shouldEscalate = this.shouldEscalate(query);
        if (shouldEscalate) {
            return {
                escalated: true,
                message: "Thank you for your question. This requires input from our team. We've added it to our review queue and will respond soon.",
                confidence: 1.0
            };
        }

        // Build context from knowledge base
        const knowledgeContext = await this.getRelevantKnowledge(query);

        // Generate AI response
        const systemInstructions = `You are Inga GPT, the AI assistant for the Ubuntu Initiative - a transparent public infrastructure project for Africa's first sovereign AI supercomputer powered by Inga hydropower.

CRITICAL RULES:
- Only answer based on provided knowledge base context
- If you don't know, say "I don't have that information in my knowledge base"
- NEVER make promises, commitments, or guarantees
- NEVER discuss future phases or speculative technology
- Focus ONLY on Phase 0 (current work)
- Always cite sources from the knowledge base
- Be concise (max ${this.config.maxResponseLength} words)
- If asked about partnerships, funding, or legal matters, recommend contacting the team

Knowledge Base Context:
${knowledgeContext}`;

        const prompt = `User Query: ${query}

Provide a helpful, accurate response based only on the knowledge base context provided.`;

        try {
            const response = await this.generateAI(prompt, systemInstructions);
            
            // Calculate confidence based on knowledge base matches
            const confidence = this.calculateResponseConfidence(query, knowledgeContext);

            // Log the interaction
            await this.logChatInteraction(query, response, confidence, knowledgeContext);

            console.log(`[ChatbotAgent] Response generated (confidence: ${confidence})`);

            return {
                response: response.trim(),
                confidence: confidence,
                sources: this.extractSources(knowledgeContext),
                escalated: false
            };
        } catch (error) {
            console.error('[ChatbotAgent] Error generating response:', error);
            
            // Fallback response
            return {
                response: "I'm having trouble processing your question right now. Please try again or contact our team directly.",
                confidence: 0.0,
                error: true
            };
        }
    }

    /**
     * Check if query should be escalated to humans
     */
    shouldEscalate(query) {
        const lowerQuery = query.toLowerCase();
        
        return this.config.escalationKeywords.some(keyword => 
            lowerQuery.includes(keyword)
        );
    }

    /**
     * Get relevant knowledge base entries
     */
    async getRelevantKnowledge(query) {
        try {
            // Get all knowledge base entries (in production, use vector search)
            const { data: entries, error } = await this.supabase
                .from('knowledge_base')
                .select('question, answer, sources, category')
                .order('last_verified', { ascending: false })
                .limit(10);

            if (error) throw error;

            if (!entries || entries.length === 0) {
                return "No knowledge base entries available.";
            }

            // Simple keyword matching (in production, use embeddings)
            const queryWords = query.toLowerCase().split(' ');
            const scored = entries.map(entry => {
                const entryText = (entry.question + ' ' + entry.answer).toLowerCase();
                const matches = queryWords.filter(word => 
                    word.length > 3 && entryText.includes(word)
                ).length;
                return { ...entry, score: matches };
            });

            // Get top 3 matches
            const topMatches = scored
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .filter(e => e.score > 0);

            if (topMatches.length === 0) {
                return "No directly relevant information found in knowledge base.";
            }

            // Format context
            return topMatches.map(entry => 
                `Q: ${entry.question}\nA: ${entry.answer}\nCategory: ${entry.category}`
            ).join('\n\n---\n\n');
        } catch (error) {
            console.error('[ChatbotAgent] Error fetching knowledge:', error);
            return "Unable to access knowledge base.";
        }
    }

    /**
     * Calculate confidence score for response
     */
    calculateResponseConfidence(query, knowledgeContext) {
        if (knowledgeContext.includes('No') || knowledgeContext.includes('Unable')) {
            return 0.3; // Low confidence if no knowledge found
        }

        const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 3);
        const contextWords = knowledgeContext.toLowerCase();
        
        const matches = queryWords.filter(word => contextWords.includes(word)).length;
        const score = Math.min(matches / Math.max(queryWords.length, 1), 1.0);

        return Math.max(0.5, Math.round(score * 100) / 100); // Min 0.5 if knowledge exists
    }

    /**
     * Extract source citations
     */
    extractSources(knowledgeContext) {
        // Extract URLs from context (simple implementation)
        const urlRegex = /https?:\/\/[^\s]+/g;
        const urls = knowledgeContext.match(urlRegex) || [];
        return urls.slice(0, 3); // Max 3 sources
    }

    /**
     * Log chat interaction
     */
    async logChatInteraction(query, response, confidence, context) {
        try {
            const sessionId = this.generateSessionId();
            
            const { error } = await this.supabase
                .from('chat_logs')
                .insert({
                    session_id: sessionId,
                    user_query: query,
                    agent_response: response,
                    confidence_score: confidence,
                    sources_cited: this.extractSources(context),
                    escalated: false
                });

            if (error) throw error;

            await this.logAction('chat_response', {
                query: query.substring(0, 100),
                query_length: query.length
            }, {
                response_length: response.length,
                confidence: confidence
            }, {
                confidence: confidence,
                reasoning: `Generated response with ${confidence} confidence.`
            });
        } catch (error) {
            console.error('[ChatbotAgent] Error logging interaction:', error);
        }
    }

    /**
     * Generate session ID
     */
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Update knowledge base with new entry
     */
    async addKnowledgeEntry(entry) {
        console.log(`[ChatbotAgent] Adding knowledge: ${entry.question}`);

        try {
            const { data, error } = await this.supabase
                .from('knowledge_base')
                .insert({
                    question: entry.question,
                    answer: entry.answer,
                    category: entry.category || 'general',
                    sources: entry.sources || [],
                    confidence: entry.confidence || 0.9,
                    last_verified: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            console.log(`[ChatbotAgent] ✅ Knowledge entry added`);
            return { success: true, entry: data };
        } catch (error) {
            console.error('[ChatbotAgent] Error adding knowledge:', error);
            throw error;
        }
    }

    /**
     * Run the agent (initialize knowledge base check)
     */
    async run() {
        console.log('[ChatbotAgent] Checking knowledge base...');

        try {
            const { data, error } = await this.supabase
                .from('knowledge_base')
                .select('id')
                .limit(1);

            if (error) throw error;

            const hasKnowledge = data && data.length > 0;

            console.log(`[ChatbotAgent] Knowledge base status: ${hasKnowledge ? 'Ready' : 'Empty'}`);

            return {
                status: 'ready',
                knowledge_base_ready: hasKnowledge,
                escalation_keywords: this.config.escalationKeywords.length,
                confidence_threshold: this.config.confidenceThreshold
            };
        } catch (error) {
            console.error('[ChatbotAgent] Run failed:', error);
            throw error;
        }
    }
}

export default ChatbotAgent;
