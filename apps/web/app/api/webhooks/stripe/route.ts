import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

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

    // Handle specific event types
    switch (event.type) {
        case 'checkout.session.completed':
            console.log(`Payment successful for session: ${session.id}`);
            // Here you would typically:
            // 1. Update your database via Supabase
            // 2. Clear user's cart
            // 3. Send confirmation email
            break;

        case 'payment_intent.succeeded':
            console.log(`PaymentIntent succeeded: ${session.id}`);
            break;

        default:
            console.warn(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse(null, { status: 200 });
}
