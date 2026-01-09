import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'placeholder_for_build';

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️ STRIPE_SECRET_KEY is missing. Stripe functionality will fail at runtime if not provided.');
}

export const stripe = new Stripe(stripeKey, {
    apiVersion: '2024-12-18.acacia' as any,
    appInfo: {
        name: 'Ubuntu Initiative',
        version: '0.1.0',
    },
});
