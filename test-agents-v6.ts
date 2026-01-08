#!/usr/bin/env tsx
/**
 * Test script for AI SDK 6 agents
 * Usage: npx tsx test-agents-v6.ts
 */

import { partnershipAgent } from './packages/agents/src/agents-v6/partnership-agent';
import { financialAgent } from './packages/agents/src/agents-v6/financial-agent';
import { contentAgent } from './packages/agents/src/agents-v6/content-agent';

async function testPartnershipAgent() {
  console.log('\n🤝 Testing Partnership Agent...\n');
  
  const result = await partnershipAgent.generate({
    prompt: 'Find potential hydropower engineering partners with African experience for a 500MW project',
    options: {
      urgency: 'high',
      maxPartners: 3,
      includeOutreach: true,
    },
  });

  console.log('✅ Partnership Agent Result:');
  console.log(JSON.stringify(result.output, null, 2));
  console.log('\nTokens used:', result.usage?.totalTokens);
}

async function testFinancialAgent() {
  console.log('\n💰 Testing Financial Agent...\n');
  
  const result = await financialAgent.generate({
    prompt: 'Analyze Phase 0 funding scenario: $500k over 6 months at 5% interest',
    options: {
      riskTolerance: 'moderate',
      confidentialityLevel: 'internal',
    },
  });

  console.log('✅ Financial Agent Result:');
  console.log(JSON.stringify(result.output, null, 2));
  console.log('\nTokens used:', result.usage?.totalTokens);
}

async function testContentAgent() {
  console.log('\n📝 Testing Content Agent...\n');
  
  const result = await contentAgent.generate({
    prompt: 'Create a content strategy for announcing Phase 0 completion to investors',
    options: {
      targetAudience: ['investors', 'partners'],
      contentPriority: 'quality',
      brandVoice: 'visionary',
    },
  });

  console.log('✅ Content Agent Result:');
  console.log(JSON.stringify(result.output, null, 2));
  console.log('\nTokens used:', result.usage?.totalTokens);
}

async function main() {
  console.log('🚀 Ubuntu Initiative - AI SDK 6 Agents Test\n');
  console.log('Testing all agents with real prompts...\n');
  
  try {
    await testPartnershipAgent();
    await testFinancialAgent();
    await testContentAgent();
    
    console.log('\n✅ All agents tested successfully!');
    console.log('\nNext steps:');
    console.log('1. Start DevTools: npx @ai-sdk/devtools');
    console.log('2. Test investor agent with DevTools enabled');
    console.log('3. Implement approval queue UI for financial agent');
    console.log('4. Deploy to Vercel');
    
  } catch (error) {
    console.error('\n❌ Error testing agents:', error);
    process.exit(1);
  }
}

main();
