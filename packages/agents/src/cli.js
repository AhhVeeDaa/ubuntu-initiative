/**
 * Agent CLI - Test and run agents
 */

import { FundingAgent } from './agents/funding-agent.js';
import { MilestoneAgent } from './agents/milestone-agent.js';

const commands = {
    'test:funding': async () => {
        console.log('🧪 Testing Funding Agent...\n');
        const agent = new FundingAgent();
        
        // Test initialization
        const result = await agent.run();
        console.log('✅ Agent initialized:', result);
        
        // Test fraud check
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
        
        // Test initialization
        const result = await agent.run();
        console.log('✅ Agent initialized:', result);
        
        // Test validation
        console.log('\n📊 Testing milestone validation...');
        const testMilestone = {
            title: 'Test Milestone: Database Schema Deployed',
            description: 'Successfully deployed the initial database schema for the agent system with all required tables and RLS policies.',
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

    'test:all': async () => {
        console.log('🧪 Running all agent tests...\n');
        
        await commands['test:funding']();
        console.log('\n' + '='.repeat(60) + '\n');
        await commands['test:milestone']();
        
        console.log('\n✅ All tests completed');
        return { success: true };
    },

    'help': () => {
        console.log(`
Ubuntu Initiative Agent CLI

Commands:
  test:funding    - Test Funding & Grant Agent
  test:milestone  - Test Progress Milestone Agent
  test:all        - Run all tests
  help            - Show this help message

Environment variables required:
  SUPABASE_URL
  SUPABASE_SERVICE_KEY
  GEMINI_API_KEY
  STRIPE_SECRET_KEY

Example:
  node src/cli.js test:milestone
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
        process.exit(1);
    });
