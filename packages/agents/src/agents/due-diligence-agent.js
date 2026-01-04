/**
 * Stakeholder Due Diligence Agent
 * Researches and profiles potential partners, funders, and stakeholders
 */

import { BaseAgent } from '../base-agent.js';

export class DueDiligenceAgent extends BaseAgent {
    constructor() {
        super('agent_008_due_diligence', {
            riskThreshold: 0.5,
            requiresReview: true, // All reports require human review
            checkSources: [
                'OpenCorporates',
                'UN Sanctions List',
                'Public News Archives'
            ]
        });
    }

    /**
     * Perform due diligence on entity
     */
    async performDueDiligence(entity) {
        console.log(`[DueDiligenceAgent] Researching: ${entity.name}`);

        // Multi-source check
        const checks = {
            basicInfo: await this.checkBasicInfo(entity),
            riskFlags: await this.checkRiskFlags(entity),
            opportunityScore: await this.assessOpportunity(entity),
            publicReputation: await this.checkReputation(entity)
        };

        // Calculate scores
        const riskScore = this.calculateRiskScore(checks);
        const opportunityScore = checks.opportunityScore;

        // Compile report
        const report = {
            entity_name: entity.name,
            entity_type: entity.type || 'unknown',
            risk_score: riskScore,
            opportunity_score: opportunityScore,
            risk_flags: checks.riskFlags,
            sources: this.compileSources(checks),
            last_reviewed: new Date().toISOString(),
            recommendation: this.generateRecommendation(riskScore, opportunityScore)
        };

        // Store in private schema
        try {
            const { data: profile, error } = await this.supabase
                .from('stakeholder_profiles')
                .insert(report)
                .select()
                .single();

            if (error) throw error;

            // Queue for leadership review
            await this.queueForReview('stakeholder', profile.id, {
                entity: entity.name,
                risk_score: riskScore,
                opportunity_score: opportunityScore,
                recommendation: report.recommendation
            }, riskScore >= this.config.riskThreshold ? 'urgent' : 'medium');

            await this.logAction('due_diligence', entity, {
                profile_id: profile.id,
                risk_score: riskScore,
                opportunity_score: opportunityScore
            }, {
                confidence: 0.8,
                reviewStatus: 'pending',
                reasoning: `Due diligence completed. Risk: ${riskScore}, Opportunity: ${opportunityScore}. ${checks.riskFlags.length} risk flags found.`
            });

            console.log(`[DueDiligenceAgent] ✅ Report generated (Risk: ${riskScore}, Opp: ${opportunityScore})`);

            return {
                success: true,
                report,
                profile
            };
        } catch (error) {
            console.error('[DueDiligenceAgent] Error storing report:', error);
            throw error;
        }
    }

    /**
     * Check basic entity information
     */
    async checkBasicInfo(entity) {
        // Mock implementation - in production, query OpenCorporates, etc.
        return {
            registered: true,
            jurisdiction: entity.country || 'Unknown',
            type: entity.type || 'Unknown',
            status: 'active'
        };
    }

    /**
     * Check for risk flags
     */
    async checkRiskFlags(entity) {
        const flags = [];

        // Mock checks - in production, query real databases
        const entityName = entity.name.toLowerCase();

        // Check 1: Sanctions list (mock)
        if (entityName.includes('sanctioned')) {
            flags.push({
                type: 'sanctions',
                severity: 'high',
                source: 'UN Sanctions List',
                description: 'Entity appears on sanctions watchlist'
            });
        }

        // Check 2: Negative news (mock)
        if (entityName.includes('fraud') || entityName.includes('scandal')) {
            flags.push({
                type: 'reputation',
                severity: 'medium',
                source: 'News Archives',
                description: 'Negative news articles found'
            });
        }

        // Check 3: Financial issues (mock)
        if (entity.type === 'corporation' && Math.random() < 0.1) {
            flags.push({
                type: 'financial',
                severity: 'low',
                source: 'Financial Records',
                description: 'Recent financial concerns noted'
            });
        }

        return flags;
    }

    /**
     * Assess opportunity score
     */
    async assessOpportunity(entity) {
        let score = 0.5; // Baseline

        // Positive indicators
        if (entity.type === 'ngo' || entity.type === 'foundation') {
            score += 0.2; // NGOs/foundations often good partners
        }

        if (entity.sector === 'energy' || entity.sector === 'infrastructure') {
            score += 0.2; // Relevant sector
        }

        if (entity.country === 'DRC' || entity.region === 'Africa') {
            score += 0.1; // Local/regional connection
        }

        return Math.min(score, 1.0);
    }

