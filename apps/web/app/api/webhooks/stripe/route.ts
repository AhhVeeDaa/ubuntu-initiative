import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { FundingGrantAgent } from '@/lib/agents/funding-grant-agent';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    if (!signature) {
        return new NextResponse('No signature', { status: 400 });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const session = event.data.object as any;

    // Initialize Funding & Grant Agent
    const fundingAgent = new FundingGrantAgent();

    // Handle specific event types
    switch (event.type) {
        case 'checkout.session.completed':
            console.log(`Payment successful for session: ${session.id}`);
            
            // Extract donation details
            const donationAmount = session.amount_total / 100; // Stripe amounts are in cents
            const currency = session.currency?.toUpperCase() || 'USD';
            const donorEmail = session.customer_details?.email;
            const donorName = session.customer_details?.name;

            // Process donation through agent
            const result = await fundingAgent.execute({
                trigger: 'donation_webhook',
                data: {
                    stripe_payment_id: session.id,
                    amount: donationAmount,
                    currency: currency,
                    donor_email: donorEmail,
                    donor_name: donorName,
                    message: session.metadata?.message || null
                }
            });

            if (!result.success) {
                console.error('Funding agent failed to process donation:', result.errors);
                // Still return 200 to Stripe to avoid retries
                return new NextResponse(JSON.stringify({ 
                    received: true, 
                    agent_processed: false,
                    errors: result.errors 
                }), { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            console.log(`Donation processed by agent. Fraud flagged: ${result.data?.fraud_flagged}`);
            
            return new NextResponse(JSON.stringify({ 
                received: true,
                agent_processed: true,
                fraud_review_required: result.requiresReview
            }), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        case 'payment_intent.succeeded':
            console.log(`PaymentIntent succeeded: ${session.id}`);
            break;

        default:
            console.warn(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse(JSON.stringify({ received: true }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
