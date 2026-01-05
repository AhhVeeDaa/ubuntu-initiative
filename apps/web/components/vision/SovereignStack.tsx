'use client';

import { Waves, Database, Code, TrendingUp, Zap } from 'lucide-react';

export function SovereignStack() {
  const layers = [
    {
      id: 4,
      title: 'Economic Layer',
      subtitle: 'The African Digital Market',
      description: 'Internal value creation - African data stays in Africa, processed by African compute, creating African wealth.',
      icon: TrendingUp,
      color: '#10b981', // Green
      glow: '0 0 40px rgba(16, 185, 129, 0.3)',
      metrics: 'Target: $50B+ annual GDP'
    },
    {
      id: 3,
      title: 'Software Layer',
      subtitle: 'Ubuntu-OS Framework',
      description: 'Sovereign AI stack - African language models, culturally-aligned training data, open-source foundation models.',
      icon: Code,
      color: '#a855f7', // Purple
      glow: '0 0 40px rgba(168, 85, 247, 0.3)',
      metrics: '10+ ExaFLOPS (FP16)'
    },
    {
      id: 2,
      title: 'Infrastructure Layer',
      subtitle: 'Tier IV Data Centers',
      description: 'High-density compute clusters with closed-loop liquid cooling, terabit connectivity, 99.995% uptime SLA.',
      icon: Database,
      color: 'hsl(var(--accent))', // Gold
      glow: '0 0 40px rgba(234, 179, 8, 0.3)',
      metrics: 'Phase 1: 500MW capacity'
    },
    {
      id: 1,
      title: 'Physical Layer',
      subtitle: 'Inga Hydropower',
      description: 'Energy independence - 100% renewable baseload power from the Congo River, no fossil fuel dependency.',
      icon: Waves,
      color: 'hsl(var(--primary))', // Cyan
      glow: '0 0 40px rgba(34, 211, 238, 0.3)',
      metrics: '4,800MW total capacity'
    }
  ];

  return (
    <div className="space-y-16 py-12">
      {/* Header */}
      <div className="text-center mb-16 px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          The <span className="text-gradient">Sovereign Stack</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          A four-layer vertical architecture ensuring total independence—from the physical water molecules to the economic value they generate.
        </p>
      </div>

      {/* Stack Visualization */}
      <div className="relative max-w-5xl mx-auto px-4">
        {/* Core Power Line (glowing) */}
        <div className="absolute left-[50px] md:left-[80px] top-0 bottom-0 w-1 bg-white/5 overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500 via-purple-500 via-yellow-500 to-cyan-500 opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-transparent h-40 animate-[flow-down_4s_linear_infinite]" />
        </div>

        {/* Layers */}
        <div className="space-y-12">
          {layers.map((layer) => (
            <div key={layer.id} className="relative group pl-24 md:pl-40">
              {/* Illuminated Node */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <div
                  className="w-[100px] h-[100px] md:w-[160px] md:h-[160px] rounded-full bg-black/40 border-2 backdrop-blur-3xl flex items-center justify-center transition-all duration-500 animate-glow-breath group-hover:scale-110"
                  style={{
                    borderColor: `${layer.color}40`,
                    boxShadow: layer.glow,
                    color: layer.color
                  } as any}
                >
                  <layer.icon className="h-10 w-10 md:h-16 md:w-16" />

                  {/* Layer Number Badge */}
                  <div
                    className="absolute -top-2 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter bg-black border border-current"
                  >
                    LEVEL 0{layer.id}
                  </div>
                </div>
              </div>

              {/* Content Panel */}
              <div className="bg-black/20 border border-white/5 rounded-[32px] p-8 md:p-10 backdrop-blur-xl group-hover:bg-white/5 group-hover:border-white/10 transition-all duration-500 relative overflow-hidden">
                {/* Subtle side glow */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 opacity-50"
                  style={{ backgroundColor: layer.color }}
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-1 uppercase tracking-tight">
                      {layer.title}
                    </h3>
                    <p className="text-[hsl(var(--accent))] font-bold text-sm tracking-wide">
                      {layer.subtitle}
                    </p>
                  </div>
                  <div
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black tracking-widest uppercase flex items-center gap-2"
                    style={{ color: layer.color }}
                  >
                    <Zap className="h-3 w-3" />
                    {layer.metrics}
                  </div>
                </div>

                <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
                  {layer.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy Panel */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-white/10 to-transparent p-0.5 rounded-[40px]">
          <div className="bg-black/80 rounded-[39px] p-10 md:p-16 border border-white/5 text-center">
            <h4 className="text-white font-black text-2xl mb-6 uppercase tracking-widest">
              The Path to Independence
            </h4>
            <p className="text-gray-400 text-xl leading-relaxed italic">
              "Digital sovereignty isn't just about owning servers—it's about controlling every layer from energy generation to economic value creation."
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes flow-down {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
      `}</style>
    </div>
  );
}
