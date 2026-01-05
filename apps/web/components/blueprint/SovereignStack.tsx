'use client'

import { Mountain, Building2, Code, TrendingUp, Layers } from 'lucide-react';

export function SovereignStack() {
  const layers = [
    {
      level: 4,
      title: 'Economic Layer',
      subtitle: 'The African Digital Market',
      description: 'Internal value creation through sovereign digital infrastructure',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-green-400',
      borderColor: 'border-green-500/40',
      details: ['Regional trade protocols', 'Digital currency systems', 'Pan-African data marketplace']
    },
    {
      level: 3,
      title: 'Software Layer',
      subtitle: 'Ubuntu-OS Framework',
      description: 'Sovereign AI trained on African languages and contexts',
      icon: Code,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/40',
      details: ['Multilingual LLMs', 'Federated learning protocols', 'Open-source AI tools']
    },
    {
      level: 2,
      title: 'Infrastructure Layer',
      subtitle: 'Tier IV Data Centers',
      description: 'High-density computing facilities built for resilience',
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/40',
      details: ['99.995% uptime SLA', 'Redundant power systems', 'Advanced cooling']
    },
    {
      level: 1,
      title: 'Physical Layer',
      subtitle: 'The Inga Dam',
      description: 'Energy independence through hydropower infrastructure',
      icon: Mountain,
      color: 'from-yellow-500 to-orange-500',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/40',
      details: ['42GW potential capacity', 'Run-of-river hydro', 'Zero-carbon baseload']
    }
  ];

  return (
    <section className="w-full py-16 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            The Sovereign Stack
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Four integrated layers building Africa's digital sovereignty from the ground up
          </p>
        </div>

        {/* Stack Visualization */}
        <div className="max-w-4xl mx-auto space-y-4 mb-12">
          {layers.map((layer, index) => {
            const Icon = layer.icon;
            const isTop = index === 0;
            
            return (
              <div
                key={layer.level}
                className={`relative group transform transition-all duration-500 hover:scale-[1.02] ${
                  isTop ? 'z-40' : index === 1 ? 'z-30' : index === 2 ? 'z-20' : 'z-10'
                }`}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  marginTop: index === 0 ? '0' : '-8px'
                }}
              >
                <div className={`relative bg-slate-900/80 backdrop-blur-sm border-2 ${layer.borderColor} rounded-2xl p-6 overflow-hidden`}>
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${layer.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Top Border Accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${layer.color}`} />
                  
                  <div className="relative z-10 flex items-start gap-6">
                    {/* Layer Number & Icon */}
                    <div className="flex-shrink-0">
                      <div className={`h-20 w-20 rounded-xl bg-gradient-to-br ${layer.color} flex flex-col items-center justify-center border-2 ${layer.borderColor} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="h-8 w-8 text-white mb-1" strokeWidth={2} />
                        <span className="text-xs font-bold text-white bg-black/20 px-2 py-0.5 rounded-full">L{layer.level}</span>
                      </div>
                    </div>

                    {/* Layer Content */}
                    <div className="flex-grow pt-1">
                      <div className="flex items-baseline gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">
                          {layer.title}
                        </h3>
                        <span className={`text-sm font-medium ${layer.textColor}`}>
                          • {layer.subtitle}
                        </span>
                      </div>
                      <p className="text-slate-400 mb-4 leading-relaxed">
                        {layer.description}
                      </p>
                      
                      {/* Key Features */}
                      <div className="flex flex-wrap gap-2">
                        {layer.details.map((detail) => (
                          <span
                            key={detail}
                            className={`text-xs px-3 py-1.5 rounded-full bg-slate-800/50 ${layer.textColor} border border-slate-700 hover:border-slate-600 transition-colors`}
                          >
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Layer Number Badge (right side) */}
                  <div className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br ${layer.color} opacity-20 flex items-center justify-center`}>
                    <span className="text-2xl font-bold text-white opacity-50">{layer.level}</span>
                  </div>
                </div>

                {/* Connector Line to Next Layer */}
                {index < layers.length - 1 && (
                  <div className="absolute left-10 -bottom-4 w-1 h-8 bg-gradient-to-b from-slate-600 to-transparent z-50"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stack Philosophy */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-3">
                  Why Stack-Based Architecture?
                </h4>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Digital sovereignty isn't just about owning servers—it's about controlling every layer from energy generation 
                  to economic value creation. Each layer builds on the one below it, creating a resilient, vertically integrated 
                  system that cannot be easily disrupted by external forces.
                </p>
                <p className="text-slate-500 text-sm italic">
                  This is how nations build lasting technological independence: from the ground up, layer by layer, with full ownership at every level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}