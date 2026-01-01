import { BuyButton } from '@/components/stripe/BuyButton';
import { PricingTable } from '@/components/stripe/PricingTable';

export default function SupportPage() {
    const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
    // You will need to replace these with your actual IDs from Stripe Dashboard
    const PRICING_TABLE_ID = 'prctbl_123456789';
    const BUY_BUTTON_ID = 'buy_btn_123456789';

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Support the Ubuntu Initiative
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        Choose how you want to contribute to powering Africa's future.
                    </p>
                </div>

                {/* Monthly Sponsorship Section */}
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="px-6 py-8 sm:p-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Become a Sponsor</h2>
                        <div className="border-t border-gray-200 pt-6">
                            <PricingTable
                                pricingTableId={PRICING_TABLE_ID}
                                publishableKey={STRIPE_PK}
                            />
                        </div>
                    </div>
                </div>

                {/* One-time Donation Section */}
                <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-3xl mx-auto">
                    <div className="px-6 py-8 sm:p-10 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Make a One-Time Donation</h2>
                        <p className="text-gray-600 mb-8">
                            Every contribution helps us build the infrastructure for sovereign intelligence.
                        </p>
                        <div className="flex justify-center">
                            <BuyButton
                                buyButtonId={BUY_BUTTON_ID}
                                publishableKey={STRIPE_PK}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
