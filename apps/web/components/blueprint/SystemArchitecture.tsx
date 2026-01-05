'use client'

import React from 'react';
import { Waves, Zap, Cpu, Home, ArrowRight } from 'lucide-react';

export function SystemArchitecture() {
  const nodes = [
    {
      id: 'inga',
      icon: Waves,
      label: 'Inga Falls',
      metric: '42GW Potential',
      description: 'World\'s largest hydropower potential',
      color: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/50'
    },
    {
      id: 'ppa',
      icon: Zap,
      label: 'Ubuntu Power Station',
      metric: '500MW Dedicated PPA',
      description: 'Financial trigger & infrastructure anchor',
      color: 'from-yellow-500 to-orange-500',
      glow: 'shadow-yellow-500/50'
    },
    {
      id: 'compute',
      icon: Cpu,
      label: 'AI Supercomputer',
      metric: 'L1: Sovereign Intelligence',
      description: '10+ Exaflops FP16 compute power',
      color: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/50'
    },
    {
      id: 'grid',
      icon: Home,
      label: 'Regional Grid',
      metric: 'Surplus: 60M+ Lives',
      description: 'Electrification through excess capacity',
      color: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/50'
    }
  ];

  return (
    <section className="w-full py-16 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Energy-to-Compute Architecture
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            The Ubuntu Initiative transforms renewable energy into computational sovereignty,
            with surplus power electrifying millions across the Congo Basin.
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="relative">
          {/* Connecting Lines */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-yellow-500 via-purple-500 to-green-500 transform -translate-y-1/2 opacity-30 blur-sm hidden lg:block" 
               style={{ top: '140px' }} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {nodes.map((node, index) => {
              const Icon = node.icon;
              return (
                <React.Fragment key={node.id}>
                  {/* Node Card */}
                  <div className="group relative">
                    <div className={`
                      bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6
                      hover:border-slate-700 transition-all duration-500 hover:scale-105
                      hover:shadow-2xl ${node.glow}
                    `}>
                      {/* Icon Container */}
                      <div className="relative mb-4">
                        <div className={`
                          w-20 h-20 mx-auto rounded-xl bg-gradient-to-br ${node.color}
                          flex items-center justify-center
                          group-hover:scale-110 transition-transform duration-500
                          shadow-lg group-hover:shadow-2xl
                        `}>
                          <Icon className="w-10 h-10 text-white" strokeWidth={2} />
                        </div>
                        
                        {/* Pulse Animation */}
                        <div className={`
                          absolute inset-0 w-20 h-20 mx-auto rounded-xl
                          bg-gradient-to-br ${node.color} opacity-0
                          group-hover:opacity-20 group-hover:scale-125
                          transition-all duration-500 blur-md
                        `} />
                      </div>

                      {/* Content */}
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">
                          {node.label}
                        </h3>
                        <div className={`
                          text-sm font-semibold bg-gradient-to-r ${node.color}
                          bg-clip-text text-transparent
                        `}>
                          {node.metric}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {node.description}
                        </p>
                      </div>

                      {/* Node Number Badge */}
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-800 border-2 border-slate-700 rounded-full flex items-center justify-center text-sm font-bold text-slate-400">
                        {index + 1}
                      </div>
                    </div>

                    {/* Arrow Between Nodes (hidden on mobile, shown on larger screens) */}
                    {index < nodes.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                        <div className="relative">
                          <ArrowRight className="w-6 h-6 text-slate-600 animate-pulse" />
                          <div className="absolute inset-0 blur-sm">
                            <ArrowRight className={`w-6 h-6 bg-gradient-to-r ${node.color} bg-clip-text text-transparent`} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Key Insight Caption */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  The PPA Mechanism: Catalyzing Infrastructure Investment
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  The 500MW Power Purchase Agreement (PPA) serves as the <span className="text-yellow-400 font-medium">financial anchor</span> that 
                  makes the entire Inga 3 expansion economically viable. By guaranteeing long-term energy demand, 
                  the Ubuntu Initiative de-risks the $14B infrastructure investment, enabling construction to begin 
                  while creating <span className="text-green-400 font-medium">surplus capacity</span> that electrifies 60+ million lives across the DRC.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Stats Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Investment', value: '$14B+' },
            { label: 'Power Efficiency', value: '98.7%' },
            { label: 'Carbon Footprint', value: 'Net Zero' },
            { label: 'Jobs Created', value: '50K+' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center hover:border-slate-700 transition-colors">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};