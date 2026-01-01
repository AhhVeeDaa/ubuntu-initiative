const Stripe = require('stripe');

// Initialize Stripe with the key from env or the one provided
const stripe = new Stripe('sk_test_51HDarFBkp2utrOiWzFCwpFIwEkjFdrl0JRyuIpg5J0lguNfv8rSj6I4AAH1eaYoIULq9ZWs6KjRrneCFXd6yjrNQ0071g2aBWJ');

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
