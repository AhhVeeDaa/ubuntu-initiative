'use client';

import { Waves, Database, Code, TrendingUp } from 'lucide-react';

export function SovereignStack() {
  const layers = [
    {
      id: 4,
      title: 'Economic Layer',
      subtitle: 'The African Digital Market',
      description: 'Internal value creation - African data stays in Africa, processed by African compute, creating African wealth',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-500/20 to-green-500/5',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      metrics: 'Target: $50B+ annual GDP contribution by 2035'
    },
    {
      id: 3,
      title: 'Software Layer',
      subtitle: 'Ubuntu-OS Framework',
      description: 'Sovereign AI stack - African language models, culturally-aligned training data, open-source foundation models',
      icon: Code,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-500/20 to-purple-500/5',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      metrics: '10+ ExaFLOPS (FP16) for LLM training'
    },
    {
      id: 2,
      title: 'Infrastructure Layer',
      subtitle: 'Tier IV Data Centers',
      description: 'High-density compute clusters with closed-loop liquid cooling, terabit connectivity, 99.995% uptime SLA',
      icon: Database,
      color: 'from-[hsl(var(--accent))] to-orange-600',
      bgColor: 'from-[hsl(var(--accent))]/20 to-[hsl(var(--accent))]/5',
      borderColor: 'border-[hsl(var(--accent))]/30',
      textColor: 'text-[hsl(var(--accent))]',
      metrics: 'Phase 1: 500MW dedicated capacity'
    },
    {
      id: 1,
      title: 'Physical Layer',
      subtitle: 'Inga Hydropower',
      description: 'Energy independence - 100% renewable baseload power from the Congo River, no fossil fuel dependency',
      icon: Waves,
      color: 'from-[hsl(var(--primary))] to-blue-600',
      bgColor: 'from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5',
      borderColor: 'border-[hsl(var(--primary))]/30',
      textColor: 'text-[hsl(var(--primary))]',
      metrics: '4,800MW total | Zero carbon emissions'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          The Sovereign Stack
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto">
          Four integrated layers working in harmony to create true technological sovereignty—
          from clean energy at the foundation to economic value creation at the top
        </p>
      </div>

      {/* Stack Visualization */}
      <div className="relative max-w-4xl mx-auto">
        {/* Vertical connecting line */}
        <div className="absolute left-12 md:left-16 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[hsl(var(--primary))] via-[hsl(var(--accent))] to-green-500 opacity-30" />

        {/* Layers */}
        <div className="space-y-6">
          {layers.map((layer, index) => (
            <div key={layer.id} className="relative group">
              {/* Layer number indicator */}
              <div className="absolute left-0 md:left-0 flex items-center justify-center">
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${layer.bgColor} border-2 ${layer.borderColor} backdrop-blur-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <layer.icon className={`h-10 w-10 md:h-12 md:w-12 ${layer.textColor}`} />
                </div>
              </div>

              {/* Layer content */}
              <div className="ml-32 md:ml-40 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-2xl font-bold ${layer.textColor}`}>
                        L{layer.id}
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        {layer.title}
                      </h3>
                    </div>
                    <p className="text-sm font-medium text-gray-400 mb-2">
                      {layer.subtitle}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  {layer.description}
                </p>

                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${layer.bgColor} ${layer.borderColor} border`}>
                  <span className={layer.textColor}>{layer.metrics}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Foundation Principle */}
      <div className="mt-12 bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--accent))]/10 border border-[hsl(var(--primary))]/30 rounded-xl p-8 backdrop-blur-xl">
        <h4 className="text-white font-bold text-lg mb-3 text-center">
          🏛️ The Foundation Principle
        </h4>
        <p className="text-gray-300 text-center leading-relaxed max-w-3xl mx-auto">
          Each layer depends on the one below it. Without sovereign <strong className="text-[hsl(var(--primary))]">energy</strong> (L1), 
          there is no sovereign <strong className="text-[hsl(var(--accent))]">infrastructure</strong> (L2). Without sovereign infrastructure, 
          there is no sovereign <strong className="text-purple-400">software</strong> (L3). And without sovereign software, 
          there is no <strong className="text-green-400">economic independence</strong> (L4). This is not a technology 
          project—it is a <strong className="text-white">civilizational architecture</strong>.
        </p>
      </div>
    </div>
  );
}
