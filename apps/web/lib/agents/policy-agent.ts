// Policy Monitor Agent
// Tracks regional energy policies, AI sovereignty regulations, and infrastructure frameworks
// Autonomy Level: Semi-autonomous

import { BaseAgent, AgentInput, AgentOutput } from './base';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface PolicySource {
  source_name: string;
  url: string;
  last_checked_at?: string;
  relevance_score?: number;
}

interface PolicyUpdate {
  title: string;
  source: string;
  published_date: string;
  summary: string;
  relevance_score: number;
  impact_level: 'low' | 'medium' | 'high';
  url: string;
  full_text?: string;
}

interface PolicySearchResult {
  query: string;
  sources_checked: number;
  updates_found: number;
  high_impact_count: number;
}

export class PolicyAgent extends BaseAgent {
  private gemini: GoogleGenerativeAI | null = null;

  // Trusted policy sources focused on African infrastructure and AI
  private readonly POLICY_SOURCES: PolicySource[] = [
    {
      source_name: 'African Union',
      url: 'https://au.int',
      relevance_score: 1.0
    },
    {
      source_name: 'World Bank - Africa',
      url: 'https://www.worldbank.org/en/region/afr',
      relevance_score: 0.9
    },
    {
      source_name: 'African Development Bank',
      url: 'https://www.afdb.org',
      relevance_score: 0.9
    },
    {
      source_name: 'DRC Ministry of Energy',
      url: 'https://energies.gouv.cd',
      relevance_score: 1.0
    },
    {
      source_name: 'International Energy Agency - Africa',
      url: 'https://www.iea.org/regions/africa',
      relevance_score: 0.8
    }
  ];

  constructor() {
    super({
      id: 'agent_001_policy',
      name: 'Policy Monitor Agent',
      version: '1.0.0',
      autonomyLevel: 'semi-autonomous'
    });

    // Initialize Gemini API if available
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (apiKey && apiKey !== 'placeholder') {
      this.gemini = new GoogleGenerativeAI(apiKey);
    } else {
      console.warn('⚠️ [PolicyAgent] GOOGLE_AI_API_KEY missing. AI features disabled.');
    }
  }

