import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json(
            { error: 'Payment system is not configured. Please contact support.' },
            { status: 503 }
        );
    }

    try {
        const body = await req.json();
        const { priceId, amount, label } = body;

        let line_items;
        let mode: 'payment' | 'subscription' = 'payment';

        if (priceId) {
            // Fixed price ID checkout (subscriptions or predefined tiers)
            try {
                const price = await stripe.prices.retrieve(priceId);
                mode = price.recurring ? 'subscription' : 'payment';
                line_items = [{ price: priceId, quantity: 1 }];
            } catch (priceError) {
                console.error('Price lookup failed:', priceError);
                return NextResponse.json(
                    { error: 'Invalid price configuration. Please try a custom amount.' },
                    { status: 400 }
                );
            }
        } else if (amount && typeof amount === 'number' && amount > 0) {
            // Dynamic donation amount
            mode = 'payment';
            line_items = [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: label || 'Ubuntu Initiative Contribution',
                        description: 'Funding Phase 0: Sovereignty & Reliability',
                    },
                    unit_amount: Math.round(amount * 100), // Convert to cents safely
                },
                quantity: 1,
            }];
        } else {
            return NextResponse.json(
                { error: 'Please provide a valid donation amount.' },
                { status: 400 }
            );
        }

        const origin = req.headers.get('origin') || 'https://ubuntu-initiative-web.vercel.app';

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: mode,
            success_url: `${origin}/support?success=true`,
            cancel_url: `${origin}/support?canceled=true`,
            metadata: {
                donation_type: priceId ? 'tier' : 'custom',
                impact_label: label || 'General Support'
            }
        });

        if (!session.url) {
            throw new Error('Checkout session created but no URL returned');
        }

        return NextResponse.json({ url: session.url });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        console.error('Checkout error:', err);

        // Return JSON error response
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
