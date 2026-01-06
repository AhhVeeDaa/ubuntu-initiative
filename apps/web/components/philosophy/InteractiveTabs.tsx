'use client';

import { useState } from 'react';
import { Sparkles, Users, Cpu, ArrowUpRight, Target, Shield, Quote } from 'lucide-react';

export function InteractiveTabs() {
  const [activeTab, setActiveTab] = useState('seed');

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 mb-20">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 border-b border-white/10 pb-4">
          {[
            { id: 'seed', label: 'I. The Seed', icon: Sparkles },
            { id: 'polis', label: 'II. The Polis', icon: Users },
            { id: 'machine', label: 'III. The Machine', icon: Cpu },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 transition-colors relative ${
                activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="font-black uppercase tracking-widest text-xs md:text-sm">
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--primary))]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {activeTab === 'seed' && <SeedContent />}
        {activeTab === 'polis' && <PolisContent />}
        {activeTab === 'machine' && <MachineContent />}
      </div>
    </>
  );
}

function SeedContent() {
  const [seedMode, setSeedMode] = useState('standard');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
          Inherent <span className="text-[hsl(var(--primary))]">Greatness</span>
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Conventional wisdom suggests a nation is made great by its infrastructure and forward linear progress.
          The Ubuntu Initiative argues that greatness is inherent in the seed. It is not about becoming; it is about returning.
        </p>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[hsl(var(--accent))]" />
          <p className="text-[hsl(var(--accent))] font-bold italic text-lg mb-4">
            "A state is not made great by its walls, but by the virtue of its citizens."
          </p>
          <button
            onClick={() => setSeedMode(seedMode === 'standard' ? 'inward' : 'standard')}
            className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            {seedMode === 'standard' ? 'Reveal The Inward Turn' : 'Show Standard Model'}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative aspect-square md:aspect-video bg-[#0a0f1a] rounded-[48px] border-2 border-white/5 p-8 flex items-end justify-between gap-4">
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black text-gray-600 uppercase tracking-widest">
          Potential / Virtue
        </div>

        <div className="flex-grow h-full mb-8 relative">
          {[0, 25, 50, 75, 100].map((level) => (
            <div key={level} className="absolute left-0 right-0 h-px bg-white/5" style={{ bottom: `${level}%` }} />
          ))}

          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <path
              d="M 0,100 L 25,80 L 50,60 L 75,40 L 100,30"
              fill="none"
              stroke="#4b5563"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="transition-opacity duration-500"
              preserveAspectRatio="none"
              vectorEffect="non-scaling-stroke"
              style={{ transform: 'scaleY(-1) translateY(-100%)' }}
            />
          </svg>

          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <path
              d="M 0,100 Q 40,95 60,40 T 100,5"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              className={`transition-opacity duration-700 ${seedMode === 'inward' ? 'opacity-100' : 'opacity-0'}`}
              preserveAspectRatio="none"
              vectorEffect="non-scaling-stroke"
              style={{ transform: 'scaleY(-1) translateY(-100%)' }}
            />
          </svg>

          <div className="absolute -bottom-8 left-0 text-[10px] font-bold text-gray-600">PAST</div>
          <div className="absolute -bottom-8 right-0 text-[10px] font-bold text-gray-600 text-right">THE RETURN</div>
        </div>
      </div>
    </div>
  );
}

function PolisContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="order-2 lg:order-1 relative aspect-square bg-[#0a0f1a] rounded-[48px] border-2 border-white/5 overflow-hidden flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-black border-2 border-[hsl(var(--accent))] flex items-center justify-center z-10">
          <span className="text-[hsl(var(--accent))] font-black text-3xl">WE</span>
        </div>

        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{ 
              animation: `spin 10s linear infinite`,
              animationDelay: `-${i * 1.5}s`
            }}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[140px] w-12 h-12 rounded-full bg-black border border-[hsl(var(--primary))] flex items-center justify-center"
            >
              <span className="text-[hsl(var(--primary))] font-black text-xs">I</span>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-px h-[140px] bg-gradient-to-t from-[hsl(var(--accent))]/50 to-[hsl(var(--primary))]/50 opacity-20 origin-bottom" />
          </div>
        ))}
      </div>

      <div className="order-1 lg:order-2 space-y-8">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
          Bridging the <span className="text-[hsl(var(--accent))]">I</span> and the <span className="text-[hsl(var(--primary))]">We</span>
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Technology often isolates the individual. Our goal is to use technology to bridge the gap, creating a harmony where the sovereignty of the individual supports the strength of the community.
        </p>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/30 flex items-center justify-center flex-shrink-0">
              <Target className="h-6 w-6 text-[hsl(var(--accent))]" />
            </div>
            <div>
              <h4 className="text-white font-bold mb-1">Individual Sovereignty</h4>
              <p className="text-gray-500 text-sm">The citizen must be free and virtuous.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/30 flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h4 className="text-white font-bold mb-1">Community Harmony</h4>
              <p className="text-gray-500 text-sm">The collective provides the context for the individual's existence.</p>
            </div>
          </div>
        </div>
        <p className="text-2xl font-black text-white uppercase tracking-tight italic">
          "Intelligence without sovereignty is merely advanced servitude."
        </p>
      </div>
    </div>
  );
}

function MachineContent() {
  const [virtueLevel, setVirtueLevel] = useState(20);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
          <span className="text-purple-400">Virtuous</span> Intelligence
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          We must not merely train machines to speak like humans; we must train them to think like <strong>virtuous</strong> humans.
          The center point of an Ubuntu AI is not the data it holds, but the harmony it creates.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Logic & Volume</span>
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Wisdom & Virtue</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={virtueLevel}
            onChange={(e) => setVirtueLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
            <div className="w-2 h-2 rounded-full bg-gray-600" />
            <span>Focusing Intelligence on: <strong className={virtueLevel > 50 ? 'text-purple-400' : 'text-white'}>{virtueLevel > 50 ? 'Human Flourishing' : 'Computational Speed'}</strong></span>
          </div>
        </div>
      </div>

      <div className="relative aspect-square bg-[#0a0f1a] rounded-[48px] border-2 border-white/5 flex items-center justify-center overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="absolute border border-white/5 rounded-full" style={{ width: `${(i + 1) * 20}%`, height: `${(i + 1) * 20}%` }} />
        ))}

        <svg className="absolute w-[80%] h-[80%] overflow-visible opacity-30">
          <polygon
            points="150,20 280,100 250,250 50,250 20,100"
            fill="none"
            stroke="#4b5563"
            strokeWidth="2"
            style={{ transform: 'scale(1.1) translate(-20px, -20px)' }}
          />
        </svg>

        <svg className="absolute w-[80%] h-[80%] overflow-visible">
          <polygon
            points="150,20 280,100 250,250 50,250 20,100"
            fill="purple"
            fillOpacity={0.2}
            stroke="#a855f7"
            strokeWidth="4"
            className="transition-transform duration-500"
            style={{
              transform: `scale(${0.5 + (virtueLevel / 100) * 0.7}) translate(-20px, -20px)`,
            }}
          />
        </svg>

        <div className="absolute top-8 text-[10px] font-black text-gray-600 uppercase">Wisdom</div>
        <div className="absolute bottom-8 text-[10px] font-black text-gray-600 uppercase">Ethics</div>
        <div className="absolute left-8 text-[10px] font-black text-gray-600 uppercase">Harmony</div>
      </div>
    </div>
  );
}
