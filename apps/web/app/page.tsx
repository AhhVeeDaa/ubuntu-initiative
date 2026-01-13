import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight, Check, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Ubuntu | Sovereign AI Orchestration for 500MW-Scale Compute',
  description: 'Ubuntu licenses an AI execution and governance layer designed to operate within explicit energy envelopes. Licensable, deployable, governed.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 z-0 opacity-5">
        <Image
          src="/inga-dam.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="relative z-10">
        <Navbar />

        <main className="flex-grow">
          {/* HERO SECTION */}
          <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden pt-20">
            <div className="absolute inset-0 z-0">
              <Image
                src="/hero-inga-dam-datacenter.jpg"
                alt="AI Orchestration Infrastructure"
                fill
                className="object-cover"
                priority
                quality={95}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
              <div className="inline-block px-4 py-2 bg-[hsl(var(--primary))]/20 border border-[hsl(var(--primary))]/40 rounded-full mb-6">
                <span className="text-[hsl(var(--primary))] text-sm font-bold uppercase tracking-wider">
                  Platform Status: Operational
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
                Sovereign AI Orchestration<br />
                <span className="text-gradient">for 500MW-Scale Compute</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-4 max-w-4xl mx-auto leading-relaxed">
                Ubuntu licenses an AI execution and governance layer designed to operate 
                within explicit energy envelopes.
              </p>
              
              <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
                You bring power. We enforce constraints. Infrastructure follows demand.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/ai-orchestration"
                  className="px-10 py-5 bg-[hsl(var(--primary))] text-black font-black rounded-xl hover:scale-105 transition-all duration-300 text-lg shadow-2xl"
                >
                  License the AI Stack
                </Link>
                <Link
                  href="/governance-framework"
                  className="px-10 py-5 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  View Governance Framework
                </Link>
              </div>

              <div className="mt-8">
                <Link
                  href="/vision"
                  className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors text-sm font-medium"
                >
                  Learn about the Initiative →
                </Link>
              </div>
            </div>
          </section>

          {/* SECTION 2: WHAT YOU GET */}
          <section className="py-24 px-4 bg-black">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <p className="text-[hsl(var(--primary))] font-mono text-sm uppercase tracking-[0.3em] mb-4">The Product</p>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  AI Orchestration as a Service
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                  <h3 className="text-2xl font-bold text-white mb-4">Ubuntu Provides:</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Check className="text-[hsl(var(--primary))] flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-300">Load-aware AI scheduling (assumes 500MW envelope)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-[hsl(var(--primary))] flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-300">Quantum-classical workflow management</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-[hsl(var(--primary))] flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-300">Agent execution layer with sovereign compliance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-[hsl(var(--primary))] flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-300">Governance enforcement (caps, ramps, audit, revocation)</span>
                    </li>
                  </ul>
                </div>

                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                  <h3 className="text-2xl font-bold text-white mb-4">Available Now:</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <ArrowRight className="text-[hsl(var(--accent))] flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-300">Exclusive license</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ArrowRight className="text-[hsl(var(--accent))] flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-300">Custom deployment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ArrowRight className="text-[hsl(var(--accent))] flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-300">JV partnership</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/ai-orchestration"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Explore the Product <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </section>

          {/* SECTION 3: WHAT YOU DON'T GET (CRITICAL) */}
          <section className="py-24 px-4 bg-gradient-to-b from-black to-red-950/10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Energy is Your Problem
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Ubuntu facilitates access to renewable energy partnerships but does not own or operate power infrastructure.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-black/50 border-2 border-red-500/30 rounded-2xl">
                  <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
                    <X size={24} />
                    Ubuntu Does NOT Provide:
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <X className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                      <span>Energy infrastructure</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                      <span>Hardware procurement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                      <span>Unlimited scale</span>
                    </li>
                  </ul>
                </div>

                <div className="p-8 bg-black/50 border-2 border-[hsl(var(--primary))]/30 rounded-2xl">
                  <h3 className="text-2xl font-bold text-[hsl(var(--primary))] mb-6 flex items-center gap-2">
                    <Check size={24} />
                    We Provide:
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <Check className="text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" size={16} />
                      <span>The orchestration layer</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" size={16} />
                      <span>Governance constraints</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" size={16} />
                      <span>Compliance automation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" size={16} />
                      <span>Load envelope management</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-xl text-center">
                <p className="text-xl text-white font-bold mb-2">
                  You provide the power. We make it governable.
                </p>
                <p className="text-gray-400">
                  Infrastructure follows proven demand. Ubuntu facilitates access to 500MW+ renewable hydro envelopes through DRC government partnerships in the Inga region.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 4: WHO BUYS THIS */}
          <section className="py-24 px-4 bg-black">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Who Buys This
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-[hsl(var(--primary))]/50 transition-colors">
                  <h3 className="text-2xl font-bold text-white mb-4">Hyperscalers</h3>
                  <p className="text-gray-300 mb-6">
                    License AI orchestration for sovereign compute deployments. Governance built-in. Energy agnostic.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 font-semibold"
                  >
                    Contact for Licensing <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-[hsl(var(--primary))]/50 transition-colors">
                  <h3 className="text-2xl font-bold text-white mb-4">Sovereign Buyers</h3>
                  <p className="text-gray-300 mb-6">
                    Deploy governed AI capability within national infrastructure. Policy compliance automated.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 font-semibold"
                  >
                    Deploy the Platform <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-[hsl(var(--primary))]/50 transition-colors">
                  <h3 className="text-2xl font-bold text-white mb-4">Infrastructure Partners</h3>
                  <p className="text-gray-300 mb-6">
                    Respond to demand after orchestration is deployed. Energy follows intelligence, not vice versa.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 font-semibold"
                  >
                    Partnership Inquiry <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: GOVERNANCE AS FEATURE */}
          <section className="py-24 px-4 bg-gradient-to-b from-black to-purple-950/10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <p className="text-[hsl(var(--accent))] font-mono text-sm uppercase tracking-[0.3em] mb-4">The Constraint</p>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Constraints Enable Scale
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {[
                  '500MW load caps per unit',
                  'Ramp rate compliance',
                  'Audit trail generation',
                  'Revocation capability',
                  'Sovereign policy alignment',
                  'Multi-tenant isolation'
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Check className="text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-300 font-medium">{item}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-black/50 border border-[hsl(var(--accent))]/30 rounded-2xl text-center">
                <p className="text-2xl text-white font-bold mb-2">
                  This is not ethics marketing.
                </p>
                <p className="text-xl text-gray-300">
                  This is what makes institutional deployment possible.
                </p>
              </div>

              <div className="text-center mt-8">
                <Link
                  href="/governance-framework"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  See Governance Framework <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </section>

          {/* SECTION 6: STATUS */}
          <section className="py-24 px-4 bg-black">
            <div className="max-w-4xl mx-auto">
              <div className="p-12 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl text-center">
                <div className="inline-block px-6 py-3 bg-green-500/20 border border-green-500/40 rounded-full mb-6">
                  <span className="text-green-400 text-lg font-bold uppercase tracking-wide">
                    System Status: Operational
                  </span>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-center items-center gap-4">
                    <span className="text-gray-400">Orchestration Layer:</span>
                    <span className="text-white font-bold">Live</span>
                  </div>
                  <div className="flex justify-center items-center gap-4">
                    <span className="text-gray-400">Infrastructure:</span>
                    <span className="text-white font-bold">Demand-Driven</span>
                  </div>
                  <div className="flex justify-center items-center gap-4">
                    <span className="text-gray-400">Available for Licensing:</span>
                    <span className="text-[hsl(var(--primary))] font-bold">Now</span>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="inline-block px-10 py-4 bg-[hsl(var(--primary))] text-black font-black rounded-xl hover:scale-105 transition-transform text-lg"
                >
                  Contact for Licensing
                </Link>
              </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </div>
  );
}