// Ubuntu Initiative - Policy Agent
// Main agent class for policy monitoring

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { POLICY_AGENT_SYSTEM_PROMPT } from './prompt';
import type { 
  PolicyAgentConfig, 
  PolicySource, 
  GeminiPolicyAnalysis,
  AgentRunResult 
} from './types';

export class PolicyAgent {
  private supabase;
  private gemini;
  private config: PolicyAgentConfig;
  private runId: string | null = null;
  private startTime: number = 0;

  constructor(config: PolicyAgentConfig) {
    this.config = config;
    
    // Initialize Supabase with service role key
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    
    // Initialize Gemini
    this.gemini = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  }

  /**
   * Main agent execution method
   */
  async run(
    triggerType: 'scheduled' | 'manual' | 'api',
    triggerBy?: string
  ): Promise<AgentRunResult> {
    this.startTime = Date.now();
    
    try {
      // 1. Initialize run
      this.runId = await this.initializeRun(triggerType, triggerBy);
      
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
        } catch (error: any) {
          console.error(`Error processing source ${source.name}:`, error);
          errors.push(error.message);
          await this.logError(source, error);
        }
      }
      
      // 4. Finalize run
      const status = errors.length > 0 
        ? (results.length > 0 ? 'partial' : 'failed')
        : 'success';
      
      await this.finalizeRun(status, sources.length, results.length);
      
