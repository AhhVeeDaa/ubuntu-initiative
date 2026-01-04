/**
 * Automation: Daily Policy Dashboard Update
 * Runs daily at 06:00 UTC
 */

import { PolicyAgent } from '../agents/policy-agent.js';
import dotenv from 'dotenv';

dotenv.config();

async function runDailyPolicyUpdate() {
    console.log('🤖 [Automation] Daily Policy Dashboard Update');
    console.log(`Started at: ${new Date().toISOString()}\n`);

    try {
        // Initialize and run policy agent
        const agent = new PolicyAgent();
        const result = await agent.run();

        console.log('\n📊 Policy Scan Results:');
        console.log(`- Processed: ${result.processed} policies`);
        console.log(`- High-impact: ${result.high_impact} requiring review`);
        console.log(`- Auto-published: ${result.processed - result.high_impact}`);

        // Summary
        if (result.high_impact > 0) {
            console.log('\n⚠️ High-impact policies detected - review required');
        } else {
            console.log('\n✅ All policies processed automatically');
        }

        console.log('\n✅ Daily policy update completed');
        return {
            status: 'completed',
            ...result
        };
    } catch (error) {
        console.error('❌ Automation failed:', error);
        throw error;
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runDailyPolicyUpdate()
        .then(result => {
            console.log('\nResult:', result);
            process.exit(0);
        })
        .catch(error => {
            console.error('\nFailed:', error);
            process.exit(1);
        });
}

export { runDailyPolicyUpdate };
