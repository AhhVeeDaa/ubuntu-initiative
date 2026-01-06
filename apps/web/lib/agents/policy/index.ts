// Ubuntu Initiative - Policy Agent
// Main agent class for policy monitoring

import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseAgent, AgentInput, AgentOutput } from '../base';
import { POLICY_AGENT_SYSTEM_PROMPT } from './prompt';
import type {
  PolicyAgentConfig,
  PolicySource,
  GeminiPolicyAnalysis
} from './types';

export class PolicyAgent extends BaseAgent {
  private gemini: GoogleGenerativeAI;
  private policyConfig: PolicyAgentConfig;
  private runId: string | null = null;
  private startTime: number = 0;

  constructor(config: PolicyAgentConfig) {
    super({
      id: config.agentId || 'agent_001',
      name: 'Policy Monitor Agent',
      version: config.version || '1.0.0',
      autonomyLevel: 'semi-autonomous'
    });
    this.policyConfig = config;
    const apiKey = process.env.GOOGLE_AI_API_KEY || 'MOCK_KEY';
    if (!apiKey && !config.dryRun) {
      console.warn('GOOGLE_AI_API_KEY is missing. Policy Agent will run in mock analysis mode.');
    }
    this.gemini = new GoogleGenerativeAI(apiKey || 'MOCK_KEY');
  }

