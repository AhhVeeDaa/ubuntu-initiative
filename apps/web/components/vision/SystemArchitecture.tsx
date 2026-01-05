'use client';

import { Waves, Zap, Cpu, Home, ArrowRight, Battery } from 'lucide-react';
import Image from 'next/image';

export function SystemArchitecture() {
  return (
    <div className="relative">
      {/* Section Header */}
      <div className="text-center mb-16 px-4">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
          THE <span className="text-[hsl(var(--primary))]">ENERGY-TO-COMPUTE</span> FLOW
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed font-light">
          Our anchor tenant model: A dedicated Power Purchase Agreement (PPA) for AI compute
          triggers the construction of Inga 3, with surplus capacity
          electrifying millions of lives.
        </p>
      </div>

      {/* Flow Diagram */}
      <div className="relative px-4 pb-20">
        {/* Connection Line with Flowing Animation (Desktop) */}
        <div className="hidden lg:block absolute top-[140px] left-0 right-0 h-1 bg-white/5 -z-10 overflow-hidden rounded-full max-w-7xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--primary))]/50 to-transparent animate-[flow_3s_linear_infinite]" />
        </div>

        {/* Desktop Flow (horizontal) */}
        <div className="hidden lg:block relative z-10">
          <div className="flex items-start justify-between relative max-w-7xl mx-auto gap-4">

            {/* Node 1: Inga Falls */}
            <div className="flex flex-col items-center flex-1 group">
              <div className="relative w-full aspect-square max-w-[240px] mb-8">
                <div className="absolute -inset-4 bg-[hsl(var(--primary))] opacity-20 blur-2xl rounded-full group-hover:opacity-40 transition-opacity animate-pulse-slow" />
                <div className="relative h-full w-full rounded-3xl overflow-hidden border-2 border-[hsl(var(--primary))]/30 group-hover:border-[hsl(var(--primary))] transition-all duration-500 shadow-2xl">
                  <Image
                    src="/images/vision/inga-falls.jpg"
                    alt="Inga Falls"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <Waves className="h-8 w-8 text-[hsl(var(--primary))]" />
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-[hsl(var(--primary))] text-black font-black w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 border-black rotate-3">1</div>
              </div>
              <div className="text-center bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-[220px]">
                <h3 className="text-white font-bold text-xl mb-1">Inga Falls</h3>
                <p className="text-[hsl(var(--primary))] text-2xl font-black">42GW</p>
                <p className="text-gray-500 text-xs mt-2 leading-tight uppercase tracking-wider">World's largest untapped hydropower reserve</p>
              </div>
            </div>

            {/* Connection Arrow */}
            <div className="mt-28 opacity-20 group-hover:opacity-40 transition-opacity">
              <ArrowRight className="h-8 w-8 text-white" />
            </div>

            {/* Node 2: Ubuntu PPA (The Spark) */}
            <div className="flex flex-col items-center flex-1 group">
              <div className="relative w-full aspect-square max-w-[240px] mb-8">
                <div className="absolute -inset-4 bg-[hsl(var(--accent))] opacity-20 blur-2xl rounded-full group-hover:opacity-40 transition-opacity animate-pulse-slow" />
                <div className="relative h-full w-full rounded-3xl overflow-hidden border-2 border-[hsl(var(--accent))]/50 group-hover:border-[hsl(var(--accent))] transition-all duration-500 shadow-2xl bg-black/40 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Battery className="h-16 w-16 text-[hsl(var(--accent))] mx-auto mb-4 animate-pulse" />
                    <div className="h-1 w-12 bg-[hsl(var(--accent))]/40 mx-auto rounded-full" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent))]/10 to-transparent" />
                </div>
                <div className="absolute -top-3 -right-3 bg-[hsl(var(--accent))] text-black font-black w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 border-black -rotate-3">2</div>
              </div>
              <div className="text-center bg-white/5 p-5 rounded-2xl border border-[hsl(var(--accent))]/30 backdrop-blur-xl w-full max-w-[220px] ring-1 ring-[hsl(var(--accent))]/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[hsl(var(--accent))] text-black text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap tracking-tighter">THE CATALYST / PPA</div>
                <h3 className="text-white font-bold text-xl mb-1">Ubuntu PPA</h3>
                <p className="text-[hsl(var(--accent))] text-2xl font-black">500MW</p>
                <p className="text-gray-500 text-xs mt-2 leading-tight uppercase tracking-wider">20-year commitment triggers construction</p>
              </div>
            </div>

            {/* Connection Arrow */}
            <div className="mt-28 opacity-20">
              <ArrowRight className="h-8 w-8 text-white" />
            </div>

            {/* Node 3: AI Supercomputer */}
            <div className="flex flex-col items-center flex-1 group">
              <div className="relative w-full aspect-square max-w-[240px] mb-8">
                <div className="absolute -inset-4 bg-purple-500 opacity-20 blur-2xl rounded-full group-hover:opacity-40 transition-opacity animate-pulse-slow" />
                <div className="relative h-full w-full rounded-3xl overflow-hidden border-2 border-purple-500/30 group-hover:border-purple-500 transition-all duration-500 shadow-2xl">
                  <Image
                    src="/images/vision/ai-compute.jpg"
                    alt="AI Compute"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <Cpu className="h-8 w-8 text-purple-400" />
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-purple-500 text-white font-black w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 border-black rotate-6">3</div>
              </div>
              <div className="text-center bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-[220px]">
                <h3 className="text-white font-bold text-xl mb-1">AI Compute</h3>
                <p className="text-purple-400 text-2xl font-black">10+ EXA</p>
                <p className="text-gray-500 text-xs mt-2 leading-tight uppercase tracking-wider">Sovereign intelligence for the continent</p>
              </div>
            </div>

            {/* Connection Arrow */}
            <div className="mt-28 opacity-20">
              <ArrowRight className="h-8 w-8 text-white" />
            </div>

            {/* Node 4: Regional Grid */}
            <div className="flex flex-col items-center flex-1 group">
              <div className="relative w-full aspect-square max-w-[240px] mb-8">
                <div className="absolute -inset-4 bg-green-500 opacity-20 blur-2xl rounded-full group-hover:opacity-40 transition-opacity animate-pulse-slow" />
                <div className="relative h-full w-full rounded-3xl overflow-hidden border-2 border-green-500/30 group-hover:border-green-500 transition-all duration-500 shadow-2xl">
                  <Image
                    src="/images/vision/impact.jpg"
                    alt="Regional Impact"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <Home className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-green-500 text-white font-black w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 border-black -rotate-6">4</div>
              </div>
              <div className="text-center bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-xl w-full max-w-[220px]">
                <h3 className="text-white font-bold text-xl mb-1">Regional Grid</h3>
                <p className="text-green-400 text-2xl font-black">60M+</p>
                <p className="text-gray-500 text-xs mt-2 leading-tight uppercase tracking-wider">Surplus power electrifying the DRC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Flow (stacked) */}
        <div className="lg:hidden space-y-12">
          {[
            { id: 1, title: 'Inga Falls', value: '42GW Potential', desc: 'Raw energy source', color: 'hsl(var(--primary))', icon: Waves, img: '/images/vision/inga-falls.jpg' },
            { id: 2, title: 'Ubuntu PPA', value: '500MW Dedicated', desc: 'The anchor load', color: 'hsl(var(--accent))', icon: Battery, highlight: true },
            { id: 3, title: 'AI Compute', value: '10+ Exaflops', desc: 'Sovereign intelligence', color: '#a855f7', icon: Cpu, img: '/images/vision/ai-compute.jpg' },
            { id: 4, title: 'Regional Grid', value: '60M+ Lives', desc: 'Electrifying the nation', color: '#10b981', icon: Home, img: '/images/vision/impact.jpg' },
          ].map((node, i, arr) => (
            <div key={node.id} className="flex flex-col items-center">
              <div className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-black border border-white/10 shadow-2xl">
                {node.img && (
                  <div className="h-48 w-full relative">
                    <Image src={node.img} alt={node.title} fill className="object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  </div>
                )}
                <div className={`p-8 relative ${!node.img ? 'bg-white/5 pt-12' : ''}`}>
                  <div
                    className="absolute -top-8 right-8 p-5 rounded-2xl border-2 bg-black/80 backdrop-blur-xl shadow-xl"
                    style={{ borderColor: `${node.color}50`, color: node.color } as any}
                  >
                    <node.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-white font-bold text-3xl mb-1 tracking-tight uppercase">{node.title}</h3>
                  <p className="text-2xl font-black mb-3" style={{ color: node.color }}>{node.value}</p>
                  <p className="text-gray-400 text-lg font-light leading-snug">{node.desc}</p>

                  {node.highlight && (
                    <div className="mt-6 bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/30 rounded-xl px-4 py-2 inline-block">
                      <p className="text-xs font-black text-[hsl(var(--accent))] tracking-widest uppercase">The Trigger Component</p>
                    </div>
                  )}
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className="flex flex-col items-center py-6">
                  <div className="h-16 w-0.5 bg-gradient-to-b from-white/20 to-transparent" />
                  <Zap className="h-6 w-6 text-[hsl(var(--accent))]/40 animate-pulse" />
                  <div className="h-16 w-0.5 bg-gradient-to-t from-white/20 to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy Callout */}
      <div className="px-4">
        <div className="p-[1px] rounded-[2.5rem] bg-gradient-to-r from-[hsl(var(--primary))]/30 via-[hsl(var(--accent))]/30 to-purple-500/30 max-w-5xl mx-auto shadow-3xl">
          <div className="bg-[#050810]/95 backdrop-blur-3xl rounded-[2.45rem] p-8 md:p-16 border border-white/5">
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[hsl(var(--accent))] to-orange-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                <Zap className="h-10 w-10 text-black stroke-[3px]" />
              </div>
              <div>
                <h4 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tighter italic">Why the "Anchor Tenant" model works</h4>
                <p className="text-gray-400 leading-relaxed text-xl font-light">
                  Large-scale infrastructure projects like Inga 3 often fail because they lack a <strong className="text-white font-bold italic">guaranteed buyer</strong>.
                  By committing to a <strong className="text-[hsl(var(--accent))] font-bold italic">20-year Power Purchase Agreement</strong> for AI compute,
                  we provide the bankable revenue certainty that investors need to fund construction.
                  We aren't just buying power; we are <strong className="text-white font-bold italic">enabling the grid</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes glow-breath {
          0%, 100% { transform: scale(1); opacity: 0.2; blur: 20px; }
          50% { transform: scale(1.05); opacity: 0.4; blur: 30px; }
        }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-glow-breath {
          animation: glow-breath 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
