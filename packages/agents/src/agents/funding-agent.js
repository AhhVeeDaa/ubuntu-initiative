/**
 * Funding & Grant Agent
 * Tracks donations and grant opportunities for the Ubuntu Initiative
 */

import { BaseAgent } from '../base-agent.js';
import Stripe from 'stripe';

export class FundingAgent extends BaseAgent {
    constructor() {
        super('agent_002_funding', {
            autoApproveThreshold: 0.9,
            fraudAmountThreshold: 10000
        });
        
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    /**
     * Process Stripe webhook for new donation
     */
    async processStripeWebhook(event) {
        console.log(`[FundingAgent] Processing Stripe event: ${event.type}`);
        
        if (event.type !== 'payment_intent.succeeded') {
            return { success: false, message: 'Event type not handled' };
        }

        const paymentIntent = event.data.object;
        
        // Extract donation data
        const donationData = {
            stripe_payment_id: paymentIntent.id,
            amount: paymentIntent.amount / 100, // Convert from cents
            currency: paymentIntent.currency.toUpperCase(),
            donor_email: paymentIntent.receipt_email,
            donor_name: paymentIntent.metadata?.donor_name || null,
            message: paymentIntent.metadata?.message || null
        };

        // Fraud check
        const fraudStatus = await this.checkFraud(donationData);
        donationData.fraud_check_status = fraudStatus;

        try {
            // Insert donation
            const { data: donation, error } = await this.supabase
                .from('donations')
                .insert(donationData)
                .select()
                .single();

            if (error) throw error;

            // Log action
            await this.logAction('process_donation', {
                stripe_event_id: event.id,
                amount: donationData.amount
            }, {
                donation_id: donation.id,
                fraud_status: fraudStatus
            }, {
                confidence: fraudStatus === 'approved' ? 1.0 : 0.5,
                reasoning: `Donation processed. Fraud check: ${fraudStatus}`
            });

            // Alert if flagged
            if (fraudStatus === 'flagged') {
                await this.alertHighRisk(donation);
            }

            return {
                success: true,
                donation,
                fraud_status: fraudStatus
            };
        } catch (error) {
            console.error('[FundingAgent] Error processing donation:', error);
            throw error;
        }
    }

    /**
     * Check for fraud indicators
     */
    async checkFraud(donationData) {
        const flags = [];

        // Check 1: Amount threshold
        if (donationData.amount > this.config.fraudAmountThreshold) {
            flags.push('high_amount');
        }

        // Check 2: Rapid repeat donations (same email)
        if (donationData.donor_email) {
            const { data: recentDonations } = await this.supabase
                .from('donations')
                .select('id, created_at')
                .eq('donor_email', donationData.donor_email)
                .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
                .limit(5);

            if (recentDonations && recentDonations.length >= 3) {
                flags.push('rapid_repeats');
            }
        }

        // Return status
        if (flags.length === 0) return 'approved';
        if (flags.includes('high_amount')) return 'flagged';
        return 'pending';
    }

    /**
     * Alert team about high-risk donation
     */
    async alertHighRisk(donation) {
        console.log(`[FundingAgent] 🚨 HIGH RISK DONATION FLAGGED: $${donation.amount}`);
        
        // Queue for review
        await this.queueForReview('funding', donation.id, {
            message: 'High-risk donation detected',
            amount: donation.amount,
            indicators: ['high_amount']
        }, 'urgent');
    }

    /**
     * Run the agent (main entry point)
     */
    async run() {
        console.log('[FundingAgent] Agent started');
        // This would be called by webhook handler or scheduler
        return { status: 'ready' };
    }
}

export default FundingAgent;
