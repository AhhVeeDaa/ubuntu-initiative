'use client'

import { Droplets, Cpu, Globe, Zap, Info } from 'lucide-react';

export function TechnicalSpecifications() {
  const specs = [
    {
      icon: Zap,
      category: 'Power Source',
      value: 'Run-of-River Hydro',
      detail: 'Inga 3 Expansion',
      color: 'from-yellow-500 to-orange-500',
      textColor: 'text-yellow-400',
      stats: ['42GW total potential', '500MW dedicated', 'Zero carbon emissions']
    },
    {
      icon: Droplets,
      category: 'Cooling System',
      value: 'Closed-Loop Liquid',
      detail: 'Congo River Heat Exchange',
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-400',
      stats: ['15°C optimal temp', 'Zero water waste', '40% efficiency gain']
    },
    {
      icon: Cpu,
      category: 'Compute Target',
      value: '10+ Exaflops (FP16)',
      detail: 'LLM Training for African Languages',
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-400',
      stats: ['2000+ languages', 'Real-time inference', 'Federated learning']
    },
    {
      icon: Globe,
      category: 'Connectivity',
      value: 'Terabit-Scale Fiber',
      detail: 'Kinshasa Link + Muanda Subsea Cables',
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-green-400',
      stats: ['<5ms latency', 'Redundant paths', 'Pan-African backbone']
    }
  ];

  return (
    <section className="w-full py-16 px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Phase 1 Technical Specifications
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            World-class infrastructure engineered for African sovereignty and computational independence
          </p>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {specs.map((spec, index) => {
            const Icon = spec.icon;
            return (
              <div 
                key={spec.category} 
                className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Gradient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${spec.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500 blur-xl`} />
                
                <div className="relative z-10">
                  {/* Icon and Category */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${spec.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                        {spec.category}
                      </p>
                      <h3 className="text-xl font-bold text-white">
                        {spec.value}
                      </h3>
                    </div>
                  </div>

                  {/* Detail Badge */}
                  <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${spec.color} bg-opacity-20 border border-slate-700 mb-4`}>
                    <p className={`text-sm font-semibold ${spec.textColor}`}>
                      {spec.detail}
                    </p>
                  </div>

                  {/* Stats List */}
                  <div className="space-y-2">
                    {spec.stats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${spec.color}`} />
                        <span>{stat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Corner Accent */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${spec.color} opacity-10 rounded-bl-[100px] rounded-tr-2xl`} />
              </div>
            );
          })}
        </div>

        {/* Infrastructure Philosophy Card */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-3">
                  Infrastructure Design Philosophy
                </h4>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Every technical decision prioritizes long-term sustainability and African ownership. Our cooling system 
                  leverages the Congo River's natural thermal capacity without environmental impact. Our compute architecture 
                  focuses on multilingual AI that serves African languages first—not as an afterthought.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400 mb-1">99.995%</div>
                    <div className="text-xs text-slate-500">Uptime SLA</div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400 mb-1">Tier IV</div>
                    <div className="text-xs text-slate-500">Data Center Rating</div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400 mb-1">100%</div>
                    <div className="text-xs text-slate-500">Renewable Energy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}