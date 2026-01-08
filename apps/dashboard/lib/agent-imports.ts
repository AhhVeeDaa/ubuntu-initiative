/**
 * Agent Imports Helper
 * Centralized imports for all agent classes
 * Handles cross-app imports from web to dashboard
 */

// Import agent types from web app
// Using relative path since agents live in web/lib/agents
export type { AgentInput, AgentOutput } from '../../../web/lib/agents/base';

/**
 * Dynamically import agent classes
 * This avoids build-time bundling issues in the monorepo
 */

export async function importFundingAgent() {
  const { FundingGrantAgent } = await import('../../../web/lib/agents/funding-grant-agent');
  return FundingGrantAgent;
}

export async function importMilestoneAgent() {
  const { ProgressMilestoneAgent } = await import('../../../web/lib/agents/progress-milestone-agent');
  return ProgressMilestoneAgent;
}

export async function importPolicyAgent() {
  const { PolicyAgent } = await import('../../../web/lib/agents/policy-agent');
  return PolicyAgent;
}

/**
 * Import BaseAgent for type checking
 */
export async function importBaseAgent() {
  const { BaseAgent } = await import('../../../web/lib/agents/base');
  return BaseAgent;
}
