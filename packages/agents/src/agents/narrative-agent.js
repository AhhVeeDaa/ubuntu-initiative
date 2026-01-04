/**
 * Narrative & Messaging Agent
 * Generates consistent, culturally-aware public messaging
 */

import { BaseAgent } from '../base-agent.js';

export class NarrativeAgent extends BaseAgent {
    constructor() {
        super('agent_003_narrative', {
            // Advisory mode - NEVER auto-publish
            requiresReview: true,
            maxContentLength: 280, // Twitter length
            prohibitedTerms: ['phase 1', 'phase 2', 'future', 'will be', 'coming soon', 'promise']
        });
    }

    /**
     * Generate social media content for milestone
     */
    async generateMilestoneAnnouncement(milestone) {
        console.log(`[NarrativeAgent] Generating announcement for: ${milestone.title}`);

        const systemInstructions = `You are a communications specialist for the Ubuntu Initiative, a transparent public infrastructure project in Africa.

CRITICAL RULES:
- Focus ONLY on Phase 0 (current work), never mention future phases
- Use present tense for completed work, never promise future outcomes
- Be culturally respectful and inclusive
- Keep tone professional but accessible
- Include specific details and evidence links
- Never use superlatives without data support
- Maximum 280 characters for Twitter

Generate a social media announcement for this milestone completion.`;

        const prompt = `Milestone: ${milestone.title}
Description: ${milestone.description}
Category: ${milestone.category}
Evidence: ${milestone.evidence_url}
Completion Date: ${milestone.completion_date}

Generate a tweet announcing this completion. Include the evidence link.`;

        try {
            const content = await this.generateAI(prompt, systemInstructions);
            
            // Validate content
            const validation = this.validateContent(content);

            if (!validation.valid) {
                console.log('[NarrativeAgent] ❌ Content validation failed:', validation.issues);
                return {
                    success: false,
                    validation
                };
            }

            // Create draft
            const draft = {
                content: content.trim(),
                target_platform: 'twitter',
                source_milestone_id: milestone.id,
                validation: validation
            };

            // Queue for human review (ALWAYS)
            await this.queueForReview('narrative', milestone.id, {
                content: draft.content,
                platform: 'twitter',
                milestone_title: milestone.title,
                validation: validation
            }, 'medium');

            // Log action
            await this.logAction('generate_announcement', {
                milestone_id: milestone.id,
                milestone_title: milestone.title
            }, draft, {
                confidence: validation.confidence,
                reviewStatus: 'pending',
                reasoning: `Generated announcement for milestone. ${validation.issues.length > 0 ? 'Issues: ' + validation.issues.join(', ') : 'All validations passed'}.`
            });

            console.log('[NarrativeAgent] ✅ Draft created and queued for review');

            return {
                success: true,
                draft,
                validation
            };
        } catch (error) {
            console.error('[NarrativeAgent] Error generating content:', error);
            throw error;
        }
    }

    /**
     * Validate generated content
     */
    validateContent(content) {
        const issues = [];
        let confidence = 1.0;

        // Check length
        if (content.length > this.config.maxContentLength) {
            issues.push(`Too long (${content.length} chars, max ${this.config.maxContentLength})`);
            confidence -= 0.3;
        }

        // Check for prohibited terms
        const lowerContent = content.toLowerCase();
        const foundProhibited = this.config.prohibitedTerms.filter(term => 
            lowerContent.includes(term)
        );
        
        if (foundProhibited.length > 0) {
            issues.push(`Contains prohibited terms: ${foundProhibited.join(', ')}`);
            confidence -= 0.5;
        }

        // Check for evidence link
        if (!content.includes('http')) {
            issues.push('Missing evidence link');
            confidence -= 0.2;
        }

        // Check for superlatives without data
        const superlatives = ['best', 'greatest', 'largest', 'most'];
        const hasSuperlative = superlatives.some(word => lowerContent.includes(word));
        if (hasSuperlative && !content.match(/\d+/)) {
            issues.push('Superlative claim without supporting data');
            confidence -= 0.3;
        }

        return {
            valid: confidence >= 0.5,
            confidence: Math.max(0, Math.round(confidence * 100) / 100),
            issues: issues
        };
    }

    /**
     * Generate weekly progress summary
     */
    async generateWeeklySummary(milestones) {
        console.log(`[NarrativeAgent] Generating weekly summary for ${milestones.length} milestones...`);

        const systemInstructions = `You are a communications specialist for the Ubuntu Initiative.

Generate a concise weekly progress summary highlighting completed milestones.

RULES:
- Maximum 500 words
- Focus on concrete achievements with evidence
- Use present tense for completed work
- Include milestone categories (technical, community, policy, funding)
- Maintain professional, accessible tone
- No future promises or speculative statements`;

        const prompt = `This week's completed milestones:

${milestones.map(m => `- ${m.title} (${m.category}): ${m.description}`).join('\n')}

Generate a weekly progress summary for our community update email.`;

        try {
            const content = await this.generateAI(prompt, systemInstructions);

            const summary = {
                content: content.trim(),
                milestones_count: milestones.length,
                week_date: new Date().toISOString().split('T')[0]
            };

            // Queue for review
            await this.queueForReview('narrative', `weekly-${summary.week_date}`, {
                content: summary.content,
                type: 'weekly_summary',
                milestones_included: milestones.length
            }, 'low');

            // Log action
            await this.logAction('generate_weekly_summary', {
                milestones_count: milestones.length,
                week: summary.week_date
            }, summary, {
                confidence: 0.8,
                reviewStatus: 'pending',
                reasoning: `Generated weekly summary covering ${milestones.length} milestones.`
            });

            console.log('[NarrativeAgent] ✅ Weekly summary queued for review');

            return {
                success: true,
                summary
            };
        } catch (error) {
            console.error('[NarrativeAgent] Error generating summary:', error);
            throw error;
        }
    }

    /**
     * Run the agent (advisory mode only)
     */
    async run() {
        console.log('[NarrativeAgent] Running in advisory mode...');
        console.log('[NarrativeAgent] Note: All content requires human approval before publishing');

        return {
            status: 'ready',
            mode: 'advisory',
            auto_publish: false,
            requires_review: true
        };
    }
}

export default NarrativeAgent;
