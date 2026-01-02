const Stripe = require('stripe');

// Initialize Stripe with the key from env
const stripeKey = process.env.STRIPE_SECRET_KEY || '';
if (!stripeKey) {
    console.error('Missing STRIPE_SECRET_KEY in environment. Set it and retry.');
    process.exit(1);
}
const stripe = new Stripe(stripeKey);

async function testConnection() {
    try {
        console.log('Testing Stripe connection...');
        // List latest 1 charge to verify permission
        const charges = await stripe.charges.list({ limit: 1 });
        console.log('✅ Read Permission Verified (Charges List)');

        console.log('Testing Write Permission...');
        // Create a test customer as requested
        const customer = await stripe.customers.create({
            description: 'Ubuntu Initiative Test Customer',
            metadata: {
                project: 'Ubuntu Initiative',
                environment: 'Development'
            }
        });
        console.log('✅ Write Permission Verified (Customer Created)');
        console.log('Customer ID:', customer.id);
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        if (error.type) {
            console.error('Error Type:', error.type);
        }
    }
}

testConnection();
