import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { DonateButton } from '@/components/stripe/DonateButton';

export default function SupportPage() {
    const PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1SkxlHBkp2utrOiWaDQDNFKz';

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Header */}
                <section className="pt-32 pb-12 bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--secondary))]/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
                            Support the Ubuntu Initiative
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Help us build Africa's first sovereign AI supercomputer.
                            Every contribution powers the infrastructure for a new future.
                        </p>
                    </div>
                </section>

                {/* Support Options */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Partnership Track */}
                            <div className="glass-panel rounded-xl p-8">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--primary))]/20 mb-4">
                                        <span className="text-3xl">🤝</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Become a Partner</h2>
                                    <p className="text-gray-400">
                                        Join the coalition building Ubuntu
                                    </p>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start">
                                        <span className="text-[hsl(var(--primary))] mr-2">✓</span>
                                        <span className="text-gray-300">Early access to progress and insights</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-[hsl(var(--primary))] mr-2">✓</span>
                                        <span className="text-gray-300">Recognition on website and materials</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-[hsl(var(--primary))] mr-2">✓</span>
                                        <span className="text-gray-300">Direct communication with founder</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-[hsl(var(--primary))] mr-2">✓</span>
                                        <span className="text-gray-300">Opportunity to shape the initiative</span>
                                    </div>
                                </div>

                                <Link
                                    href="/contact"
                                    className="block w-full py-3 px-6 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-center font-bold rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-all"
                                >
                                    Get in Touch
                                </Link>
                            </div>

                            {/* Financial Support */}
                            <div className="glass-panel rounded-xl p-8">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--accent))]/20 mb-4">
                                        <span className="text-3xl">💰</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Financial Contribution</h2>
                                    <p className="text-gray-400">
                                        Direct funding for Phase 0 development
                                    </p>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start">
                                        <span className="text-[hsl(var(--accent))] mr-2">✓</span>
                                        <span className="text-gray-300">100% goes to Phase 0 activities</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-[hsl(var(--accent))] mr-2">✓</span>
                                        <span className="text-gray-300">Transparent usage tracking</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-[hsl(var(--accent))] mr-2">✓</span>
                                        <span className="text-gray-300">Regular progress updates</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-[hsl(var(--accent))] mr-2">✓</span>
                                        <span className="text-gray-300">Tax-deductible (foundation status pending)</span>
                                    </div>
                                </div>

                                <DonateButton priceId={PRICE_ID} />
                            </div>
                        </div>

                        {/* Additional Ways to Help */}
                        <div className="mt-12 glass-panel rounded-xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">Other Ways to Support</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-4xl mb-3">📢</div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Spread the Word</h3>
                                    <p className="text-gray-400 text-sm">
                                        Share our vision with your network
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="text-4xl mb-3">🔧</div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Contribute Skills</h3>
                                    <p className="text-gray-400 text-sm">
                                        Offer expertise in energy, AI, or policy
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="text-4xl mb-3">🌍</div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Make Connections</h3>
                                    <p className="text-gray-400 text-sm">
                                        Introduce us to potential partners
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Transparency Commitment */}
                        <div className="mt-12 text-center">
                            <p className="text-gray-400 max-w-3xl mx-auto">
                                Every contribution is tracked transparently. All funds for Phase 0 go directly to:
                                legal formation, feasibility studies, partnership development, and operational infrastructure.
                                <Link href="/progress" className="text-[hsl(var(--primary))] hover:underline ml-1">
                                    Track our progress →
                                </Link>
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
