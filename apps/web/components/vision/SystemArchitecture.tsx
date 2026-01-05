'use client';

import { Waves, Zap, Cpu, Home, ArrowRight, Battery } from 'lucide-react';

export function SystemArchitecture() {
  return (
    <div className="relative">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Energy-to-Compute Flow
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto">
          The anchor tenant model: A dedicated Power Purchase Agreement (PPA) for AI compute 
          triggers the construction of 4,800MW Inga hydropower, with surplus capacity 
          electrifying 60+ million lives
        </p>
      </div>

      {/* Flow Diagram */}
      <div className="relative">
        {/* Desktop Flow (horizontal) */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[hsl(var(--primary))]/20 via-[hsl(var(--accent))]/40 to-[hsl(var(--primary))]/20 -z-10" />
            
            {/* Node A: Inga Falls */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative group">
                <div className="absolute inset-0 bg-[hsl(var(--primary))] blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                <div className="relative bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5 border-2 border-[hsl(var(--primary))]/30 rounded-2xl p-8 backdrop-blur-xl hover:border-[hsl(var(--primary))] transition-all">
                  <Waves className="h-16 w-16 text-[hsl(var(--primary))] mx-auto mb-4" />
                  <h3 className="text-white font-bold text-lg mb-2 text-center">Inga Falls</h3>
                  <p className="text-[hsl(var(--primary))] text-2xl font-bold text-center">42GW</p>
                  <p className="text-gray-400 text-sm text-center mt-1">Potential</p>
                </div>
              </div>
              <div className="mt-4 text-center max-w-xs">
                <p className="text-xs text-gray-500">
                  Congo River's untapped hydropower - world's largest renewable energy reserve
                </p>
              </div>
            </div>

            {/* Arrow 1 */}
            <div className="flex items-center px-4">
              <ArrowRight className="h-8 w-8 text-[hsl(var(--primary))]/50" />
            </div>

            {/* Node B: Power Station (Anchor Tenant) */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative group">
                <div className="absolute inset-0 bg-[hsl(var(--accent))] blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                <div className="relative bg-gradient-to-br from-[hsl(var(--accent))]/20 to-[hsl(var(--accent))]/5 border-2 border-[hsl(var(--accent))]/30 rounded-2xl p-8 backdrop-blur-xl hover:border-[hsl(var(--accent))] transition-all">
                  <Battery className="h-16 w-16 text-[hsl(var(--accent))] mx-auto mb-4" />
                  <h3 className="text-white font-bold text-lg mb-2 text-center">Ubuntu PPA</h3>
                  <p className="text-[hsl(var(--accent))] text-2xl font-bold text-center">500MW</p>
                  <p className="text-gray-400 text-sm text-center mt-1">Dedicated</p>
                </div>
              </div>
              <div className="mt-4 text-center max-w-xs">
                <div className="inline-block bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/30 rounded-full px-3 py-1 mb-2">
                  <p className="text-xs font-bold text-[hsl(var(--accent))]">⚡ ANCHOR TENANT</p>
                </div>
                <p className="text-xs text-gray-500">
                  Long-term power purchase agreement triggers dam construction
                </p>
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="flex items-center px-4">
              <ArrowRight className="h-8 w-8 text-[hsl(var(--accent))]/50" />
            </div>

            {/* Node C: AI Supercomputer */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative group">
                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-2 border-purple-500/30 rounded-2xl p-8 backdrop-blur-xl hover:border-purple-500 transition-all">
                  <Cpu className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-white font-bold text-lg mb-2 text-center">AI Compute</h3>
                  <p className="text-purple-400 text-2xl font-bold text-center">L1</p>
                  <p className="text-gray-400 text-sm text-center mt-1">Sovereign</p>
                </div>
              </div>
              <div className="mt-4 text-center max-w-xs">
                <p className="text-xs text-gray-500">
                  First African sovereign AI supercomputer - 10+ ExaFLOPS training capacity
                </p>
              </div>
            </div>

            {/* Arrow 3 */}
            <div className="flex items-center px-4">
              <ArrowRight className="h-8 w-8 text-green-500/50" />
            </div>

            {/* Node D: Regional Grid */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative group">
                <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                <div className="relative bg-gradient-to-br from-green-500/20 to-green-500/5 border-2 border-green-500/30 rounded-2xl p-8 backdrop-blur-xl hover:border-green-500 transition-all">
                  <Home className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-white font-bold text-lg mb-2 text-center">Surplus Grid</h3>
                  <p className="text-green-400 text-2xl font-bold text-center">60M+</p>
                  <p className="text-gray-400 text-sm text-center mt-1">Lives</p>
                </div>
              </div>
              <div className="mt-4 text-center max-w-xs">
                <p className="text-xs text-gray-500">
                  Remaining 4,300MW electrifies DRC households and regional grid
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Flow (vertical) */}
        <div className="block md:hidden space-y-6">
          {/* Node A */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5 border-2 border-[hsl(var(--primary))]/30 rounded-2xl p-6 backdrop-blur-xl w-full max-w-sm">
              <Waves className="h-12 w-12 text-[hsl(var(--primary))] mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg text-center">Inga Falls</h3>
              <p className="text-[hsl(var(--primary))] text-xl font-bold text-center">42GW Potential</p>
            </div>
            <ArrowRight className="h-8 w-8 text-[hsl(var(--primary))]/50 rotate-90 my-2" />
          </div>

          {/* Node B */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-[hsl(var(--accent))]/20 to-[hsl(var(--accent))]/5 border-2 border-[hsl(var(--accent))]/30 rounded-2xl p-6 backdrop-blur-xl w-full max-w-sm">
              <div className="inline-block bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/30 rounded-full px-3 py-1 mb-2">
                <p className="text-xs font-bold text-[hsl(var(--accent))]">⚡ ANCHOR TENANT</p>
              </div>
              <Battery className="h-12 w-12 text-[hsl(var(--accent))] mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg text-center">Ubuntu PPA</h3>
              <p className="text-[hsl(var(--accent))] text-xl font-bold text-center">500MW Dedicated</p>
            </div>
            <ArrowRight className="h-8 w-8 text-[hsl(var(--accent))]/50 rotate-90 my-2" />
          </div>

          {/* Node C */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-2 border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl w-full max-w-sm">
              <Cpu className="h-12 w-12 text-purple-400 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg text-center">AI Supercomputer</h3>
              <p className="text-purple-400 text-xl font-bold text-center">L1 Sovereign Intelligence</p>
            </div>
            <ArrowRight className="h-8 w-8 text-green-500/50 rotate-90 my-2" />
          </div>

          {/* Node D */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-2 border-green-500/30 rounded-2xl p-6 backdrop-blur-xl w-full max-w-sm">
              <Home className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg text-center">Regional Grid</h3>
              <p className="text-green-400 text-xl font-bold text-center">60M+ Lives Electrified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
        <div className="flex items-start">
          <Zap className="h-6 w-6 text-[hsl(var(--accent))] mr-3 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-white font-bold mb-2">The Anchor Tenant Model</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              The Ubuntu Initiative commits to a <strong className="text-[hsl(var(--accent))]">20-year Power Purchase Agreement (PPA)</strong> for 
              500MW of dedicated, baseload power. This long-term revenue guarantee provides the financial de-risking needed to 
              attract $14-18B in infrastructure investment for the Inga 3 expansion. By securing the "anchor load," we unlock 
              the construction of 4,800MW total capacity—with the remaining 4,300MW surplus powering homes, hospitals, schools, 
              and industries across the DRC and neighboring nations. <strong className="text-white">The compute facility doesn't 
              just consume power—it catalyzes the entire energy transformation.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