  async execute(input: AgentInput): Promise<AgentOutput> {
    this.startTime = Date.now();
    try {
      switch (input.trigger) {
        case 'manual':
        case 'scheduled':
        case 'api':
          return await this.runLegacy(input.trigger, (input.data as any)?.triggeredBy);
        default:
          return {
            success: false,
            requiresReview: false,
            errors: [`Unknown trigger: ${input.trigger}`]
          };
      }
    } catch (error) {
      return {
        success: false,
        requiresReview: true,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Main agent execution method (Legacy name kept for compatibility)
   */
  private async runLegacy(
    triggerType: 'scheduled' | 'manual' | 'api',
    triggerBy?: string
  ): Promise<AgentOutput> {
    try {
      // 1. Initialize run (simplified for BaseAgent usage)
      this.runId = crypto.randomUUID();

      // 2. Fetch policy sources
      const sources = await this.fetchPolicySources();

      // 3. Process each source
      const results = [];
      const errors = [];

      for (const source of sources) {
        try {
          const result = await this.processSource(source);
          if (result) {
            results.push(result);
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`Error processing source ${source.name}:`, errorMessage);
          errors.push(errorMessage);
        }
      }

      const success = errors.length === 0;

      return {
        success,
        data: {
          runId: this.runId,
          itemsProcessed: results.length,
          results
        },
        requiresReview: results.some(r => r.risk_flag || r.confidence_score < 0.7),
        errors: errors.length > 0 ? errors : undefined
      };

    } catch (error: unknown) {
      console.error('Critical agent error:', error);
      throw error;
    }
  }

  private async fetchPolicySources(): Promise<PolicySource[]> {
    const sources: PolicySource[] = [
      {
        name: 'DRC Ministry of Hydraulic Resources',
        url: 'https://minrhese.gouv.cd/policy/hydropower-framework-2024',
        type: 'manual',
        region: 'DRC',
        date: new Date().toISOString(),
        content: 'The Ministry announces a new regulatory framework for independent power producers (IPPs) focusing on grand hydropower projects like Inga. The framework emphasizes sovereign data control and priority grid access for industrial anchor tenants.'
      },
      {
        name: 'African Union AI Task Force',
        url: 'https://au.int/en/pressreleases/ai-infrastructure-standards',
        type: 'manual',
        region: 'REGIONAL',
        date: new Date().toISOString(),
        content: 'New continental guidelines for sovereign AI infrastructure. Member states are encouraged to host high-performance computing centers powered by renewable energy to ensure data sovereignty and environmental sustainability.'
      },
      {
        name: 'South Africa-DRC Energy Cooperation',
        url: 'https://energy.gov.za/agreements/drc-partnership',
        type: 'manual',
        region: 'SOUTH AFRICA',
        date: new Date().toISOString(),
        content: 'Joint communique regarding the Grand Inga project. Both nations agree to revitalize the Treaty on the Inga Hydropower Project, with a focus on creating a digital "Energy-to-Compute" corridor.'
      },
      {
        name: 'World Bank DRC Infrastructure Report',
        url: 'https://worldbank.org/reports/drc-energy-2025',
        type: 'manual',
        region: 'DRC',
        date: new Date().toISOString(),
        content: 'Recent analysis suggests that Inga 3 construction viability increases by 40% when paired with high-uptime industrial loads such as global-scale data centers.'
      }
    ];

    await this.logAudit({
      action_type: 'source_fetch',
      input_data: null,
      output_data: { source_count: sources.length },
      human_review_status: 'not_required',
      reasoning: 'Fetching curated regional policy and infrastructure monitor sources.'
    });

    return sources;
  }

  private async processSource(source: PolicySource): Promise<any> {
    const content = source.content || 'No content provided';

    // Analyze with Gemini
    const analysis = await this.analyzeWithGemini(content, source);

    // Apply relevance filter
    const threshold = this.policyConfig.relevanceThreshold || 0.4;
    if (analysis.relevance_score < threshold) {
      await this.logAudit({
        action_type: 'relevance_filter',
        input_data: { source: source.name, score: analysis.relevance_score },
        output_data: { action: 'skipped' },
        human_review_status: 'not_required',
        reasoning: `Relevance score ${analysis.relevance_score} below threshold ${threshold}`
      });
      return null;
    }

    // Write to database
    const policyUpdateId = await this.writePolicyUpdate(analysis, source);

    // Add to approval queue
    await this.addToApprovalQueue(
      'policy',
      policyUpdateId,
      analysis,
      analysis.risk_flag ? 'high' : 'medium'
    );

    await this.logAudit({
      action_type: 'policy_analyzed',
      input_data: { source: source.name },
      output_data: analysis,
      confidence_score: analysis.confidence_score,
      human_review_status: analysis.risk_flag ? 'pending' : 'not_required',
      reasoning: analysis.reasoning
    });

    return analysis;
  }

  private async writePolicyUpdate(
    analysis: GeminiPolicyAnalysis,
    source: PolicySource
  ): Promise<string> {
    const { data, error } = await this.supabase
      .from('policy_updates')
      .insert({
        headline: analysis.headline,
        summary: analysis.summary,
        source_url: source.url,
        source_name: source.name,
        jurisdiction: analysis.jurisdiction,
        policy_category: analysis.policy_category,
        relevance_score: analysis.relevance_score,
        confidence_score: analysis.confidence_score,
        risk_flag: analysis.risk_flag,
        risk_notes: analysis.risk_notes,
        publication_date: source.date || new Date().toISOString(),
        status: 'pending'
      } as any)
      .select('id')
      .single();

    if (error) {
      console.error('Failed to write policy update:', error);
      throw new Error('Failed to write policy update to database');
    }

    return (data as any).id;
  }

  private async analyzeWithGemini(
    content: string,
    source: PolicySource
  ): Promise<GeminiPolicyAnalysis> {
    // Fallback for missing API key
    if (process.env.GOOGLE_AI_API_KEY === undefined || process.env.GOOGLE_AI_API_KEY === '') {
      return {
        headline: `Analysis of ${source.name}`,
        summary: `MOCK ANALYSIS: ${content.substring(0, 100)}...`,
        jurisdiction: source.region || 'DRC',
        policy_category: 'energy_generation',
        relevance_score: 0.85,
        confidence_score: 0.9,
        risk_flag: false,
        risk_notes: null,
        reasoning: 'API Key missing, providing simulated high-relevance analysis for demo.'
      };
    }

    // Analyze with Gemini
    const model = this.gemini.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json'
      }
    });

    const prompt = `${POLICY_AGENT_SYSTEM_PROMPT}

# INPUT
Source: ${source.name}
URL: ${source.url}
Date: ${source.date || new Date().toISOString()}

Content:
${content}

# ANALYZE`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text) as GeminiPolicyAnalysis;
    } catch (error) {
      console.error('Gemini Analysis Failed:', error);
      throw new Error(`Policy analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
