/**
 * Community Signal Agent
 * Monitors community sentiment and engagement across platforms
 */

import { BaseAgent } from '../base-agent.js';

export class CommunityAgent extends BaseAgent {
    constructor() {
        super('agent_006_community', {
            sentimentThreshold: -0.3, // Alert if sentiment drops below this
            minSampleSize: 10
        });
    }

    /**
     * Analyze sentiment of text (simple implementation)
     */
    analyzeSentiment(text) {
        const positiveWords = ['great', 'good', 'excellent', 'amazing', 'love', 'support', 'progress', 
                              'transparent', 'trust', 'helpful', 'innovative', 'success'];
        const negativeWords = ['bad', 'poor', 'terrible', 'scam', 'fraud', 'concern', 'worried', 
                              'disappointed', 'fail', 'problem', 'issue', 'difficult'];

        const lowerText = text.toLowerCase();
        
        let positiveCount = 0;
        let negativeCount = 0;

        positiveWords.forEach(word => {
            if (lowerText.includes(word)) positiveCount++;
        });

        negativeWords.forEach(word => {
            if (lowerText.includes(word)) negativeCount++;
        });

        // Calculate sentiment score (-1 to 1)
        const totalWords = positiveCount + negativeCount;
        if (totalWords === 0) return 0; // Neutral

        const sentiment = (positiveCount - negativeCount) / Math.max(totalWords, 1);
        return Math.max(-1, Math.min(1, sentiment)); // Clamp to [-1, 1]
    }

    /**
     * Categorize community signal
     */
    categorizeSignal(text) {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('donation') || lowerText.includes('funding') || lowerText.includes('support')) {
            return 'funding';
        } else if (lowerText.includes('milestone') || lowerText.includes('progress') || lowerText.includes('complete')) {
            return 'progress';
        } else if (lowerText.includes('question') || lowerText.includes('ask') || lowerText.includes('how')) {
            return 'question';
        } else if (lowerText.includes('concern') || lowerText.includes('issue') || lowerText.includes('problem')) {
            return 'concern';
        } else if (lowerText.includes('suggestion') || lowerText.includes('idea') || lowerText.includes('could')) {
            return 'suggestion';
        }

        return 'general';
    }

    /**
     * Retry a database operation with exponential backoff
     */
    async retryOperation(operation, maxRetries = 3, baseDelay = 1000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                if (attempt === maxRetries) throw error;
                const delay = baseDelay * Math.pow(2, attempt - 1);
                console.warn(`[CommunityAgent] Attempt ${attempt} failed, retrying in ${delay}ms...`, error.message);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    /**
     * Process community signals (chat logs, social media, etc)
     */
    async processCommunitySignals(signals) {
        console.log(`[CommunityAgent] Processing ${signals.length} community signals...`);

        const processed = [];
        for (const signal of signals) {
            const sentiment = this.analyzeSentiment(signal.content);
            const category = this.categorizeSignal(signal.content);
            const contentHash = this.hashContent(signal.content);

            const signalData = {
                type: category,
                direction: 'inbound',
                summary: `${signal.source}: ${category} signal`,
                sent_by: signal.source,
                full_content: contentHash,
                metadata: {
                    sentiment: Math.round(sentiment * 100) / 100,
                    category: category,
                    source: signal.source
                },
                sent_at: new Date().toISOString()
            };

            try {
                const { data, error } = await this.retryOperation(async () => {
                    const result = await this.supabase
                        .from('communications')
                        .insert(signalData)
                        .select()
                        .single();
                    if (result.error) throw result.error;
                    return result;
                });

                if (error) throw error;

                processed.push({
                    ...data,
                    sentiment: signalData.metadata.sentiment,
                    category: category,
                    original_sentiment: sentiment
                });
            } catch (error) {
                console.error('[CommunityAgent] Error inserting signal:', error);
            }
        }

        return processed;
    }

    /**
     * Generate weekly insights report
     */
    async generateWeeklyInsights() {
        console.log('[CommunityAgent] Generating weekly insights...');

        try {
            // Get signals from past week
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            
            const { data: signals, error } = await this.retryOperation(async () => {
                const result = await this.supabase
                    .from('communications')
                    .select('*')
                    .eq('direction', 'inbound')
                    .gte('sent_at', weekAgo)
                    .order('sent_at', { ascending: false });
                if (result.error) throw result.error;
                return result;
            });

            if (error) throw error;

            if (!signals || signals.length < this.config.minSampleSize) {
                return {
                    status: 'insufficient_data',
                    sample_size: signals?.length || 0,
                    required: this.config.minSampleSize
                };
            }

            // Calculate aggregated metrics (sentiment and category stored in metadata)
            const avgSentiment = signals.reduce((sum, s) => sum + (s.metadata?.sentiment || 0), 0) / signals.length;
            const categoryCounts = {};
            signals.forEach(s => {
                const cat = s.metadata?.category || s.type;
                categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
            });

            // Get top category
            const topCategory = Object.entries(categoryCounts)
                .sort((a, b) => b[1] - a[1])[0];

            // Check for sentiment issues
            const lowSentiment = signals.filter(s => (s.metadata?.sentiment || 0) < -0.5).length;
            const sentimentAlert = avgSentiment < this.config.sentimentThreshold;

            const insights = {
                week_start: weekAgo,
                sample_size: signals.length,
                avg_sentiment: Math.round(avgSentiment * 100) / 100,
                sentiment_trend: avgSentiment > 0 ? 'positive' : avgSentiment < 0 ? 'negative' : 'neutral',
                top_category: topCategory[0],
                category_breakdown: categoryCounts,
                concerns_count: lowSentiment,
                alert: sentimentAlert
            };

            // Log insights
            await this.logAction('generate_insights', {
                week: weekAgo,
                signals_analyzed: signals.length
            }, insights, {
                confidence: signals.length >= 20 ? 0.9 : 0.7,
                reasoning: `Analyzed ${signals.length} signals over past week. Average sentiment: ${insights.avg_sentiment}.`
            });

            // Alert if sentiment is negative
            if (sentimentAlert) {
                console.log('[CommunityAgent] ⚠️ Negative sentiment detected!');
            }

            return insights;
        } catch (error) {
            console.error('[CommunityAgent] Error generating insights:', error);
            throw error;
        }
    }

    /**
     * Hash content for anonymization
     */
    hashContent(content) {
        // Simple hash for demo (use crypto in production)
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }

    /**
     * Run the agent
     */
    async run() {
        console.log('[CommunityAgent] Starting community analysis...');

        try {
            // Generate weekly insights
            const insights = await this.generateWeeklyInsights();
            
            console.log('[CommunityAgent] Insights generated:', insights);

            return {
                status: 'completed',
                insights
            };
        } catch (error) {
            console.error('[CommunityAgent] Run failed:', error);
            throw error;
        }
    }
}

export default CommunityAgent;
