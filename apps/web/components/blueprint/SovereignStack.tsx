'use client';

import { Waves, Database, Code, TrendingUp, Zap } from 'lucide-react';

export function SovereignStack() {
  const layers = [
    { id: 4, title: 'Economic Layer', color: '#10b981', icon: TrendingUp },
    { id: 3, title: 'Software Layer', color: '#a855f7', icon: Code },
    { id: 2, title: 'Infrastructure Layer', color: 'hsl(var(--accent))', icon: Database },
    { id: 1, title: 'Physical Layer', color: 'hsl(var(--primary))', icon: Waves },
  ];

  return (
    <div className="py-20 relative">
      <div className="text-center mb-20 px-4">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
          The <span className="text-gradient">Sovereign Stack</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          The four integrated tiers of African digital independence.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-12">
        {layers.map((layer) => (
          <div key={layer.id} className="group relative pr-4">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -z-10 group-hover:scale-110 transition-transform">
              <div
                className="w-24 h-24 md:w-32 md:h-32 rounded-[28px] bg-black border-2 backdrop-blur-3xl flex items-center justify-center animate-glow-breath"
                style={{ borderColor: `${layer.color}40`, color: layer.color, boxShadow: `0 0 30px ${layer.color}20` } as any}
              >
                <layer.icon className="h-10 w-10 md:h-14 md:w-14" />
              </div>
            </div>

            <div className="ml-16 md:ml-24 bg-[#0a0f1a] border border-white/5 rounded-[40px] p-8 md:p-12 hover:bg-white/5 transition-all duration-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <layer.icon className="w-32 h-32" style={{ color: layer.color }} />
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-black italic opacity-20" style={{ color: layer.color }}>L0{layer.id}</span>
                <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">{layer.title}</h3>
              </div>

              <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl relative z-10">
                Dedicated sovereign control over {layer.title.toLowerCase()}, ensuring that {
                  layer.id === 1 ? 'energy resources' :
                    layer.id === 2 ? 'data centers' :
                      layer.id === 3 ? 'software systems' :
                        'economic value'
                } remain under pan-African oversight.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}