'use client';

import { Droplet, Zap, Cpu, Globe, Shield, Layers } from 'lucide-react';

export function TechSpecs() {
  const specs = [
    {
      category: 'Power Source',
      icon: Zap,
      color: 'text-[hsl(var(--primary))]',
      bgColor: 'from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5',
      borderColor: 'border-[hsl(var(--primary))]/30',
      value: 'Run-of-River Hydro',
      details: 'Inga 3 Expansion (4,800MW total capacity)',
      specs: [
        '500MW dedicated to Ubuntu compute via PPA',
        '4,300MW surplus to DRC regional grid',
        '100% renewable, zero carbon emissions',
        'Baseload capacity (24/7/365 availability)'
      ]
    },
    {
      category: 'Cooling System',
      icon: Droplet,
      color: 'text-blue-400',
      bgColor: 'from-blue-500/20 to-blue-500/5',
      borderColor: 'border-blue-500/30',
      value: 'Closed-Loop Liquid',
      details: 'Congo River heat exchange',
      specs: [
        'Direct liquid-to-chip cooling (DLC)',
        'Heat exchangers using Congo River water',
        'PUE target: <1.15 (industry leading)',
        'Zero water consumption (closed system)'
      ]
    },
    {
      category: 'Compute Target',
      icon: Cpu,
      color: 'text-purple-400',
      bgColor: 'from-purple-500/20 to-purple-500/5',
      borderColor: 'border-purple-500/30',
      value: '10+ ExaFLOPS',
      details: 'FP16 precision for LLM training',
      specs: [
        'Focus: African language models (Swahili, Hausa, Amharic, etc.)',
        'Training corpus: 10T+ tokens of African content',
        'Custom silicon: NVIDIA H200/B200 class GPUs',
        'Phase 1 target: 50,000+ GPU cluster'
      ]
    },
    {
      category: 'Connectivity',
      icon: Globe,
      color: 'text-[hsl(var(--accent))]',
      bgColor: 'from-[hsl(var(--accent))]/20 to-[hsl(var(--accent))]/5',
      borderColor: 'border-[hsl(var(--accent))]/30',
      value: 'Terabit Fiber',
      details: 'Multi-path redundant links',
      specs: [
        'Primary link: 1+ Tbps fiber to Kinshasa',
        'Subsea cables via Muanda (Atlantic access)',
        'Direct peering with African IXPs',
        'Latency: <50ms to Cairo, Lagos, Nairobi'
      ]
    },
    {
      category: 'Data Center Tier',
      icon: Layers,
      color: 'text-green-400',
      bgColor: 'from-green-500/20 to-green-500/5',
      borderColor: 'border-green-500/30',
      value: 'Tier IV Certified',
      details: '99.995% uptime SLA',
      specs: [
        '2N+1 redundancy on all critical systems',
        'Dual power feeds from separate substations',
        'Fault-tolerant infrastructure',
        'Concurrent maintainability (no downtime)'
      ]
    },
    {
      category: 'Security',
      icon: Shield,
      color: 'text-red-400',
      bgColor: 'from-red-500/20 to-red-500/5',
      borderColor: 'border-red-500/30',
      value: 'Sovereign Security',
      details: 'Physical and digital layers',
      specs: [
        'Biometric access control (military-grade)',
        'Faraday cage construction (TEMPEST rated)',
        'Air-gapped management networks',
        'DRC government security partnership'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Phase 1 Technical Specifications
        </h3>
        <p className="text-gray-400">
          The infrastructure requirements for Africa's first sovereign AI supercomputer
        </p>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specs.map((spec, index) => (
          <div
            key={index}
            className="group relative bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all"
          >
            {/* Icon & Category */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${spec.bgColor} border ${spec.borderColor}`}>
                  <spec.icon className={`h-6 w-6 ${spec.color}`} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">{spec.category}</h4>
                  <p className="text-sm text-gray-400">{spec.details}</p>
                </div>
              </div>
            </div>

            {/* Main Value */}
            <div className="mb-4">
              <p className={`text-2xl font-bold ${spec.color}`}>
                {spec.value}
              </p>
            </div>

            {/* Detailed Specs */}
            <ul className="space-y-2">
              {spec.specs.map((item, i) => (
                <li key={i} className="flex items-start text-sm text-gray-300">
                  <span className={`${spec.color} mr-2 flex-shrink-0`}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Key Metrics Summary */}
      <div className="mt-8 bg-gradient-to-r from-[hsl(var(--primary))]/10 via-[hsl(var(--accent))]/10 to-purple-500/10 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
        <h4 className="text-white font-bold text-center mb-4">Key Performance Indicators</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-[hsl(var(--primary))]">500MW</p>
            <p className="text-xs text-gray-400 mt-1">Dedicated Power</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">10+</p>
            <p className="text-xs text-gray-400 mt-1">ExaFLOPS (FP16)</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[hsl(var(--accent))]">1+ Tbps</p>
            <p className="text-xs text-gray-400 mt-1">Network Capacity</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">99.995%</p>
            <p className="text-xs text-gray-400 mt-1">Uptime SLA</p>
          </div>
        </div>
      </div>
    </div>
  );
}
