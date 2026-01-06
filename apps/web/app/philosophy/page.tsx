import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { InteractiveTabs } from '@/components/philosophy/InteractiveTabs';
import { Quote, Shield, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Philosophy | Ubuntu Initiative',
  description: 'The philosophical foundation of sovereign AI infrastructure for Africa',
};

import Image from 'next/image';

// ... (previous imports)

export default function PhilosophyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Grounding Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-infrastructure.jpg"
              alt="Ubuntu Philosophy Background"
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight leading-tight drop-shadow-lg">
              What Ubuntu AI Is <span className="text-[hsl(var(--primary))]">(In Plain Terms)</span>
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed mb-8 drop-shadow-md font-medium">
              Ubuntu AI is a sovereign intelligence infrastructure that converts renewable energy
              into local compute, ethical AI governance, and community-owned technological capacity.
            </p>
            <p className="text-xl text-gray-300 leading-relaxed drop-shadow-md">
              It exists to ensure Africa is not merely a consumer of global AI, but a producer,
              steward, and beneficiary of intelligence systems.
            </p>
          </div>
        </section>

        {/* Three Pillars */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-black text-white mb-12 uppercase tracking-tight">
            Three Pillars of Ubuntu AI
          </h2>

          <div className="space-y-6">
            <Pillar
              number="1"
              title="Relational Intelligence (Ubuntu)"
              description="Intelligence is communal, ecological, and intergenerational — not extractive or individualistic. The Ubuntu philosophy recognizes that intelligence emerges from relationships, not isolation."
            />
            <Pillar
              number="2"
              title="Sovereignty Through Infrastructure"
              description="True sovereignty requires ownership of energy, compute, data governance, and value creation. Without control of the technological stack, digital independence is impossible."
            />
            <Pillar
              number="3"
              title="Virtuous Machines vs Advanced Servitude"
              description="Technology must reinforce dignity and reciprocity, not dependency and extraction. We train machines to think like virtuous humans, not merely efficient calculators."
            />
          </div>
        </section>

        {/* Contrast Table */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-tight">
            Two Models of AI Development
          </h3>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="p-4 text-left text-red-400 font-black uppercase text-sm">
                    Extractive Model
                  </th>
                  <th className="p-4 text-left text-green-400 font-black uppercase text-sm">
                    Ubuntu Model
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Data exported', 'Data stewardship'],
                  ['Foreign compute', 'Local compute'],
                  ['Private extraction', 'Communal benefit'],
                  ['AI as control', 'AI as partner'],
                  ['Dependency', 'Sovereignty'],
                ].map(([extractive, ubuntu], i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="p-4 text-gray-400 bg-black">{extractive}</td>
                    <td className="p-4 text-gray-300 bg-black">{ubuntu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Visual Stack */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-tight text-center">
            The Infrastructure Stack
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'River → Dam', color: 'bg-blue-500' },
              { label: 'Power Generation', color: 'bg-yellow-500' },
              { label: 'Compute Infrastructure', color: 'bg-purple-500' },
              { label: 'AI Systems', color: 'bg-cyan-500' },
              { label: 'Community Benefit', color: 'bg-green-500' },
            ].map((layer, i) => (
              <div key={i} className="relative">
                <div className={`${layer.color} h-16 rounded-xl flex items-center justify-center`}>
                  <span className="text-black font-black text-lg uppercase tracking-wide">
                    {layer.label}
                  </span>
                </div>
                {i < 4 && (
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 text-gray-600">
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            Each layer enables and depends on the one below it
          </p>
        </section>

        {/* Hero Quote */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-tight">
              A Teleological <span className="text-[hsl(var(--primary))]">Return</span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              To return Africa to greatness is not to move forward into a foreign future, but to move{' '}
              <span className="text-[hsl(var(--accent))] font-bold italic">"Inward"</span> to the original Spark.
            </p>
          </div>
        </section>

        {/* Interactive Tabs */}
        <InteractiveTabs />

        {/* Manifesto Grid */}
        <section className="mt-32 max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-16 uppercase tracking-tighter">
            The Ubuntu Manifesto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Quote,
                title: 'Voice & Freedom',
                color: 'text-[hsl(var(--primary))]',
                bgColor: 'bg-[hsl(var(--primary))]/10',
                text: 'A community that does not speak in its own voice cannot be free.',
              },
              {
                icon: Shield,
                title: 'Virtuous Intelligence',
                color: 'text-purple-400',
                bgColor: 'bg-purple-500/10',
                text: 'Do not merely train this machine to speak like a man; train it to think like a virtuous man.',
              },
              {
                icon: Sparkles,
                title: 'The Inward Turn',
                color: 'text-[hsl(var(--accent))]',
                bgColor: 'bg-[hsl(var(--accent))]/10',
                text: 'To return Africa to greatness is not to move forward into a foreign future, but to move Inward to the original Spark.',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-[#0a0f1a] border border-white/10 rounded-[40px] p-10"
              >
                <div className={`w-16 h-16 rounded-2xl ${card.bgColor} flex items-center justify-center mb-8`}>
                  <card.icon className={`h-8 w-8 ${card.color}`} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
                  {card.title}
                </h3>
                <p className="text-gray-400 leading-relaxed italic">
                  "{card.text}"
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-40 text-center px-4">
          <div className="max-w-3xl mx-auto p-16 rounded-[64px] bg-white/5 border border-white/10">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">
              Join the <span className="text-[hsl(var(--primary))]">Return</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12 leading-relaxed">
              We are rebuilding a Polis that the world will once again look to for light.
            </p>
            <a
              href="/support"
              className="inline-block px-12 py-5 bg-[hsl(var(--accent))] text-black font-black uppercase tracking-widest rounded-full transition-transform hover:scale-105 active:scale-95"
            >
              Support the Mission
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Pillar({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <details className="group border border-white/10 rounded-xl p-6 bg-black">
      <summary className="cursor-pointer list-none">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/30 flex items-center justify-center flex-shrink-0">
            <span className="text-[hsl(var(--primary))] font-black text-sm">{number}</span>
          </div>
          <div className="flex-1 flex justify-between items-center">
            <h3 className="text-xl font-black text-white">{title}</h3>
            <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
          </div>
        </div>
      </summary>
      <p className="mt-4 ml-12 text-gray-400 leading-relaxed">
        {description}
      </p>
    </details>
  );
}