    /**
     * Check public reputation
     */
    async checkReputation(entity) {
        // Mock sentiment analysis
        // In production: analyze news articles, social media, etc.
        const sentiment = Math.random() > 0.3 ? 'positive' : 'neutral';
        
        return {
            sentiment: sentiment,
            source_count: Math.floor(Math.random() * 50) + 10,
            recent_mentions: Math.floor(Math.random() * 20)
        };
    }

    /**
     * Calculate overall risk score
     */
    calculateRiskScore(checks) {
        let risk = 0.0;

        // Add risk for each flag
        checks.riskFlags.forEach(flag => {
            switch (flag.severity) {
                case 'high':
                    risk += 0.4;
                    break;
                case 'medium':
                    risk += 0.2;
                    break;
                case 'low':
                    risk += 0.1;
                    break;
            }
        });

        // Add risk for unknown status
        if (!checks.basicInfo.registered) {
            risk += 0.3;
        }

        // Round to 1 decimal place to avoid floating point precision issues
        return Math.min(Math.round(risk * 10) / 10, 1.0);
    }

    /**
     * Compile all sources checked
     */
    compileSources(checks) {
        return {
            basic_info: ['OpenCorporates', 'Public Registries'],
            risk_checks: this.config.checkSources,
            reputation: ['News Archives', 'Public Records']
        };
    }

    /**
     * Generate recommendation
     */
    generateRecommendation(riskScore, opportunityScore) {
        if (riskScore >= 0.7) {
            return 'HIGH_RISK: Do not proceed without extensive additional review';
        }
        
        if (riskScore >= 0.5) {
            return 'MEDIUM_RISK: Proceed with caution, additional verification recommended';
        }

        if (opportunityScore >= 0.7 && riskScore < 0.3) {
            return 'LOW_RISK_HIGH_OPPORTUNITY: Good candidate for engagement';
        }

        if (riskScore < 0.3) {
            return 'LOW_RISK: Acceptable for engagement with standard oversight';
        }

        return 'ASSESS: Requires detailed evaluation by leadership';
    }

    /**
     * Quarterly review of existing stakeholders
     */
    async quarterlyReview() {
        console.log('[DueDiligenceAgent] Running quarterly stakeholder review...');

        try {
            // Get all active stakeholder profiles
            const { data: profiles, error } = await this.supabase
                .from('stakeholder_profiles')
                .select('*')
                .order('last_reviewed', { ascending: true })
                .limit(50); // Review top 50 oldest

            if (error) throw error;

            if (!profiles || profiles.length === 0) {
                return {
                    status: 'no_stakeholders',
                    message: 'No stakeholder profiles to review'
                };
            }

            const reviews = [];
            for (const profile of profiles) {
                // Re-check risk flags
                const entity = {
                    name: profile.entity_name,
                    type: profile.entity_type
                };

                const newFlags = await this.checkRiskFlags(entity);
                const hasNewFlags = newFlags.length > (profile.risk_flags?.length || 0);

                if (hasNewFlags) {
                    console.log(`[DueDiligenceAgent] ⚠️ New risk flags for ${profile.entity_name}`);
                    reviews.push({
                        profile_id: profile.id,
                        entity: profile.entity_name,
                        new_flags: newFlags,
                        requires_attention: true
                    });

                    // Alert leadership
                    await this.queueForReview('stakeholder', profile.id, {
                        message: 'New risk flags detected in quarterly review',
                        entity: profile.entity_name,
                        new_flags: newFlags
                    }, 'high');
                }
            }

            console.log(`[DueDiligenceAgent] Quarterly review: ${reviews.length} require attention`);

            return {
                status: 'completed',
                reviewed: profiles.length,
                flagged: reviews.length,
                reviews
            };
        } catch (error) {
            console.error('[DueDiligenceAgent] Quarterly review failed:', error);
            throw error;
        }
    }

    /**
     * Run the agent
     */
    async run() {
        console.log('[DueDiligenceAgent] Ready for stakeholder vetting');
        console.log('[DueDiligenceAgent] All reports require human review (advisory mode)');

        return {
            status: 'ready',
            mode: 'advisory',
            risk_threshold: this.config.riskThreshold,
            auto_approve: false
        };
    }
}

export default DueDiligenceAgent;