      return {
        status,
        runId: this.runId,
        itemsProcessed: results.length,
        errors: errors.length > 0 ? errors : undefined
      };
      
    } catch (error: any) {
      console.error('Critical agent error:', error);
      await this.finalizeRun('failed', 0, 0);
      throw error;
    }
  }

  /**
   * Initialize agent run and return run ID
   */
  private async initializeRun(
    triggerType: string, 
    triggerBy?: string
  ): Promise<string> {
    const { data, error } = await this.supabase
      .from('agent_runs')
      .insert({
        agent_id: this.config.agentId,
        agent_version: this.config.version,
        trigger_type: triggerType,
        trigger_by: triggerBy,
        status: 'running',
        started_at: new Date().toISOString(),
        config_snapshot: this.config
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Failed to initialize run:', error);
      throw new Error('Failed to initialize agent run');
    }
    
    return data.id;
  }

  /**
   * Fetch policy sources to monitor
   * Phase 0: Start with curated manual sources
   */
  private async fetchPolicySources(): Promise<PolicySource[]> {
    // For Phase 0: Manually curated sources
    // Future: RSS feeds, APIs, web scraping
    
    const sources: PolicySource[] = [
      {
        name: 'DRC Energy Policy Example',
        url: 'https://example.com/drc-energy-policy',
        type: 'manual',
        region: 'DRC',
        date: new Date().toISOString(),
        content: 'The Democratic Republic of Congo announces new framework for private hydropower investment...'
      }
    ];
    
    await this.logAction('source_fetch', {
      source_count: sources.length,
      sources: sources.map(s => s.name)
    });
    
    return sources;
  }

  /**
   * Process a single policy source
   */
  private async processSource(source: PolicySource): Promise<any> {
    // 1. Fetch content (for Phase 0, using manual content)
    const content = source.content || await this.fetchContent(source);
    
    // 2. Analyze with Gemini
    await this.logAction('gemini_analysis', { source: source.name });
    const analysis = await this.analyzeWithGemini(content, source);
    
    // 3. Apply relevance filter
    const threshold = this.config.relevanceThreshold || 0.4;
    if (analysis.relevance_score < threshold) {
      await this.logAction('relevance_filter', {
        reason: 'Below threshold',
        score: analysis.relevance_score,
        threshold
      });
      return null;
    }
    
    // 4. Write to database
    const policyUpdateId = await this.writePolicyUpdate(analysis, source);
    
    // 5. Add to approval queue
    await this.addToApprovalQueue(policyUpdateId, analysis);
    
    return analysis;
  }

  /**
   * Fetch content from source
   */
  private async fetchContent(source: PolicySource): Promise<string> {
    // Phase 0: Using provided content
    // Future: Implement actual fetching based on source.type
    if (source.content) {
      return source.content;
    }
    
    // Placeholder for future implementation
    return 'Policy content would be fetched here in production';
  }

  /**
   * Analyze content with Gemini
   */
  private async analyzeWithGemini(
    content: string, 
    source: PolicySource
  ): Promise<GeminiPolicyAnalysis> {
    const model = this.gemini.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.1, // Low temperature for consistency
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
      
      // Parse JSON response
      const parsed = JSON.parse(text) as GeminiPolicyAnalysis;
      
      await this.logAction('gemini_analysis', {
        input_length: content.length,
        output: parsed,
        confidence: parsed.confidence_score
      });
      
      return parsed;
      
    } catch (error: any) {
      await this.logError(
        { type: 'gemini_parse_error', source: source.name },
        error
      );
      throw new Error(`Failed to analyze with Gemini: ${error.message}`);
    }
  }

  /**
   * Write policy update to database
   */
  private async writePolicyUpdate(
    analysis: GeminiPolicyAnalysis,
    source: PolicySource
  ): Promise<string> {
    const { data, error } = await this.supabase
      .from('policy_updates')
      .insert({
        agent_run_id: this.runId,
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
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Failed to write policy update:', error);
      throw new Error('Failed to write policy update to database');
    }
    
    await this.logAction('database_write', {
      policy_update_id: data.id,
      headline: analysis.headline
    });
    
    return data.id;
  }

  /**
   * Add item to approval queue
   */
  private async addToApprovalQueue(
    policyUpdateId: string,
    analysis: GeminiPolicyAnalysis
  ): Promise<void> {
    // Determine priority based on scores and flags
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
    let priorityReason = 'Standard policy update';
    
    if (analysis.confidence_score < 0.5 || analysis.risk_flag) {
      priority = 'urgent';
      priorityReason = analysis.risk_flag
        ? 'Risk flag detected'
        : 'Low confidence score';
    } else if (analysis.relevance_score > 0.8 && analysis.confidence_score > 0.7) {
      priority = 'high';
      priorityReason = 'High relevance and confidence';
    } else if (analysis.relevance_score < 0.5) {
      priority = 'low';
      priorityReason = 'Lower relevance score';
    }
    
    // Set auto-expire date (7 days from now)
    const autoExpireAt = new Date();
    autoExpireAt.setDate(autoExpireAt.getDate() + 7);
    
    const { error } = await this.supabase
      .from('approval_queue')
      .insert({
        item_type: 'policy_update',
        item_id: policyUpdateId,
        agent_recommendation: analysis,
        priority,
        priority_reason: priorityReason,
        auto_expire_at: autoExpireAt.toISOString(),
        status: 'pending'
      });
    
    if (error) {
      console.error('Failed to add to approval queue:', error);
      throw new Error('Failed to add to approval queue');
    }
    
    await this.logAction('approval_queue', { priority, policyUpdateId });
  }

  /**
   * Log an action to audit trail
   */
  private async logAction(actionType: string, context: any): Promise<void> {
    try {
      await this.supabase
        .from('agent_audit_log')
        .insert({
          agent_run_id: this.runId,
          agent_id: this.config.agentId,
          action_type: actionType,
          action_description: this.getActionDescription(actionType, context),
          input_data: context.input || null,
          output_data: context.output || context,
          confidence_score: context.confidence || null,
          reasoning: context.reason || context.reasoning || null,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log action:', error);
      // Don't throw - logging failure shouldn't stop agent
    }
  }

  /**
   * Log an error
   */
  private async logError(context: any, error: any): Promise<void> {
    try {
      await this.supabase
        .from('agent_audit_log')
        .insert({
          agent_run_id: this.runId,
          agent_id: this.config.agentId,
          action_type: 'error_handled',
          action_description: `Error: ${error.message}`,
          input_data: context,
          output_data: { error: error.message, stack: error.stack },
          timestamp: new Date().toISOString()
        });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  /**
   * Get human-readable action description
   */
  private getActionDescription(actionType: string, context: any): string {
    const descriptions: Record<string, string> = {
      source_fetch: `Fetched ${context.source_count || 1} policy sources`,
      gemini_analysis: `Analyzed content from ${context.source || 'source'}`,
      relevance_filter: `Filtered: ${context.reason} (score: ${context.score})`,
      database_write: `Created policy update: ${context.headline || 'untitled'}`,
      approval_queue: `Added to ${context.priority} priority queue`,
      error_handled: `Handled error: ${context.message || 'unknown'}`
    };
    
    return descriptions[actionType] || `Performed ${actionType}`;
  }

  /**
   * Finalize agent run
   */
  private async finalizeRun(
    status: string,
    itemsFound: number,
    itemsProcessed: number
  ): Promise<void> {
    const duration = Date.now() - this.startTime;
    
    try {
      await this.supabase
        .from('agent_runs')
        .update({
          status,
          items_found: itemsFound,
          items_processed: itemsProcessed,
          items_written: itemsProcessed, // For policy agent, processed = written
          completed_at: new Date().toISOString(),
          duration_ms: duration
        })
        .eq('id', this.runId);
    } catch (error) {
      console.error('Failed to finalize run:', error);
    }
  }
}
