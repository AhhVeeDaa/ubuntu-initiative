const Stripe = require('stripe');

// Initialize Stripe with the secret key and a pinned API version as per docs
const stripeKey = process.env.STRIPE_SECRET_KEY || '';
if (!stripeKey) {
    console.error('Missing STRIPE_SECRET_KEY in environment.');
    process.exit(1);
}

// Using a placeholder for now, but in a real app you'd use the latest or a specific version like '2025-12-15.clover'
const stripe = new Stripe(stripeKey, {
    apiVersion: '2025-12-15.clover' // Using the version expected by the SDK
});

async function setupStripe() {
    try {
        console.log('--- Setting up Stripe Resources ---');

        // 1. Create a Product
        console.log('Creating product...');
        const product = await stripe.products.create({
            name: 'Ubuntu Initiative Monthly Support',
            description: 'Monthly contribution to power sovereign intelligence in Africa.',
            metadata: {
                project: 'Ubuntu Initiative'
            }
        });
        console.log('✅ Product Created:', product.id);

        // 2. Create a Price
        console.log('Creating price...');
        const price = await stripe.prices.create({
            unit_amount: 3000, // $30.00
            currency: 'usd',
            recurring: { interval: 'month' },
            product: product.id,
        });
        console.log('✅ Price Created:', price.id);

        console.log('\n--- Setup Complete ---');
        console.log('Product ID:', product.id);
        console.log('Price ID:', price.id);
        console.log('\nUpdate your PRICING_TABLE_ID and BUY_BUTTON_ID in SupportPage accordingly.');

    } catch (error) {
        console.error('❌ Setup Failed:', error.message);
    }
}

setupStripe();
