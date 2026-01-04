/**
 * Progress Milestone Ingestion Agent
 * Validates and publishes project milestones
 */

import { BaseAgent } from '../base-agent.js';

export class MilestoneAgent extends BaseAgent {
    constructor() {
        super('agent_004_milestone', {
            autoPublishThreshold: 0.9,
            requiredEvidenceTypes: ['url', 'commit', 'document']
        });
    }

    /**
     * Validate milestone submission
     */
    async validateMilestone(submission) {
        const criteria = {
            hasTitle: submission.title && submission.title.length > 10 ? 1 : 0,
            hasDescription: submission.description && submission.description.length > 50 ? 1 : 0.5,
            hasEvidence: submission.evidence_url && this.isValidUrl(submission.evidence_url) ? 1 : 0,
            hasValidCategory: ['technical', 'community', 'policy', 'funding'].includes(submission.category) ? 1 : 0,
            hasCompletionDate: submission.completion_date ? 1 : 0
        };

        const confidence = this.calculateConfidence(criteria);
        
        return {
            valid: confidence >= 0.7,
            confidence,
            criteria,
            reasoning: this.generateReasoning(criteria)
        };
    }

    /**
     * Generate reasoning text
     */
    generateReasoning(criteria) {
        const passed = Object.entries(criteria)
            .filter(([_, score]) => score === 1)
            .map(([key]) => key);
        
        const failed = Object.entries(criteria)
            .filter(([_, score]) => score < 1)
            .map(([key]) => key);

        let reasoning = `Validation: ${passed.length}/${Object.keys(criteria).length} checks passed.`;
        if (failed.length > 0) {
            reasoning += ` Issues: ${failed.join(', ')}.`;
        }
        return reasoning;
    }

    /**
     * Check if URL is valid
     */
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    /**
     * Process milestone submission
     */
    async processMilestone(submission) {
        console.log(`[MilestoneAgent] Processing milestone: ${submission.title}`);

        // Validate
        const validation = await this.validateMilestone(submission);

        if (!validation.valid) {
            console.log(`[MilestoneAgent] ❌ Validation failed (confidence: ${validation.confidence})`);
            return {
                success: false,
                error: 'Validation failed',
                validation
            };
        }

        try {
            // Prepare milestone data
            const milestoneData = {
                title: submission.title,
                description: submission.description,
                category: submission.category,
                completion_date: submission.completion_date,
                evidence_url: submission.evidence_url,
                confidence_score: validation.confidence,
                status: validation.confidence >= this.config.autoPublishThreshold ? 'verified' : 'completed'
            };

            // Insert milestone
            const { data: milestone, error } = await this.supabase
                .from('milestone_events')
                .insert(milestoneData)
                .select()
                .single();

            if (error) throw error;

            // Log action
            await this.logAction('validate_milestone', submission, {
                milestone_id: milestone.id,
                auto_published: validation.confidence >= this.config.autoPublishThreshold
            }, {
                confidence: validation.confidence,
                reviewStatus: validation.confidence >= this.config.autoPublishThreshold ? 'not_required' : 'pending',
                reasoning: validation.reasoning
            });

            // Queue for review if confidence is low
            if (validation.confidence < this.config.autoPublishThreshold) {
                await this.queueForReview('milestone', milestone.id, {
                    message: 'Milestone needs verification',
                    confidence: validation.confidence,
                    criteria: validation.criteria
                }, 'medium');
            }

            console.log(`[MilestoneAgent] ✅ Milestone processed: ${milestone.id}`);
            return {
                success: true,
                milestone,
                validation
            };
        } catch (error) {
            console.error('[MilestoneAgent] Error processing milestone:', error);
            throw error;
        }
    }

    /**
     * Get milestone completion stats
     */
    async getStats() {
        try {
            const { data: milestones, error } = await this.supabase
                .from('milestone_events')
                .select('id, category, status')
                .in('status', ['completed', 'verified']);

            if (error) throw error;

            const stats = {
                total: milestones.length,
                byCategory: {},
                byStatus: {}
            };

            milestones.forEach(m => {
                stats.byCategory[m.category] = (stats.byCategory[m.category] || 0) + 1;
                stats.byStatus[m.status] = (stats.byStatus[m.status] || 0) + 1;
            });

            return stats;
        } catch (error) {
            console.error('[MilestoneAgent] Error getting stats:', error);
            throw error;
        }
    }

    /**
     * Run the agent
     */
    async run() {
        console.log('[MilestoneAgent] Agent started');
        const stats = await this.getStats();
        console.log('[MilestoneAgent] Current stats:', stats);
        return { status: 'ready', stats };
    }
}

export default MilestoneAgent;
