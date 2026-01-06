import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Ubuntu Initiative | Energy into Intelligence',
  description: 'A sovereign intelligence infrastructure converting renewable energy into local compute, ethical AI systems, and shared prosperity.',
};

import Image from 'next/image';

// ... (other imports)

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section - Grounding Statement */}
        {/* Hero Image Section */}
        <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-infrastructure.jpg"
              alt="Ubuntu Initiative Infrastructure"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            {/* Subtle overlay for atmosphere, but keeping image clear */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
          </div>

          {/* Optional: Minimal Overlay Title/Brand if needed, or keeping it clean as pure visual */}
          <div className="absolute bottom-10 left-0 right-0 text-center z-10">
            <p className="text-white/80 font-mono text-sm uppercase tracking-widest mb-4">Infrastructure First</p>
          </div>
        </section>

        {/* Hero Text Section - Now Below Image */}
        <section className="relative py-20 px-4 bg-black">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Energy into Intelligence.<br />
              Intelligence into <span className="text-[hsl(var(--primary))]">Sovereignty</span>.
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-12 max-w-3xl mx-auto font-medium">
              Ubuntu AI is a sovereign intelligence infrastructure that converts renewable energy
              into local compute, ethical AI systems, and shared prosperity.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
              It exists to ensure Africa is not only a consumer of global AI — but a producer,
              steward, and beneficiary of intelligence itself.
            </p>
          </div>
        </section>

        {/* The Stack - Visual */}
        <section className="py-20 px-4 bg-white/5">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-black text-white text-center mb-16 uppercase">
              From Natural Power to Collective Intelligence
            </h2>
            <p className="text-lg text-gray-400 text-center mb-12 max-w-3xl mx-auto leading-relaxed">
              Ubuntu AI begins with what already exists in abundance: natural energy. Instead of exporting
              raw power and importing intelligence, Ubuntu AI transforms energy at the source into computation,
              modeling, and decision-making capacity — owned locally and governed responsibly.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-8 bg-black rounded-2xl border border-white/10">
              {[
                { label: 'River', color: 'bg-blue-500' },
                { label: 'Power', color: 'bg-yellow-500' },
                { label: 'Compute', color: 'bg-purple-500' },
                { label: 'AI', color: 'bg-cyan-500' },
                { label: 'Community', color: 'bg-green-500' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`${step.color} w-24 h-24 rounded-xl flex items-center justify-center`}>
                    <span className="text-black font-black text-sm uppercase">{step.label}</span>
                  </div>
                  {i < 4 && (
                    <ArrowRight className="text-gray-600 hidden md:block" size={24} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-gray-500 text-sm mt-6">
              A closed, sovereign loop
            </p>
          </div>
        </section>

        {/* The Problem */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-white mb-12 uppercase">
              The Problem We Address
            </h2>
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-bold mb-2">Today:</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span>Energy-rich regions export raw resources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span>Intelligence infrastructure is concentrated elsewhere</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span>Data leaves, value returns slowly — or not at all</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span>AI systems are built about communities, not with them</span>
                  </li>
                </ul>
              </div>
              <p className="text-lg text-gray-300 italic text-center pt-4">
                This is not a technological failure. It is an infrastructural one.
              </p>
            </div>
          </div>
        </section>

        {/* Contrast Table */}
        <section className="py-20 px-4 bg-white/5">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-black text-white mb-12 uppercase text-center">
              The Ubuntu AI Model
            </h2>
            <p className="text-lg text-gray-400 text-center mb-12">
              Ubuntu AI reverses the flow.
            </p>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5">
                    <th className="p-4 text-left text-red-400 font-black uppercase text-sm">
                      Conventional Model
                    </th>
                    <th className="p-4 text-left text-green-400 font-black uppercase text-sm">
                      Ubuntu AI
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Export energy', 'Convert energy to intelligence'],
                    ['Centralized foreign compute', 'Local sovereign compute'],
                    ['Extractive data use', 'Stewarded data governance'],
                    ['Shareholder-first', 'Community-first value'],
                    ['Reactive systems', 'Anticipatory intelligence'],
                  ].map(([conventional, ubuntu], i) => (
                    <tr key={i} className="border-t border-white/5">
                      <td className="p-4 text-gray-400 bg-black">{conventional}</td>
                      <td className="p-4 text-gray-300 bg-black font-medium">{ubuntu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-center text-lg text-gray-400 mt-8 italic">
              Ubuntu AI treats intelligence as infrastructure, not a product.
            </p>
          </div>
        </section>

        {/* What Exists Today */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-white mb-6 uppercase">
              What Exists Today
            </h2>
            <p className="text-lg text-gray-400 mb-12">
              Ubuntu AI is not speculative.
            </p>

            <div className="space-y-4">
              {[
                'A defined energy-to-compute architecture',
                'Governance and ethical frameworks aligned with African and global standards',
                'Institutional engagement and policy alignment',
                'Early-stage infrastructure planning',
                'A growing ecosystem of contributors and advisors',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <Check className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-gray-500 text-sm mt-8 text-center">
              Each component is designed to mature independently — and integrate seamlessly.
            </p>
          </div>
        </section>

        {/* What Ubuntu AI Enables */}
        <section className="py-20 px-4 bg-white/5">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-black text-white mb-12 uppercase text-center">
              What Ubuntu AI Enables
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                'Energy optimization & resilience',
                'Climate and environmental intelligence',
                'Public infrastructure planning',
                'Economic modeling & development policy',
                'Education, research, and local innovation',
                'Healthcare and agricultural systems',
              ].map((domain, i) => (
                <div key={i} className="p-6 bg-black border border-white/10 rounded-xl">
                  <h3 className="text-white font-bold mb-2">{domain}</h3>
                  <div className="h-1 w-12 bg-[hsl(var(--primary))] rounded" />
                </div>
              ))}
            </div>

            <p className="text-center text-lg text-gray-400 mt-12 max-w-2xl mx-auto leading-relaxed">
              All built on the principle that those closest to the resource should benefit most from its intelligence.
            </p>
          </div>
        </section>

        {/* Governance */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black text-white mb-6 uppercase">
              Governed, Not Extracted
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                'Community benefit structures',
                'Transparent governance',
                'Long-term stewardship',
                'Intergenerational responsibility',
              ].map((principle, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-gray-300 text-sm font-medium">{principle}</p>
                </div>
              ))}
            </div>

            <p className="text-lg text-gray-400 mt-12 italic">
              Technology here is not neutral. It is deliberate.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 bg-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black text-white mb-6 uppercase">
              An Invitation
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Ubuntu AI is an infrastructure initiative in formation — open to:
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {['Governments', 'Institutions', 'Engineers', 'Researchers', 'Communities'].map((group, i) => (
                <div key={i} className="px-6 py-3 bg-black border border-white/10 rounded-full">
                  <span className="text-white font-medium">{group}</span>
                </div>
              ))}
            </div>

            <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Those who believe intelligence should serve people, place, and future generations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/philosophy"
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
              <Link
                href="/support"
                className="px-8 py-4 bg-[hsl(var(--accent))] text-black font-black rounded-xl hover:scale-105 transition-transform"
              >
                Support Ubuntu AI
              </Link>
            </div>
          </div>
        </section>

        {/* Final Statement */}
        <section className="py-32 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="space-y-6 mb-12">
              <p className="text-2xl text-[hsl(var(--primary))] font-black uppercase tracking-wider">
                Energy → Intelligence → Sovereignty
              </p>
              <p className="text-xl text-gray-400">
                This is not a platform. This is not a product.
              </p>
              <p className="text-3xl text-white font-black uppercase">
                This is infrastructure for the century ahead.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
