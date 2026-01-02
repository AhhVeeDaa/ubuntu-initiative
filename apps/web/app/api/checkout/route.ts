import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const { priceId } = await req.json();

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment', // or 'subscription' if price is recurring
            success_url: `${req.headers.get('origin')}/support?success=true`,
            cancel_url: `${req.headers.get('origin')}/support?canceled=true`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error(err);
        return new NextResponse(err.message, { status: 500 });
    }
}
