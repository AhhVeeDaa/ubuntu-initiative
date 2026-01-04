/**
 * Policy Tracking Agent
 * Monitors policy changes affecting hydropower, AI sovereignty, and infrastructure
 */

import { BaseAgent } from '../base-agent.js';

export class PolicyAgent extends BaseAgent {
    constructor() {
        super('agent_001_policy', {
            autoPublishThreshold: 0.7,
            highImpactThreshold: 0.8,
            sources: [
                'https://www.worldbank.org/en/news/all',
                'https://au.int/en/newsevents/press-releases',
                'https://www.iea.org/news'
            ]
        });
    }

    /**
     * Fetch policy news from sources
     */
    async fetchPolicyNews() {
        console.log('[PolicyAgent] Fetching policy updates...');
        
        // In production, this would fetch from real APIs
        // For now, returning mock data structure
        const mockPolicies = [
            {
                title: 'African Union Announces New Infrastructure Investment Framework',
                source: 'African Union',
                source_url: 'https://au.int/en/newsevents/20250105/infrastructure-framework',
                publication_date: new Date().toISOString().split('T')[0],
                summary: 'The African Union has announced a new framework for coordinating infrastructure investments across the continent, with specific provisions for renewable energy projects.',
                keywords: ['infrastructure', 'investment', 'renewable energy']
            },
            {
                title: 'World Bank Updates Hydropower Development Guidelines',
                source: 'World Bank',
                source_url: 'https://www.worldbank.org/en/news/2025/01/05/hydropower-guidelines',
                publication_date: new Date().toISOString().split('T')[0],
                summary: 'Updated guidelines for sustainable hydropower development in emerging markets, including environmental and social safeguards.',
                keywords: ['hydropower', 'development', 'guidelines']
            }
        ];

        return mockPolicies;
    }

    /**
     * Calculate relevance score for policy
     */
    calculateRelevance(policy) {
        const keywords = ['inga', 'hydropower', 'drc', 'congo', 'energy', 'infrastructure', 
                         'ai', 'sovereignty', 'africa', 'renewable'];
        
        const titleWords = policy.title.toLowerCase();
        const summaryWords = policy.summary.toLowerCase();
        const allText = titleWords + ' ' + summaryWords;

        // Count keyword matches
        let matches = 0;
        keywords.forEach(keyword => {
            if (allText.includes(keyword)) matches++;
        });

        // Calculate relevance (0-1)
        const relevance = Math.min(matches / 5, 1.0);
        
        return {
            score: Math.round(relevance * 100) / 100,
            matches: matches,
            keywords: keywords.filter(k => allText.includes(k))
        };
    }

    /**
     * Determine impact category
     */
    determineCategory(policy) {
        const text = (policy.title + ' ' + policy.summary).toLowerCase();
        
        if (text.includes('energy') || text.includes('power') || text.includes('electric')) {
            return 'energy';
        } else if (text.includes('infrastructure') || text.includes('construction')) {
            return 'infrastructure';
        } else if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('digital')) {
            return 'ai_sovereignty';
        } else if (text.includes('government') || text.includes('policy') || text.includes('regulation')) {
            return 'governance';
        } else if (text.includes('environment') || text.includes('climate') || text.includes('sustainable')) {
            return 'environment';
        }
        
        return 'infrastructure'; // Default
    }

    /**
     * Process a single policy event
     */
    async processPolicy(policy) {
        console.log(`[PolicyAgent] Processing: ${policy.title}`);

        // Calculate relevance
        const relevanceData = this.calculateRelevance(policy);
        const category = this.determineCategory(policy);

        const policyData = {
            title: policy.title,
            source: policy.source,
            source_url: policy.source_url,
            publication_date: policy.publication_date,
            summary: policy.summary,
            impact_category: category,
            relevance_score: relevanceData.score
        };

        const reasoning = `Relevance: ${relevanceData.score} (${relevanceData.matches} keyword matches: ${relevanceData.keywords.join(', ')}). Category: ${category}.`;

        try {
            // Insert policy
            const { data: policyRecord, error } = await this.supabase
                .from('policy_events')
                .insert(policyData)
                .select()
                .single();

            if (error) throw error;

            // Log action
            await this.logAction('process_policy', policy, {
                policy_id: policyRecord.id,
                relevance: relevanceData.score,
                auto_published: relevanceData.score < this.config.highImpactThreshold
            }, {
                confidence: relevanceData.score,
                reviewStatus: relevanceData.score >= this.config.highImpactThreshold ? 'pending' : 'not_required',
                reasoning: reasoning
            });

            // Queue high-impact policies for review
            if (relevanceData.score >= this.config.highImpactThreshold) {
                await this.queueForReview('policy', policyRecord.id, {
                    message: 'High-impact policy detected',
                    relevance: relevanceData.score,
                    keywords: relevanceData.keywords
                }, 'high');
                
                console.log(`[PolicyAgent] ⚠️ High-impact policy queued for review: ${policy.title}`);
            } else {
                console.log(`[PolicyAgent] ✅ Policy auto-published: ${policy.title}`);
            }

            return {
                success: true,
                policy: policyRecord,
                relevance: relevanceData
            };
        } catch (error) {
            console.error('[PolicyAgent] Error processing policy:', error);
            throw error;
        }
    }

    /**
     * Run the agent
     */
    async run() {
        console.log('[PolicyAgent] Starting policy scan...');

        try {
            const policies = await this.fetchPolicyNews();
            console.log(`[PolicyAgent] Found ${policies.length} policy updates`);

            const results = [];
            for (const policy of policies) {
                const result = await this.processPolicy(policy);
                results.push(result);
            }

            const highImpact = results.filter(r => r.relevance.score >= this.config.highImpactThreshold).length;
            console.log(`[PolicyAgent] Processed ${results.length} policies (${highImpact} high-impact)`);

            return {
                status: 'completed',
                processed: results.length,
                high_impact: highImpact,
                results
            };
        } catch (error) {
            console.error('[PolicyAgent] Run failed:', error);
            throw error;
        }
    }
}

export default PolicyAgent;
