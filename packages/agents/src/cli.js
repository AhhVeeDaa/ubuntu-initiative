/**
 * Agent CLI - Test and run agents
 */

import { FundingAgent } from './agents/funding-agent.js';
import { MilestoneAgent } from './agents/milestone-agent.js';
import { PolicyAgent } from './agents/policy-agent.js';
import { CommunityAgent } from './agents/community-agent.js';
import { NarrativeAgent } from './agents/narrative-agent.js';

const commands = {
    'test:funding': async () => {
        console.log('🧪 Testing Funding Agent...\n');
        const agent = new FundingAgent();
        
        const result = await agent.run();
        console.log('✅ Agent initialized:', result);
        
        console.log('\n📊 Testing fraud detection...');
        const testDonation = {
            amount: 5000,
            donor_email: 'test@example.com'
        };
        const fraudStatus = await agent.checkFraud(testDonation);
        console.log(`Fraud status for $${testDonation.amount}:`, fraudStatus);
        
        return { success: true };
    },

    'test:milestone': async () => {
        console.log('🧪 Testing Milestone Agent...\n');
        const agent = new MilestoneAgent();
        
        const result = await agent.run();
        console.log('✅ Agent initialized:', result);
        
        console.log('\n📊 Testing milestone validation...');
        const testMilestone = {
            title: 'Test Milestone: Policy Agent Deployed',
            description: 'Successfully deployed the Policy Tracking Agent with automated relevance scoring and high-impact detection for policy changes affecting the initiative.',
            category: 'technical',
            completion_date: new Date().toISOString(),
            evidence_url: 'https://github.com/ubuntu-initiative/commit/abc123'
        };
        
        const validation = await agent.validateMilestone(testMilestone);
        console.log('Validation result:', validation);
        
        if (validation.valid) {
            console.log('✅ Milestone would be processed');
            console.log(`Confidence: ${validation.confidence}`);
            console.log(`Auto-publish: ${validation.confidence >= agent.config.autoPublishThreshold}`);
        }
        
        return { success: true, validation };
    },

    'test:policy': async () => {
        console.log('🧪 Testing Policy Agent...\n');
        const agent = new PolicyAgent();
        
        const result = await agent.run();
        console.log('✅ Agent run completed:', result);
        
        console.log('\n📊 Testing relevance scoring...');
        const testPolicy = {
            title: 'DRC Government Announces New Renewable Energy Strategy',
            source: 'DRC Ministry of Energy',
            source_url: 'https://example.com/policy',
            publication_date: new Date().toISOString().split('T')[0],
            summary: 'The Democratic Republic of Congo has unveiled a comprehensive renewable energy strategy focusing on hydropower development, including projects at the Inga Dam site.',
            keywords: ['drc', 'renewable', 'hydropower', 'inga']
        };
        
        const relevance = agent.calculateRelevance(testPolicy);
        console.log('Relevance analysis:', relevance);
        console.log(`Score: ${relevance.score} (${relevance.matches} keyword matches)`);
        console.log(`High-impact: ${relevance.score >= agent.config.highImpactThreshold ? 'YES' : 'NO'}`);
        
        return { success: true, relevance };
    },

    'test:community': async () => {
        console.log('🧪 Testing Community Agent...\n');
        const agent = new CommunityAgent();
        
        const result = await agent.run();
        console.log('✅ Agent run completed:', result);
        
        console.log('\n📊 Testing sentiment analysis...');
        const testMessages = [
            'This initiative is amazing! Great progress on transparency.',
            'I have concerns about the timeline and funding.',
            'Excellent work on the milestone tracking system!'
        ];
        
        testMessages.forEach(msg => {
            const sentiment = agent.analyzeSentiment(msg);
            const category = agent.categorizeSignal(msg);
            console.log(`\nMessage: "${msg.substring(0, 50)}..."`);
            console.log(`Sentiment: ${sentiment} (${sentiment > 0 ? 'positive' : sentiment < 0 ? 'negative' : 'neutral'})`);
            console.log(`Category: ${category}`);
        });
        
        return { success: true };
    },

    'test:narrative': async () => {
        console.log('🧪 Testing Narrative Agent...\n');
        const agent = new NarrativeAgent();
        
        const result = await agent.run();
        console.log('✅ Agent initialized:', result);
        
        console.log('\n📊 Testing content validation...');
        const testContents = [
            'Just completed Phase 0 database migration! Check out the evidence: https://github.com/commit/123',
            'We will be the best initiative in Africa with the greatest impact!', // Should fail (superlatives without data)
            'Coming soon in Phase 2: AI supercomputer deployment' // Should fail (future phase)
        ];
        
        testContents.forEach((content, i) => {
            const validation = agent.validateContent(content);
            console.log(`\nTest ${i + 1}: "${content.substring(0, 50)}..."`);
            console.log(`Valid: ${validation.valid}`);
            console.log(`Confidence: ${validation.confidence}`);
            if (validation.issues.length > 0) {
                console.log(`Issues: ${validation.issues.join(', ')}`);
            }
        });
        
        return { success: true };
    },

    'test:all': async () => {
        console.log('🧪 Running all agent tests...\n');
        
        await commands['test:funding']();
        console.log('\n' + '='.repeat(60) + '\n');
        
        await commands['test:milestone']();
        console.log('\n' + '='.repeat(60) + '\n');
        
        await commands['test:policy']();
        console.log('\n' + '='.repeat(60) + '\n');
        
        await commands['test:community']();
        console.log('\n' + '='.repeat(60) + '\n');
        
        await commands['test:narrative']();
        
        console.log('\n✅ All tests completed');
        return { success: true };
    },

    'run:policy': async () => {
        console.log('🚀 Running Policy Agent...\n');
        const agent = new PolicyAgent();
        const result = await agent.run();
        console.log('\n✅ Policy Agent completed:', result);
        return { success: true, result };
    },

    'run:community': async () => {
        console.log('🚀 Running Community Agent...\n');
        const agent = new CommunityAgent();
        const result = await agent.run();
        console.log('\n✅ Community Agent completed:', result);
        return { success: true, result };
    },

    'help': () => {
        console.log(`
Ubuntu Initiative Agent CLI

TEST COMMANDS:
  test:funding     - Test Funding & Grant Agent
  test:milestone   - Test Progress Milestone Agent
  test:policy      - Test Policy Tracking Agent (NEW)
  test:community   - Test Community Signal Agent (NEW)
  test:narrative   - Test Narrative & Messaging Agent (NEW)
  test:all         - Run all tests

RUN COMMANDS:
  run:policy       - Run Policy Agent (fetch and process policies)
  run:community    - Run Community Agent (generate insights)

UTILITY:
  help            - Show this help message

Environment variables required:
  SUPABASE_URL
  SUPABASE_SERVICE_KEY
  GEMINI_API_KEY
  STRIPE_SECRET_KEY

Example:
  node src/cli.js test:policy
  node src/cli.js run:community
        `);
        return { success: true };
    }
};

// Main
const command = process.argv[2] || 'help';

if (!commands[command]) {
    console.error(`❌ Unknown command: ${command}`);
    console.log('Run "node src/cli.js help" for available commands');
    process.exit(1);
}

commands[command]()
    .then(result => {
        if (result.success) {
            console.log('\n✅ Command completed successfully');
            process.exit(0);
        } else {
            console.error('\n❌ Command failed');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    });
