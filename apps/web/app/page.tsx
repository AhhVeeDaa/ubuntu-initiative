import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/ui/HeroSection';
import { IngaChatWrapper } from '@/components/ai/IngaChatWrapper';
import { ImpactDonation } from '@/components/stripe/ImpactDonation';
import { Cpu, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        <HeroSection />

        {/* Campaign / Funding Section - High Visibility */}
        <div id="support" className="border-b border-white/10 bg-black/40">
          <ImpactDonation />
        </div>

        {/* Mission Section */}
        <section id="mission" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-black -z-20" />
          <div className="absolute inset-0 opacity-30 -z-10">
            <img
              src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=2000"
              alt="Hydropower background"
              className="w-full h-full object-cover blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
                Why This <span className="text-gradient">Matters</span> Now
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-gray-400 font-medium">
                The AI infrastructure being built today determines who controls intelligence for the next 50 years.
                We're building Africa's first sovereign compute engine.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] backdrop-blur-3xl relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[hsl(var(--accent))] opacity-50" />
                  <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">The Inga Advantage</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    The Inga Falls on the Congo River represents the world's largest untapped hydropower potential—
                    42,000 MW capacity. This isn't just power; it's the heartbeat of a new digital era.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      '100% Clean Energy',
                      'Lowest Global Cost',
                      'African Sovereign Data',
                      '60M+ Lives Impacted'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-white font-bold">
                        <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 bg-[hsl(var(--primary))] opacity-20 blur-3xl group-hover:opacity-30 transition-opacity animate-glow-breath" />
                <div className="relative h-[450px] rounded-[48px] overflow-hidden border-2 border-white/10 shadow-2xl">
                  <img
                    src="/inga_falls_majestic.png"
                    alt="Majestic Inga Falls"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-8 left-8">
                    <p className="text-white font-black text-2xl uppercase tracking-widest">INGA FALLS</p>
                    <p className="text-[hsl(var(--primary))] font-bold italic">42GW Unlocked Potential</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Human Impact Section */}
        <section className="py-32 relative bg-[#05080f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="order-2 lg:order-1 relative group">
                <div className="absolute -inset-4 bg-green-500 opacity-20 blur-3xl group-hover:opacity-30 transition-opacity animate-glow-breath" />
                <div className="relative h-[500px] rounded-[48px] overflow-hidden border-2 border-white/10">
                  <img
                    src="/drc_electrified_community.png"
                    alt="Electrified DRC Community"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-8 left-8">
                    <p className="text-white font-black text-2xl uppercase tracking-widest leading-none">Powering</p>
                    <p className="text-green-400 font-black text-4xl uppercase tracking-tight">60 Million Lives</p>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-10">
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight">
                  Beyond <span className="text-green-400">Computing</span>
                </h2>
                <p className="text-gray-400 text-xl leading-relaxed">
                  The Ubuntu Initiative creates a massive surplus of clean power.
                  By securing the anchor Load for AI, we unlock the financing needed to electrify
                  households, hospitals, and schools across the Congo Basin.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-all group">
                    <div className="text-5xl font-black text-green-400 mb-2 group-hover:scale-110 transition-transform origin-left">60M+</div>
                    <div className="text-gray-500 font-bold uppercase tracking-widest text-xs">People Gaining Access</div>
                  </div>
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[hsl(var(--accent))]/30 transition-all group">
                    <div className="text-5xl font-black text-[hsl(var(--accent))] mb-2 group-hover:scale-110 transition-transform origin-left">100%</div>
                    <div className="text-gray-500 font-bold uppercase tracking-widest text-xs">Clean Renewables</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI & Compute Section (Visual Hero) */}
        <section className="py-24 bg-black relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative h-[400px] md:h-[600px] rounded-[64px] overflow-hidden border-2 border-purple-500/20 group">
              <img
                src="/ai_supercomputer_datacenter.png"
                alt="AI Supercomputer Data Center"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <div className="w-20 h-20 rounded-full bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center mb-6 animate-glow-breath" style={{ color: '#a855f7' } as any}>
                  <Cpu className="h-10 w-10 text-purple-400" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                  Sovereign <span className="text-purple-400">Intelligence</span>
                </h2>
                <p className="text-gray-300 text-xl max-w-2xl font-medium">
                  Built on Congolese energy. Trained on African data. Controlled by African nations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Control CTA */}
        <section id="dashboard" className="py-24 bg-gradient-to-b from-black to-[#05080f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 mb-4 uppercase tracking-tighter">Mission Control</h2>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
              Access real-time monitoring of the Inga compute cluster, node status, and system metrics.
            </p>
            <a
              href="https://ubuntu-initiative-dashboard.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-[hsl(var(--primary))] to-cyan-400 text-black rounded-full transition-all font-black text-xl uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]"
            >
              <Zap className="w-6 h-6 mr-3" />
              Open Dashboard
            </a>
          </div>
        </section>

        {/* AI Assistant Section */}
        <section id="ai-assistant" className="py-24 bg-black relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[hsl(var(--primary))]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Ask Inga <span className="text-purple-400">Intelligence</span></h2>
              <p className="text-gray-400 text-lg">Our sovereign AI agent is ready to answer your questions about the initiative.</p>
            </div>

            <div className="mx-auto">
              <IngaChatWrapper />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
