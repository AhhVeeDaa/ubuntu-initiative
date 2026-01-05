// Progress Milestone Ingestion Agent
// Automatically ingests and validates milestone completion data
// Autonomy Level: Semi-autonomous

import { BaseAgent, AgentInput, AgentOutput } from './base';

interface MilestoneSubmission {
  title: string;
  description?: string;
  category: 'technical' | 'community' | 'policy' | 'funding';
  completion_date: string;
  evidence_url: string;
  submitted_by?: string;
}

interface ValidationResult {
  valid: boolean;
  confidence: number;
  issues: string[];
}

interface GitHubPayload {
  pull_request?: {
    title: string;
    body: string;
    html_url: string;
  };
  issue?: {
    title: string;
    body: string;
    html_url: string;
  };
  merged_at?: string;
  closed_at?: string;
}

export class ProgressMilestoneAgent extends BaseAgent {
  constructor() {
    super({
      id: 'agent_004',
      name: 'Progress Milestone Ingestion Agent',
      version: '1.0.0',
      autonomyLevel: 'semi-autonomous'
    });
  }

  async execute(input: AgentInput): Promise<AgentOutput> {
    try {
      switch (input.trigger) {
        case 'github_webhook':
          return await this.processGitHubMilestone(input.data as GitHubPayload);

        case 'manual_submission':
          return await this.processManualSubmission(input.data as MilestoneSubmission);

        case 'validate_milestone':
          return await this.validateMilestone(input.data as MilestoneSubmission);

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

  // Process milestone from GitHub webhook
  private async processGitHubMilestone(data: GitHubPayload): Promise<AgentOutput> {
    try {
      // Extract milestone info from GitHub PR or issue
      const milestone: MilestoneSubmission = {
        title: data.pull_request?.title || data.issue?.title || 'Untitled',
        description: data.pull_request?.body || data.issue?.body,
        category: this.inferCategory(data),
        completion_date: data.merged_at || data.closed_at || new Date().toISOString(),
        evidence_url: data.pull_request?.html_url || data.issue?.html_url || ''
      };

      // Validate milestone
      const validation = await this.validateMilestoneContent(milestone);

      // Determine if auto-publish or needs review
      const autoPublish = validation.confidence >= 0.9 && validation.valid;

      if (autoPublish) {
        // Publish directly
        const { data: published, error } = await this.supabase
          .from('milestone_events')
          .insert({
            title: milestone.title,
            description: milestone.description,
            category: milestone.category,
            completion_date: milestone.completion_date,
            evidence_url: milestone.evidence_url,
            confidence_score: validation.confidence,
            status: 'verified'
          } as any)
          .select()
          .single();

        if (error) throw error;

        const publishedData = published as Record<string, any> | null;
        await this.logAudit({
          action_type: 'publish_milestone',
          input_data: milestone,
          output_data: { milestone_id: publishedData?.id },
          confidence_score: validation.confidence,
          human_review_status: 'not_required',
          reasoning: `Auto-published: High confidence (${validation.confidence}) with valid GitHub evidence.`
        });

        return {
          success: true,
          data: { milestone_id: publishedData?.id, auto_published: true },
          confidence: validation.confidence,
          requiresReview: false,
          reasoning: 'Milestone validated and published automatically.'
        };

      } else {
        // Send to approval queue
        const { data: draft, error } = await this.supabase
          .from('milestone_events')
          .insert({
            title: milestone.title,
            description: milestone.description,
            category: milestone.category,
            completion_date: milestone.completion_date,
            evidence_url: milestone.evidence_url,
            confidence_score: validation.confidence,
            status: 'completed' // Not verified yet
          } as any)
          .select()
          .single();

        if (error) throw error;

        const draftData = draft as Record<string, any> | null;
        await this.addToApprovalQueue(
          'milestone',
          draftData?.id,
          {
            milestone: milestone,
            validation: validation,
            recommended_action: validation.valid ? 'approve' : 'review_closely'
          },
          validation.confidence < 0.7 ? 'high' : 'medium'
        );

        await this.logAudit({
          action_type: 'queue_milestone',
          input_data: milestone,
          output_data: { milestone_id: draftData?.id },
          confidence_score: validation.confidence,
          human_review_status: 'pending',
          reasoning: `Queued for review: Confidence ${validation.confidence}. Issues: ${validation.issues.join(', ')}`
        });

        return {
          success: true,
          data: { milestone_id: draftData?.id, queued_for_review: true },
          confidence: validation.confidence,
          requiresReview: true,
          reasoning: 'Milestone requires human validation before publishing.'
        };
      }

    } catch (error) {
      return {
        success: false,
        requiresReview: true,
        errors: [error instanceof Error ? error.message : 'GitHub milestone processing failed']
      };
    }
  }

  // Process manually submitted milestone
  private async processManualSubmission(submission: MilestoneSubmission): Promise<AgentOutput> {
    try {
      // Validate submission
      const validation = await this.validateMilestoneContent(submission);

      // Manual submissions always require review (lower trust than automated GitHub)
      const { data: draft, error } = await this.supabase
        .from('milestone_events')
        .insert({
          title: submission.title,
          description: submission.description,
          category: submission.category,
          completion_date: submission.completion_date,
          evidence_url: submission.evidence_url,
          confidence_score: validation.confidence * 0.8, // Reduce confidence for manual submissions
          status: 'completed'
        } as any)
        .select()
        .single();

      if (error) throw error;

      const draftData = draft as Record<string, any>;
      await this.addToApprovalQueue(
        'milestone',
        draftData.id,
        {
          submission: submission,
          validation: validation,
          submission_type: 'manual',
          recommended_action: 'review_evidence'
        },
        'medium'
      );

      await this.logAudit({
        action_type: 'manual_milestone_submission',
        input_data: submission,
        output_data: { milestone_id: draftData.id },
        confidence_score: validation.confidence * 0.8,
        human_review_status: 'pending',
        reasoning: 'Manual submission queued for review. Evidence validation required.'
      });

      return {
        success: true,
        data: { milestone_id: draftData.id, queued: true },
        confidence: validation.confidence * 0.8,
        requiresReview: true,
        reasoning: 'Manual submissions require team validation before publishing.'
      };

    } catch (error) {
      return {
        success: false,
        requiresReview: true,
        errors: [error instanceof Error ? error.message : 'Manual submission failed']
      };
    }
  }

  // Validate milestone content
  private async validateMilestoneContent(milestone: MilestoneSubmission): Promise<ValidationResult> {
    const issues: string[] = [];
    let confidence = 1.0;

    // Check Phase 0 compliance
    const phase0Check = this.validatePhase0Content(milestone.title + ' ' + (milestone.description || ''));
    if (!phase0Check.valid) {
      issues.push(...phase0Check.violations);
      confidence -= 0.3;
    }

    // Check evidence URL validity
    if (!this.isValidURL(milestone.evidence_url)) {
      issues.push('Evidence URL is invalid');
      confidence -= 0.4;
    }

    // Check if evidence is from trusted source (GitHub, Google Drive, etc.)
    if (!this.isTrustedEvidenceSource(milestone.evidence_url)) {
      issues.push('Evidence source not recognized as trusted');
      confidence -= 0.2;
    }

    // Check title quality
    if (milestone.title.length < 10) {
      issues.push('Title too short');
      confidence -= 0.1;
    }

    // Check completion date validity
    const completionDate = new Date(milestone.completion_date);
    if (isNaN(completionDate.getTime()) || completionDate > new Date()) {
      issues.push('Invalid completion date');
      confidence -= 0.3;
    }

    return {
      valid: issues.length === 0,
      confidence: Math.max(0, Math.min(1, confidence)),
      issues
    };
  }

  // Validate milestone data
  private async validateMilestone(data: MilestoneSubmission): Promise<AgentOutput> {
    const validation = await this.validateMilestoneContent(data);

    return {
      success: true,
      data: validation,
      confidence: validation.confidence,
      requiresReview: !validation.valid || validation.confidence < 0.9
    };
  }

  // Infer category from GitHub data
  private inferCategory(data: GitHubPayload): 'technical' | 'community' | 'policy' | 'funding' {
    const text = `${data.pull_request?.title || ''} ${data.pull_request?.body || ''} ${data.issue?.title || ''}`.toLowerCase();

    if (text.includes('funding') || text.includes('donation') || text.includes('grant')) {
      return 'funding';
    } else if (text.includes('policy') || text.includes('regulation') || text.includes('legal')) {
      return 'policy';
    } else if (text.includes('community') || text.includes('outreach') || text.includes('engagement')) {
      return 'community';
    } else {
      return 'technical';
    }
  }

  // Check if URL is valid
  private isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Check if evidence source is trusted
  private isTrustedEvidenceSource(url: string): boolean {
    const trustedDomains = [
      'github.com',
      'drive.google.com',
      'docs.google.com',
      'dropbox.com',
      'notion.so',
      'linear.app'
    ];

    try {
      const urlObj = new URL(url);
      return trustedDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  }
}
