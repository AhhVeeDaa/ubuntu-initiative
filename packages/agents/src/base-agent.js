/**
 * Base Agent Class
 * Provides common functionality for all Ubuntu Initiative agents
 */

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export class BaseAgent {
    constructor(agentId, config = {}) {
        this.agentId = agentId;
        this.config = config;
        
        // Initialize Supabase
        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );
        
        // Initialize Gemini AI
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    }

    /**
     * Log agent action to audit trail
     */
    async logAction(actionType, inputData, outputData, options = {}) {
        const { confidence, reviewStatus = 'not_required', reasoning } = options;
        
        try {
            const { data, error } = await this.supabase
                .from('agent_audit_log')
                .insert({
                    agent_id: this.agentId,
                    action_type: actionType,
                    input_data: inputData,
                    output_data: outputData,
                    confidence_score: confidence,
                    human_review_status: reviewStatus,
                    reasoning: reasoning
                })
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`[${this.agentId}] Failed to log action:`, error);
            throw error;
        }
    }

    /**
     * Queue item for human review
     */
    async queueForReview(itemType, itemId, recommendation, priority = 'medium') {
        try {
            const { data, error } = await this.supabase
                .from('approval_queue')
                .insert({
                    item_type: itemType,
                    item_id: itemId,
                    agent_recommendation: recommendation,
                    priority: priority,
                    status: 'pending'
                })
                .select()
                .single();
            
            if (error) throw error;
            
            console.log(`[${this.agentId}] Queued ${itemType} ${itemId} for review (priority: ${priority})`);
            return data;
        } catch (error) {
            console.error(`[${this.agentId}] Failed to queue for review:`, error);
            throw error;
        }
    }

    /**
     * Generate AI response using Gemini
     */
    async generateAI(prompt, systemInstructions) {
        try {
            const chat = this.model.startChat({
                history: [],
                systemInstruction: systemInstructions
            });
            
            const result = await chat.sendMessage(prompt);
            const response = result.response.text();
            
            return response;
        } catch (error) {
            console.error(`[${this.agentId}] AI generation failed:`, error);
            throw error;
        }
    }

    /**
     * Calculate confidence score based on criteria
     */
    calculateConfidence(criteria) {
        const scores = Object.values(criteria);
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return Math.round(avg * 100) / 100;
    }

    /**
     * Run the agent (to be implemented by subclasses)
     */
    async run() {
        throw new Error('run() must be implemented by subclass');
    }
}

export default BaseAgent;
