import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Timeline } from '@/components/vision/Timeline';
import { TechSpecs } from '@/components/vision/TechSpecs';
import { SystemArchitecture } from '@/components/vision/SystemArchitecture';
import { NoSSR } from '@/components/ai/NoSSR';
import { ScrollText, Map, ShieldCheck, Activity } from 'lucide-react';

export default function VisionPage() {
    return (
        <div className="min-h-screen flex flex-col bg-black">
            <Navbar />

            <main className="flex-grow pt-24">
                {/* Header */}
                <section className="relative py-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
                            The <span className="text-gradient">Blueprint</span>
                        </h1>
                        <p className="max-w-3xl mx-auto text-xl text-gray-400 font-light leading-relaxed">
                            A master plan to decouple African intelligence from foreign dependency.
                            We are building the physical and digital infrastructure for true sovereignty.
                        </p>
                    </div>
                </section>

                {/* Philosophy Section */}
                <section className="py-16 bg-white/5 border-y border-white/10 overflow-hidden relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="flex items-center mb-6">
                                    <ShieldCheck className="h-8 w-8 text-[hsl(var(--accent))] mr-4" />
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">Why Sovereignty Matters</h2>
                                </div>
                                <div className="prose prose-invert prose-lg text-gray-400 font-light">
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
                            <div className="p-1 rounded-[40px] bg-gradient-to-br from-white/10 to-transparent">
                                <div className="bg-[#05080a] p-10 md:p-16 rounded-[39px] flex items-center justify-center relative shadow-2xl">
                                    <blockquote className="text-center">
                                        <p className="text-2xl md:text-3xl font-serif italic text-white/90 mb-8 leading-snug">
                                            "Intelligence without sovereignty is merely advanced servitude."
                                        </p>
                                        <footer className="text-[hsl(var(--primary))] font-black tracking-widest uppercase text-sm">— The Ubuntu Manifesto</footer>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Architecture Section */}
                <section className="py-24 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <NoSSR>
                            <SystemArchitecture />
                        </NoSSR>
                    </div>
                </section>

                {/* Infrastructure Section */}
                <section className="py-24 bg-white/[0.02] border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center mb-16 px-4">
                            <Activity className="h-8 w-8 text-[hsl(var(--primary))] mr-4" />
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Core Infrastructure</h2>
                        </div>
                        <TechSpecs />
                    </div>
                </section>

                {/* Roadmap Section */}
                <section className="py-24 bg-black">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center mb-16 px-4">
                            <ScrollText className="h-8 w-8 text-[hsl(var(--accent))] mr-4" />
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Project Roadmap</h2>
                        </div>
                        <Timeline />
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
