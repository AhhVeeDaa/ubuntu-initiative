import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const { priceId, amount, label } = await req.json();

        let line_items;
        let mode: 'payment' | 'subscription' = 'payment';

        if (priceId) {
            // Existing logic for fixed price IDs (e.g. subscriptions)
            const price = await stripe.prices.retrieve(priceId);
            mode = price.recurring ? 'subscription' : 'payment';
            line_items = [{ price: priceId, quantity: 1 }];
        } else if (amount) {
            // New logic for dynamic donation amounts
            mode = 'payment';
            line_items = [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: label || 'Ubuntu Initiative Contribution',
                        description: 'Funding Phase 0: Sovereignty & Reliability',
                    },
                    unit_amount: amount * 100, // Convert to cents
                },
                quantity: 1,
            }];
        } else {
            return new NextResponse('Missing priceId or amount', { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: mode,
            success_url: `${req.headers.get('origin')}/support?success=true`,
            cancel_url: `${req.headers.get('origin')}/support?canceled=true`,
            metadata: {
                donation_type: priceId ? 'tier' : 'custom',
                impact_label: label || 'General Support'
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error(err);
        return new NextResponse(err.message, { status: 500 });
    }
}
