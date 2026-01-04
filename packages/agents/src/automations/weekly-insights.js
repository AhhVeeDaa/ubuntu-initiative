/**
 * Automation: Weekly Community Insights Report
 * Runs every Sunday at 18:00 UTC
 */

import { CommunityAgent } from '../agents/community-agent.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

async function runWeeklyInsights() {
    console.log('🤖 [Automation] Weekly Community Insights Report');
    console.log(`Started at: ${new Date().toISOString()}\n`);

    try {
        // Initialize agent
        const agent = new CommunityAgent();
        
        // Generate insights
        const insights = await agent.generateWeeklyInsights();
        
        if (insights.status === 'insufficient_data') {
            console.log(`⚠️ Insufficient data (${insights.sample_size} signals, need ${insights.required})`);
            return {
                status: 'skipped',
                reason: 'insufficient_data',
                insights
            };
        }

        // Format insights for email
        const report = formatReport(insights);
        
        console.log('\n📊 Insights Generated:');
        console.log(report);

        // In production, this would send email to leadership
        // For now, just log and store in database
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        // Store report
        const { error } = await supabase
            .from('insight_summaries')
            .insert({
                trend: insights.sentiment_trend,
                evidence: insights,
                confidence: insights.sample_size >= 20 ? 0.9 : 0.7,
                recommendation: generateRecommendations(insights)
            });

        if (error) {
            console.error('Error storing insights:', error);
        }

        console.log('\n✅ Weekly insights report completed');
        return {
            status: 'completed',
            insights
        };
    } catch (error) {
        console.error('❌ Automation failed:', error);
        throw error;
    }
}

function formatReport(insights) {
    return `
WEEKLY COMMUNITY INSIGHTS REPORT
Week starting: ${insights.week_start}
Sample size: ${insights.sample_size} community signals

SENTIMENT ANALYSIS
Average sentiment: ${insights.avg_sentiment} (${insights.sentiment_trend})
Concerns flagged: ${insights.concerns_count}
Alert status: ${insights.alert ? '🚨 NEGATIVE TREND DETECTED' : '✅ Normal'}

CATEGORY BREAKDOWN
${Object.entries(insights.category_breakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => `- ${cat}: ${count} (${(count / insights.sample_size * 100).toFixed(1)}%)`)
    .join('\n')}

TOP CATEGORY: ${insights.top_category}

RECOMMENDATIONS
${generateRecommendations(insights)}
`;
}

function generateRecommendations(insights) {
    const recs = [];

    if (insights.alert) {
        recs.push('⚠️ PRIORITY: Address negative sentiment trend. Review recent concerns.');
    }

    if (insights.concerns_count > insights.sample_size * 0.2) {
        recs.push('📢 High concern volume. Consider community Q&A session.');
    }

    if (insights.top_category === 'question') {
        recs.push('❓ Many questions. Update FAQ or schedule community call.');
    }

    if (insights.top_category === 'funding') {
        recs.push('💰 Strong funding interest. Highlight donation opportunities.');
    }

    if (recs.length === 0) {
        recs.push('✅ Community sentiment is healthy. Continue current engagement strategy.');
    }

    return recs.join('\n');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runWeeklyInsights()
        .then(result => {
            console.log('\nResult:', result);
            process.exit(0);
        })
        .catch(error => {
            console.error('\nFailed:', error);
            process.exit(1);
        });
}

export { runWeeklyInsights };
