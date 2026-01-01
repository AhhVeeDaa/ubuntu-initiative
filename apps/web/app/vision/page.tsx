import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Timeline } from '@/components/vision/Timeline';
import { TechSpecs } from '@/components/vision/TechSpecs';
import { ScrollText, Map, ShieldCheck } from 'lucide-react';

export default function VisionPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24">
                {/* Header */}
                <section className="relative py-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
                            The <span className="text-[hsl(var(--primary))]">Blueprint</span>
                        </h1>
                        <p className="max-w-3xl mx-auto text-xl text-gray-400">
                            A master plan to decouple African intelligence from foreign dependency.
                            We are building the physical and digital infrastructure for true sovereignty.
                        </p>
                    </div>
                </section>

                {/* Philosophy Section */}
                <section className="py-16 bg-white/5 border-y border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <div className="flex items-center mb-6">
                                    <ShieldCheck className="h-8 w-8 text-[hsl(var(--accent))] mr-4" />
                                    <h2 className="text-3xl font-bold text-white">Why Sovereignty Matters</h2>
                                </div>
                                <div className="prose prose-invert prose-lg text-gray-300">
                                    <p>
                                        Today, 98% of African data resides on servers outside the continent.
                                        The models that shape our future are trained on values that differ from our own.
                                    </p>
                                    <p>
                                        The Ubuntu Initiative is not just about building a computer. It is about
                                        reclaiming the right to define our own digital destiny. By anchoring
                                        our intelligence to our own energy source (Inga), we ensure that
                                        no external switch can ever turn us off.
                                    </p>
                                </div>
                            </div>
                            <div className="glass-card p-8 flex items-center justify-center">
                                <blockquote className="text-center">
                                    <p className="text-2xl font-serif italic text-gray-300 mb-6">
                                        "Intelligence without sovereignty is merely advanced servitude."
                                    </p>
                                    <footer className="text-[hsl(var(--primary))] font-bold">- The Manifesto</footer>
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Infrastructure Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center mb-10">
                            <Map className="h-8 w-8 text-[hsl(var(--primary))] mr-4" />
                            <h2 className="text-3xl font-bold text-white">The Infrastructure</h2>
                        </div>
                        <TechSpecs />
                    </div>
                </section>

                {/* Roadmap Section */}
                <section className="py-20 bg-[hsl(var(--secondary))]/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center mb-12">
                            <ScrollText className="h-8 w-8 text-[hsl(var(--accent))] mr-4" />
                            <h2 className="text-3xl font-bold text-white">The Roadmap</h2>
                        </div>
                        <Timeline />
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
