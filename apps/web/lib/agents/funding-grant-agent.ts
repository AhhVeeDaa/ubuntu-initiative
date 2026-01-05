// Funding & Grant Agent
// Tracks funding opportunities, grant announcements, and Phase 0 donation progress
// Autonomy Level: Semi-autonomous

import { BaseAgent, AgentInput, AgentOutput } from './base';
import Stripe from 'stripe';

interface DonationEvent {
  stripe_payment_id: string;
  amount: number;
  currency: string;
  donor_email?: string;
  donor_name?: string;
  message?: string;
}

interface GrantOpportunity {
  title: string;
  funder: string;
  deadline?: string;
  amount_min?: number;
  amount_max?: number;
  url: string;
  eligibility_description?: string;
}

export class FundingGrantAgent extends BaseAgent {
  private stripe: Stripe;

  constructor() {
    super({
      id: 'agent_002',
      name: 'Funding & Grant Agent',
      version: '1.0.0',
      autonomyLevel: 'semi-autonomous'
    });

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-12-15.clover' as any
    });
  }

  async execute(input: AgentInput): Promise<AgentOutput> {
    try {
      switch (input.trigger) {
        case 'donation_webhook':
          return await this.processDonation(input.data as DonationEvent);

        case 'scan_grants':
          return await this.scanGrantOpportunities();

        case 'generate_funding_report':
          return await this.generateFundingReport();

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

  // Process new donation from Stripe webhook
  private async processDonation(event: DonationEvent): Promise<AgentOutput> {
    try {
      // 1. Store full donation record (private schema)
      const { data: donation, error: donationError } = await this.supabase
        .from('donations')
        .insert({
          stripe_payment_id: event.stripe_payment_id,
          amount: event.amount,
          currency: event.currency,
          donor_email: event.donor_email,
          donor_name: event.donor_name,
          message: event.message,
          fraud_check_status: this.checkFraudRisk(event.amount) ? 'flagged' : 'approved'
        } as any)
        .select()
        .single();

      if (donationError) throw donationError;

      // 2. Update public aggregates (anonymized)
      const today = new Date().toISOString().split('T')[0];

      const { data: existing, error: _fetchError } = await this.supabase
        .from('donation_aggregates')
        .select('*')
        .eq('date', today)
        .single();

      if (existing) {
        // Update existing aggregate
        const agg = existing as Record<string, any>;
        const updateData = {
          daily_total: agg.daily_total + event.amount,
          donor_count: agg.donor_count + 1
        };
        await this.supabase
          .from('donation_aggregates')
          // @ts-ignore - Supabase type inference issue for updates
          .update(updateData as any)
          .eq('date', today);
      } else {
        // Create new aggregate
        await this.supabase
          .from('donation_aggregates')
          .insert({
            date: today,
            daily_total: event.amount,
            donor_count: 1
          } as any);
      }

      const donationData = donation as Record<string, any> | null;

      // 3. Log audit trail
      await this.logAudit({
        action_type: 'process_donation',
        input_data: { amount: event.amount, currency: event.currency },
        output_data: {
          donation_id: donationData?.id,
          fraud_check: donationData?.fraud_check_status
        },
        confidence_score: 1.0,
        human_review_status: donationData?.fraud_check_status === 'flagged' ? 'pending' : 'not_required',
        reasoning: 'Donation processed and aggregated. PII stored securely in private schema.'
      });

      // 4. If fraud flagged, add to approval queue
      if (donationData?.fraud_check_status === 'flagged') {
        await this.addToApprovalQueue(
          'grant', // Using 'grant' type for funding items
          donationData?.id,
          {
            reason: 'Large donation or unusual pattern',
            amount: event.amount,
            recommended_action: 'Manual review required'
          },
          'high'
        );
      }

      return {
        success: true,
        data: {
          donation_id: donationData?.id,
          aggregated: true,
          fraud_flagged: donationData?.fraud_check_status === 'flagged'
        },
        confidence: 1.0,
        requiresReview: donationData?.fraud_check_status === 'flagged',
        reasoning: 'Donation processed successfully. Real-time aggregate updated.'
      };

    } catch (error) {
      return {
        success: false,
        requiresReview: true,
        errors: [error instanceof Error ? error.message : 'Donation processing failed']
      };
    }
  }

  // Fraud risk check (simple heuristics)
  private checkFraudRisk(amount: number): boolean {
    // Flag donations over $10,000 for manual review
    return amount > 10000;
  }

  // Scan for grant opportunities (placeholder - would integrate with real APIs)
  private async scanGrantOpportunities(): Promise<AgentOutput> {
    try {
      // In production, this would query:
      // - World Bank Projects API
      // - African Development Bank
      // - Climate finance trackers
      // For now, placeholder logic

      const opportunities: GrantOpportunity[] = [
        // Example: Would be fetched from external APIs
      ];

      // Calculate eligibility match scores
      const scoredOpportunities = opportunities.map(opp => ({
        ...opp,
        eligibility_match_score: this.calculateEligibilityScore(opp)
      }));

      // Store high-match opportunities
      const highMatchOpps = scoredOpportunities.filter(o => o.eligibility_match_score > 0.8);

      for (const opp of highMatchOpps) {
        await this.supabase
          .from('grant_opportunities')
          .insert({
            title: opp.title,
            funder: opp.funder,
            deadline: opp.deadline,
            amount_min: opp.amount_min,
            amount_max: opp.amount_max,
            url: opp.url,
            eligibility_match_score: opp.eligibility_match_score,
            public_visible: opp.eligibility_match_score > 0.9
          } as any);
      }

      await this.logAudit({
        action_type: 'scan_grants',
        input_data: { scan_date: new Date().toISOString() },
        output_data: { opportunities_found: opportunities.length, high_match: highMatchOpps.length },
        confidence_score: 0.85,
        human_review_status: 'pending',
        reasoning: 'Grant scan completed. High-match opportunities added to database for review.'
      });

      return {
        success: true,
        data: {
          scanned: opportunities.length,
          high_match: highMatchOpps.length
        },
        confidence: 0.85,
        requiresReview: true,
        reasoning: 'Grant opportunities require human validation before application.'
      };

    } catch (error) {
      return {
        success: false,
        requiresReview: true,
        errors: [error instanceof Error ? error.message : 'Grant scan failed']
      };
    }
  }

  // Calculate eligibility match score (Phase 0 criteria)
  private calculateEligibilityScore(opp: GrantOpportunity): number {
    let score = 0.5; // Base score

    // Increase score for relevant keywords
    const relevantKeywords = [
      'infrastructure', 'hydropower', 'energy', 'africa',
      'drc', 'democratic republic congo', 'renewable', 'inga'
    ];

    const text = `${opp.title} ${opp.eligibility_description}`.toLowerCase();

    relevantKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 0.05;
      }
    });

    return Math.min(score, 1.0);
  }

  // Generate monthly funding report
  private async generateFundingReport(): Promise<AgentOutput> {
    try {
      // Aggregate donation stats
      const { data: aggregates, error } = await this.supabase
        .from('donation_aggregates')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;

      const totalRaised = aggregates?.reduce((sum, day) => sum + (day as Record<string, any>).daily_total, 0) || 0;
      const totalDonors = aggregates?.reduce((sum, day) => sum + (day as Record<string, any>).donor_count, 0) || 0;

      const report = {
        period: 'Last 30 days',
        total_raised: totalRaised,
        total_donors: totalDonors,
        average_donation: totalDonors > 0 ? totalRaised / totalDonors : 0,
        daily_breakdown: aggregates
      };

      await this.logAudit({
        action_type: 'generate_funding_report',
        input_data: { period: '30_days' },
        output_data: report,
        confidence_score: 1.0,
        human_review_status: 'not_required',
        reasoning: 'Monthly funding report generated from verified donation data.'
      });

      return {
        success: true,
        data: report,
        confidence: 1.0,
        requiresReview: false,
        reasoning: 'Report generated from aggregated donation data.'
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