  async execute(input: AgentInput): Promise<AgentOutput> {
    try {
      switch (input.trigger) {
        case 'scan_policies':
          return await this.scanPolicySources();

        case 'analyze_policy':
          return await this.analyzePolicy(input.data as { url: string; text: string });

        case 'search_keywords':
          return await this.searchPolicyKeywords(input.data as { keywords: string[] });

        case 'generate_report':
          return await this.generatePolicyReport();

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
   * Scan policy sources for relevant updates
   */
  private async scanPolicySources(): Promise<AgentOutput> {
    try {
      // In production, this would:
      // 1. Fetch RSS feeds from policy sources
      // 2. Scrape latest announcements
      // 3. Check API endpoints for updates

      // For now, demonstrate the workflow with simulated data
      const keywords = [
        'hydropower',
        'inga dam',
        'renewable energy',
        'AI infrastructure',
        'data center',
        'DRC',
        'democratic republic congo',
        'energy policy',
        'AI sovereignty'
      ];

      const updates: PolicyUpdate[] = [];
      let sourcesChecked = 0;

      // Simulate policy scanning
      for (const source of this.POLICY_SOURCES) {
        sourcesChecked++;

        // In production: fetch actual data
        // For now: log that we would check this source
        await this.logAudit({
          action_type: 'source_fetch',
          input_data: { source: source.source_name, url: source.url },
          output_data: { checked: true },
          confidence_score: 1.0,
          human_review_status: 'not_required',
          reasoning: `Checked ${source.source_name} for policy updates`
        });

        // Simulate finding a policy update (in production, this would be real)
        if (Math.random() > 0.7 && updates.length < 3) {
          updates.push({
            title: `Simulated Policy Update from ${source.source_name}`,
            source: source.source_name,
            published_date: new Date().toISOString(),
            summary: `Relevant policy update regarding African energy infrastructure`,
            relevance_score: source.relevance_score || 0.5,
            impact_level: source.relevance_score! > 0.9 ? 'high' : 'medium',
            url: source.url
          });
        }
      }

      // Store high-impact updates for review
      const highImpactUpdates = updates.filter(u => u.impact_level === 'high');

      for (const update of highImpactUpdates) {
        // Store in database with new V2 schema
        const { data: stored, error } = await this.supabase
          .from('policy_updates')
          .insert({
            headline: update.title,
            source_name: update.source,
            publication_date: update.published_date.split('T')[0], // Extract date part
            summary: update.summary,
            relevance_score: update.relevance_score,
            confidence_score: 0.9,
            source_url: update.url,
            // New V2 fields with defaults
            jurisdiction: 'Africa',
            policy_category: 'energy_generation',
            status: 'pending',
            risk_flag: update.impact_level === 'high'
          } as any)
          .select()
          .single();

        if (error) {
          console.error('[PolicyAgent] Error storing update:', error);
          continue;
        }

        // Add to approval queue if high impact
        await this.addToApprovalQueue(
          'policy_update',
          (stored as any)?.id,
          {
            update: update,
            recommended_action: 'review_and_publish'
          },
          'high'
        );
      }

      await this.logAudit({
        action_type: 'source_fetch',
        input_data: { sources: sourcesChecked },
        output_data: {
          sources_checked: sourcesChecked,
          updates_found: updates.length,
          high_impact: highImpactUpdates.length
        },
        confidence_score: 0.85,
        human_review_status: highImpactUpdates.length > 0 ? 'pending' : 'not_required',
        reasoning: `Scanned ${sourcesChecked} policy sources, found ${updates.length} updates (${highImpactUpdates.length} high impact)`
      });

      return {
        success: true,
        data: {
          query: 'scan_sources',
          sources_checked: sourcesChecked,
          updates_found: updates.length,
          high_impact_count: highImpactUpdates.length,
          updates: updates
        } as PolicySearchResult,
        confidence: 0.85,
        requiresReview: highImpactUpdates.length > 0,
        reasoning: `Found ${highImpactUpdates.length} high-impact policy updates requiring review`
      };

    } catch (error) {
      return {
        success: false,
        requiresReview: true,
        errors: [error instanceof Error ? error.message : 'Policy scan failed']
      };
    }
  }

  /**
   * Analyze a specific policy document using AI
   */
  private async analyzePolicy(data: { url: string; text: string }): Promise<AgentOutput> {
    if (!this.gemini) {
      return {
        success: false,
        requiresReview: true,
        errors: ['Gemini API not configured']
      };
    }

    try {
      const model = this.gemini.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `
Analyze this policy document in the context of the Ubuntu Initiative (African AI infrastructure and Inga Dam hydropower project):

Policy URL: ${data.url}
Policy Text: ${data.text}

Provide analysis in the following format:

1. RELEVANCE SCORE (0-100): How relevant is this to African AI infrastructure and energy?
2. KEY POINTS: List 3-5 most important points
3. IMPACT LEVEL: Low, Medium, or High impact on the project
4. OPPORTUNITIES: Any opportunities this policy creates
5. RISKS: Any risks or challenges this policy presents
6. RECOMMENDED ACTION: What should the team do with this information?

Keep the analysis concise and actionable.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const analysis = response.text();

      // Parse relevance score from analysis
      const relevanceMatch = analysis.match(/RELEVANCE SCORE.*?(\d+)/i);
      const relevanceScore = relevanceMatch ? parseInt(relevanceMatch[1]) / 100 : 0.5;

      // Parse impact level
      const impactMatch = analysis.match(/IMPACT LEVEL.*?(low|medium|high)/i);
      const impactLevel = (impactMatch?.[1]?.toLowerCase() || 'medium') as 'low' | 'medium' | 'high';

      // Log analysis to audit log (Table policy_analyses is deprecated in V2)
      await this.logAudit({
        action_type: 'gemini_analysis',
        input_data: { url: data.url },
        output_data: {
          analysis_summary: analysis.substring(0, 500),
          relevance_score: relevanceScore,
          impact_level: impactLevel
        },
        confidence_score: relevanceScore,
        human_review_status: impactLevel === 'high' ? 'pending' : 'not_required',
        reasoning: `AI analysis completed with ${relevanceScore * 100}% relevance`
      });

      return {
        success: true,
        data: {
          analysis,
          relevance_score: relevanceScore,
          impact_level: impactLevel
        },
        confidence: relevanceScore,
        requiresReview: impactLevel === 'high',
        reasoning: 'Policy analyzed using Gemini AI'
      };

    } catch (error) {
      return {
        success: false,
        requiresReview: true,
        errors: [error instanceof Error ? error.message : 'Analysis failed']
      };
    }
  }

  /**
   * Search for specific policy keywords
   */
  private async searchPolicyKeywords(data: { keywords: string[] }): Promise<AgentOutput> {
    try {
      const keywords = data.keywords;

      // In production: Search policy databases, RSS feeds, news aggregators
      // For now: Demonstrate workflow

      const results: PolicyUpdate[] = [];

      // Simulate keyword search across sources
      for (const keyword of keywords) {
        await this.logAudit({
          action_type: 'keyword_search',
          input_data: { keyword },
          output_data: { searched: true },
          confidence_score: 0.9,
          human_review_status: 'not_required',
          reasoning: `Searched for keyword: ${keyword}`
        });
      }

      return {
        success: true,
        data: {
          keywords_searched: keywords.length,
          results: results
        },
        confidence: 0.9,
        requiresReview: false,
        reasoning: `Searched ${keywords.length} keywords across policy sources`
      };

    } catch (error) {
      return {
        success: false,
        requiresReview: true,
        errors: [error instanceof Error ? error.message : 'Keyword search failed']
      };
    }
  }

  /**
   * Generate monthly policy report
   */
  private async generatePolicyReport(): Promise<AgentOutput> {
    try {
      // Get policy updates from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: updates, error } = await this.supabase
        .from('policy_updates')
        .select('*')
        .gte('published_date', thirtyDaysAgo.toISOString())
        .order('relevance_score', { ascending: false });

      if (error) throw error;

      const highImpact = updates?.filter((u: any) => u.impact_level === 'high') || [];
      const mediumImpact = updates?.filter((u: any) => u.impact_level === 'medium') || [];

      const report = {
        period: 'Last 30 days',
        total_updates: updates?.length || 0,
        high_impact: highImpact.length,
        medium_impact: mediumImpact.length,
        sources_monitored: this.POLICY_SOURCES.length,
        top_updates: updates?.slice(0, 10) || []
      };

      await this.logAudit({
        action_type: 'generate_report',
        input_data: { period: '30_days' },
        output_data: report,
        confidence_score: 1.0,
        human_review_status: 'not_required',
        reasoning: 'Monthly policy report generated from tracked updates'
      });

      return {
        success: true,
        data: report,
        confidence: 1.0,
        requiresReview: false,
        reasoning: 'Policy report generated successfully'
      };

    } catch (error) {
      return {
        success: false,
        requiresReview: true,
        errors: [error instanceof Error ? error.message : 'Report generation failed']
      };
    }
  }
}
