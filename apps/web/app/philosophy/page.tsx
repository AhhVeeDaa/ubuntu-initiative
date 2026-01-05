'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Sparkles, Users, Cpu, Quote, ArrowUpRight, Target, Shield } from 'lucide-react';

export default function PhilosophyPage() {
    const [activeTab, setActiveTab] = useState('seed');
    const [seedMode, setSeedMode] = useState('standard');
    const [virtueLevel, setVirtueLevel] = useState(20);

    return (
        <div className="min-h-screen flex flex-col bg-black overflow-x-hidden">
            <Navbar />

            <main className="flex-grow pt-24 pb-20">
                {/* Hero Section */}
                <section className="relative py-20 px-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[hsl(var(--primary))]/5 rounded-full blur-[120px] -z-10" />
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-7xl font-black text-white mb-8 mb-4 uppercase tracking-tighter leading-none">
                            A Teleological <span className="text-gradient">Return</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed max-w-3xl mx-auto">
                            To return Africa to greatness is not to move forward into a foreign future, but to move <span className="text-[hsl(var(--accent))] font-bold italic">"Inward"</span> to the original Spark.
                        </p>
                    </div>
                </section>

                {/* Tab Navigation */}
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
                                className={`flex items-center gap-2 pb-4 transition-all relative ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span className="font-black uppercase tracking-widest text-xs md:text-sm">{tab.label}</span>
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--primary))] animate-glow-breath shadow-[0_0_10px_hsl(var(--primary))]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Content */}
                <div className="max-w-6xl mx-auto px-4">
                    {activeTab === 'seed' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="space-y-8">
                                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
                                    Inherent <span className="text-[hsl(var(--primary))]">Greatness</span>
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    Conventional wisdom suggests a nation is made great by its infrastructure and forward linear progress.
                                    The Ubuntu Initiative argues that greatness is inherent in the seed. It is not about becoming; it is about returning.
                                </p>
                                <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[hsl(var(--accent))]" />
                                    <p className="text-[hsl(var(--accent))] font-bold italic text-lg mb-4">
                                        "A state is not made great by its walls, but by the virtue of its citizens."
                                    </p>
                                    <button
                                        onClick={() => setSeedMode(seedMode === 'standard' ? 'inward' : 'standard')}
                                        className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        {seedMode === 'standard' ? 'Reveal The Inward Turn' : 'Show Standard Model'}
                                        <ArrowUpRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Enhanced Line Chart Viz */}
                            <div className="relative aspect-square md:aspect-video bg-[#0a0f1a] rounded-[48px] border-2 border-white/5 p-8 flex items-end justify-between gap-4 group">
                                {/* Y-axis label */}
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                    Potential / Virtue
                                </div>

                                {/* Simplified Line Viz */}
                                <div className="flex-grow h-full mb-8 relative">
                                    {/* Grid Lines */}
                                    {[0, 25, 50, 75, 100].map((level) => (
                                        <div key={level} className="absolute left-0 right-0 h-px bg-white/5" style={{ bottom: `${level}%` }} />
                                    ))}

                                    {/* Standard Line (Linear) */}
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

                                    {/* Inward Line (Exponential) */}
                                    <svg className="absolute inset-0 w-full h-full overflow-visible">
                                        <path
                                            d="M 0,100 Q 40,95 60,40 T 100,5"
                                            fill="none"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth="4"
                                            className={`transition-all duration-700 shadow-[0_0_20px_hsl(var(--primary))] ${seedMode === 'inward' ? 'opacity-100' : 'opacity-0'}`}
                                            preserveAspectRatio="none"
                                            vectorEffect="non-scaling-stroke"
                                            style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary)))', transform: 'scaleY(-1) translateY(-100%)' }}
                                        />
                                    </svg>

                                    {/* Data labels (Past/Future) */}
                                    <div className="absolute -bottom-8 left-0 text-[10px] font-bold text-gray-600">PAST</div>
                                    <div className="absolute -bottom-8 right-0 text-[10px] font-bold text-gray-600 text-right">THE RETURN</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'polis' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="order-2 lg:order-1 relative aspect-square bg-[#0a0f1a] rounded-[48px] border-2 border-white/5 overflow-hidden flex items-center justify-center">
                                {/* Central WE Node */}
                                <div className="w-32 h-32 rounded-full bg-black border-2 border-[hsl(var(--accent))] flex items-center justify-center animate-glow-breath z-10 shadow-[0_0_40px_rgba(234,179,8,0.2)]">
                                    <span className="text-[hsl(var(--accent))] font-black text-3xl">WE</span>
                                </div>

                                {/* Orbiting I Nodes */}
                                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-full h-full animate-[spin_10s_linear_infinite]"
                                        style={{ animationDelay: `-${i * 1.5}s` }}
                                    >
                                        <div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[140px] w-12 h-12 rounded-full bg-black border border-[hsl(var(--primary))] flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                                            style={{ transform: `translateX(-50%) translateY(-50%) rotate(-${angle}deg)` } as any}
                                        >
                                            <span className="text-[hsl(var(--primary))] font-black text-xs">I</span>
                                        </div>
                                        {/* Connector line */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-px h-[140px] bg-gradient-to-t from-[hsl(var(--accent))]/50 to-[hsl(var(--primary))]/50 opacity-20 origin-bottom scale-y-100" />
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
                    )}

                    {activeTab === 'machine' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="space-y-8">
                                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
                                    <span className="text-purple-400">Virtuous</span> Intelligence
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    We must not merely train machines to speak like humans; we must train them to think like <strong>virtuous</strong> humans.
                                    The center point of an Ubuntu AI is not the data it holds, but the harmony it creates.
                                </p>

                                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
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

                            {/* Radar Viz Placeholder */}
                            <div className="relative aspect-square bg-[#0a0f1a] rounded-[48px] border-2 border-white/5 flex items-center justify-center group overflow-hidden">
                                {/* Decorative background radar lines */}
                                {[0, 1, 2, 3].map((i) => (
                                    <div key={i} className="absolute border border-white/5 rounded-full" style={{ width: `${(i + 1) * 20}%`, height: `${(i + 1) * 20}%` }} />
                                ))}

                                {/* Standard Shape */}
                                <svg className="absolute w-[80%] h-[80%] overflow-visible opacity-30">
                                    <polygon
                                        points="150,20 280,100 250,250 50,250 20,100"
                                        fill="none"
                                        stroke="#4b5563"
                                        strokeWidth="2"
                                        className="origin-center"
                                        style={{ transform: 'scale(1.1) translate(-20px, -20px)' }}
                                    />
                                </svg>

                                {/* Virtuous Shape (Dynamic) */}
                                <svg className="absolute w-[80%] h-[80%] overflow-visible">
                                    <polygon
                                        points="150,20 280,100 250,250 50,250 20,100"
                                        fill="purple"
                                        fillOpacity={0.2}
                                        stroke="#a855f7"
                                        strokeWidth="4"
                                        className="origin-center animate-glow-breath transition-transform duration-500"
                                        style={{
                                            transform: `scale(${0.5 + (virtueLevel / 100) * 0.7}) translate(-20px, -20px)`,
                                            filter: 'drop-shadow(0 0 10px #a855f7)'
                                        } as any}
                                    />
                                </svg>

                                <div className="absolute top-8 text-[10px] font-black text-gray-600 uppercase">Wisdom</div>
                                <div className="absolute bottom-8 text-[10px] font-black text-gray-600 uppercase">Ethics</div>
                                <div className="absolute left-8 text-[10px] font-black text-gray-600 uppercase">Harmony</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Manifesto Grid */}
                <section className="mt-32 max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-16 uppercase tracking-tighter">
                        The Ubuntu <span className="text-gradient">Manifesto</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Quote,
                                title: 'Voice & Freedom',
                                color: 'text-[hsl(var(--primary))]',
                                bgColor: 'bg-[hsl(var(--primary))]/10',
                                text: 'A community that does not speak in its own voice cannot be free.'
                            },
                            {
                                icon: Shield,
                                title: 'Virtuous Intelligence',
                                color: 'text-purple-400',
                                bgColor: 'bg-purple-500/10',
                                text: 'Do not merely train this machine to speak like a man; train it to think like a virtuous man.'
                            },
                            {
                                icon: Sparkles,
                                title: 'The Inward Turn',
                                color: 'text-[hsl(var(--accent))]',
                                bgColor: 'bg-[hsl(var(--accent))]/10',
                                text: 'To return Africa to greatness is not to move forward into a foreign future, but to move Inward to the original Spark.'
                            },
                        ].map((card, i) => (
                            <div key={i} className="group relative bg-[#0a0f1a] border border-white/10 rounded-[40px] p-10 backdrop-blur-3xl hover:border-white/20 transition-all duration-500 hover:scale-[1.02]">
                                <div className={`w-16 h-16 rounded-2xl ${card.bgColor} flex items-center justify-center mb-8 animate-glow-breath`}>
                                    <card.icon className={`h-8 w-8 ${card.color}`} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{card.title}</h3>
                                <p className="text-gray-400 leading-relaxed italic">
                                    "{card.text}"
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="mt-40 text-center px-4">
                    <div className="max-w-3xl mx-auto p-16 rounded-[64px] bg-gradient-to-b from-white/5 to-transparent border border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[hsl(var(--primary))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 group-hover:scale-105 transition-transform">
                            Join the <span className="text-gradient">Return</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-12 font-medium">
                            We are rebuilding a Polis that the world will once again look to for light.
                        </p>
                        <a
                            href="/support"
                            className="px-12 py-5 bg-[hsl(var(--accent))] text-black font-black uppercase tracking-widest rounded-full hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(234,179,8,0.4)]"
                        >
                            Support the Mission
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
