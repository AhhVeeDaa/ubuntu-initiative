'use client';

import { Droplet, Zap, Cpu, Globe, Shield, Layers } from 'lucide-react';

export function TechSpecs() {
  const specs = [
    {
      category: 'Power Source',
      icon: Zap,
      color: '#22d3ee', // Cyan
      glow: '0 0 20px rgba(34, 211, 238, 0.2)',
      value: 'Run-of-River Hydro',
      details: 'Inga 3 Expansion (4,800MW total capacity)',
      list: [
        '500MW dedicated to Ubuntu compute via PPA',
        '4,300MW surplus to DRC regional grid',
        '100% renewable, zero carbon emissions',
        'Baseload capacity (24/7/365 availability)'
      ]
    },
    {
      category: 'Compute Target',
      icon: Cpu,
      color: '#a855f7', // Purple
      glow: '0 0 20px rgba(168, 85, 247, 0.2)',
      value: '10+ ExaFLOPS',
      details: 'FP16 precision for LLM training',
      list: [
        'Focus: African language models (Swahili, Hausa, etc.)',
        'Training corpus: 10T+ tokens of African content',
        'Custom silicon: NVIDIA H200/B200 class GPUs',
        'Phase 1 target: 50,000+ GPU cluster'
      ]
    },
    {
      category: 'Cooling System',
      icon: Droplet,
      color: '#3b82f6', // Blue
      glow: '0 0 20px rgba(59, 130, 246, 0.2)',
      value: 'Closed-Loop Liquid',
      details: 'Congo River heat exchange',
      list: [
        'Direct liquid-to-chip cooling (DLC)',
        'Heat exchangers using Congo River water',
        'PUE target: <1.15 (industry leading)',
        'Zero water consumption (closed system)'
      ]
    },
    {
      category: 'Connectivity',
      icon: Globe,
      color: 'hsl(var(--accent))', // Gold
      glow: '0 0 20px rgba(234, 179, 8, 0.2)',
      value: 'Terabit Fiber',
      details: 'Multi-path redundant links',
      list: [
        'Primary link: 1+ Tbps fiber to Kinshasa',
        'Subsea cables via Muanda (Atlantic access)',
        'Direct peering with African IXPs',
        'Latency: <50ms to major African hubs'
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center md:text-left mb-12">
        <h3 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tight">
          Phase 1 <span className="text-[hsl(var(--primary))]">Technical Specifications</span>
        </h3>
        <p className="text-gray-400 text-lg max-w-2xl">
          The infrastructure requirements for Africa's first sovereign AI supercomputer, built for extreme efficiency and reliability.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {specs.map((spec, index) => (
          <div
            key={index}
            className="group relative bg-[#0a0f1a] border-2 rounded-[32px] p-8 md:p-10 transition-all duration-500 overflow-hidden hover:scale-[1.02]"
            style={{
              borderColor: `${spec.color}20`,
              boxShadow: spec.glow
            } as any}
          >
            {/* Background Glow */}
            <div
              className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-10 transition-opacity group-hover:opacity-20"
              style={{ backgroundColor: spec.color }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-8">
                <div
                  className="w-16 h-16 rounded-2xl bg-black/40 border-2 flex items-center justify-center animate-glow-breath"
                  style={{ borderColor: `${spec.color}40`, color: spec.color } as any}
                >
                  <spec.icon className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-white font-black text-xl uppercase tracking-tighter">{spec.category}</h4>
                  <p className="text-gray-500 text-sm">{spec.details}</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-3xl font-black text-white" style={{ color: spec.color }}>
                  {spec.value}
                </p>
              </div>

              <ul className="space-y-4">
                {spec.list.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: spec.color }} />
                    <span className="text-gray-300 text-base leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* KPI Footer */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] p-12 backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--primary))] to-transparent opacity-30" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <p className="text-4xl font-black text-white mb-2 tracking-tighter">500MW</p>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Dedicated Power</p>
          </div>
          <div>
            <p className="text-4xl font-black text-white mb-2 tracking-tighter">1.15</p>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">PUE Target</p>
          </div>
          <div>
            <p className="text-4xl font-black text-white mb-2 tracking-tighter">Tier IV</p>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Reliability</p>
          </div>
          <div>
            <p className="text-4xl font-black text-white mb-2 tracking-tighter">100%</p>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Renewable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
