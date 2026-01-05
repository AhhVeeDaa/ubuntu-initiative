'use client';

import { Waves, Zap, Cpu, Home, Battery, ArrowRight } from 'lucide-react';

export function SystemArchitecture() {
  const nodes = [
    {
      id: 1,
      title: 'Inga Falls',
      metric: '42GW Potential',
      desc: 'Raw energy source from the Congo River',
      color: 'hsl(var(--primary))',
      icon: Waves,
      glow: '0 0 40px rgba(34, 211, 238, 0.3)'
    },
    {
      id: 2,
      title: 'Ubuntu PPA',
      metric: '500MW Dedicated',
      desc: 'Financial anchor triggering construction',
      color: 'hsl(var(--accent))',
      icon: Battery,
      glow: '0 0 40px rgba(234, 179, 8, 0.3)',
      highlight: true
    },
    {
      id: 3,
      title: 'AI Compute',
      metric: '10+ ExaFLOPS',
      desc: 'Sovereign intelligence for the continent',
      color: '#a855f7',
      icon: Cpu,
      glow: '0 0 40px rgba(168, 85, 247, 0.3)'
    },
    {
      id: 4,
      title: 'Regional Grid',
      metric: '60M+ Lives',
      desc: 'Surplus power for the people of DRC',
      color: '#10b981',
      icon: Home,
      glow: '0 0 40px rgba(16, 185, 129, 0.3)'
    }
  ];

  return (
    <div className="relative py-20">
      {/* Section Header */}
      <div className="text-center mb-20 px-4">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
          Technical <span className="text-[hsl(var(--primary))]">Architecture</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          The integrated flow of energy and value that powers the Ubuntu Initiative.
        </p>
      </div>

      {/* horizontal Flow */}
      <div className="relative max-w-7xl mx-auto px-4 overflow-x-auto pb-12 scrollbar-hide">
        <div className="flex items-start justify-between min-w-[1000px] relative px-10">
          {/* Animated Flow Line */}
          <div className="absolute top-[80px] left-20 right-20 h-0.5 bg-white/5 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--primary))] to-transparent animate-[flow_3s_linear_infinite]" />
          </div>

          {nodes.map((node, i) => (
            <div key={node.id} className="flex flex-col items-center flex-1">
              {/* Illuminated Node */}
              <div className="relative group mb-10">
                <div
                  className="w-40 h-40 rounded-full bg-black border-2 backdrop-blur-3xl flex items-center justify-center transition-all duration-500 animate-glow-breath group-hover:scale-110"
                  style={{
                    borderColor: `${node.color}50`,
                    boxShadow: node.glow,
                    color: node.color
                  } as any}
                >
                  <node.icon className="h-16 w-16" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-black border border-current flex items-center justify-center font-black text-xs">
                    0{node.id}
                  </div>
                </div>
              </div>

              {/* Node content */}
              <div className="text-center max-w-[220px]">
                <h3 className="text-white font-black text-xl mb-1 uppercase tracking-tighter">{node.title}</h3>
                <p className="text-lg font-bold mb-3" style={{ color: node.color }}>{node.metric}</p>
                <p className="text-gray-500 text-sm leading-tight">{node.desc}</p>

                {node.highlight && (
                  <div className="mt-4 inline-block px-3 py-1 rounded-full bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/30">
                    <span className="text-[10px] font-black text-[hsl(var(--accent))] uppercase tracking-widest">The Anchor</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}