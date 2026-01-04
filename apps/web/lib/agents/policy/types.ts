// Ubuntu Initiative - Policy Agent Types
// TypeScript type definitions for the Policy Agent

export interface PolicyAgentConfig {
  agentId: string;
  version: string;
  dryRun: boolean;
  maxSources?: number;
  relevanceThreshold?: number;
}

export interface PolicySource {
  name: string;
  url: string;
  type: 'rss' | 'api' | 'scrape' | 'manual';
  region?: string;
  date?: string;
  content?: string;
}

export interface GeminiPolicyAnalysis {
  headline: string;
  summary: string;
  jurisdiction: string;
  policy_category: PolicyCategory;
  relevance_score: number;
  confidence_score: number;
  risk_flag: boolean;
  risk_notes: string | null;
  reasoning: string;
}

export type PolicyCategory =
  | 'energy_generation'
  | 'hydropower_specific'
  | 'ai_governance'
  | 'infrastructure_investment'
  | 'data_sovereignty'
  | 'cross_border_trade'
  | 'environmental_regulation'
  | 'foreign_investment';

export type PolicyStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'revised' 
  | 'superseded';

export interface AgentRunResult {
  status: 'success' | 'partial' | 'failed';
  runId: string;
  itemsProcessed: number;
  errors?: string[];
}
