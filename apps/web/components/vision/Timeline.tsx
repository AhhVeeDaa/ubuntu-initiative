'use client';

import { CheckCircle2, Clock, Zap, Target, Rocket, Award } from 'lucide-react';

const steps = [
    {
        phase: 'Phase 0',
        title: 'Initialization',
        date: 'Q1 2026',
        status: 'current',
        icon: Target,
        color: 'hsl(var(--accent))',
        glow: '0 0 20px rgba(234, 179, 8, 0.4)',
        description: 'Project structure established, legal framework finalized, and initial capitalization secured.',
    },
    {
        phase: 'Phase 1',
        title: 'Pilot Cluster',
        date: 'Q3 2026',
        status: 'upcoming',
        icon: Rocket,
        color: '#22d3ee', // Cyan
        glow: '0 0 20px rgba(34, 211, 238, 0.2)',
        description: 'Deployment of 10MW pilot facility at Inga III. Training of first sovereign models begins.',
    },
    {
        phase: 'Phase 2',
        title: 'Foundation Training',
        date: '2027',
        status: 'upcoming',
        icon: Zap,
        color: '#a855f7', // Purple
        glow: '0 0 20px rgba(168, 85, 247, 0.2)',
        description: 'Scaling to 100MW. Full-scale training of pan-African foundation models on local infrastructure.',
    },
    {
        phase: 'Phase 3',
        title: 'Continental Deployment',
        date: '2028+',
        status: 'upcoming',
        icon: Award,
        color: '#10b981', // Green
        glow: '0 0 20px rgba(16, 185, 129, 0.2)',
        description: 'Integration with national grids and sovereign intelligence distribution across Africa.',
    },
];

export function Timeline() {
    return (
        <div className="relative py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Timeline Header */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                        The <span className="text-[hsl(var(--primary))]">Roadmap</span> to Sovereignty
                    </h2>
                    <p className="text-gray-400 text-lg">
                        A staged execution model designed for technical excellence and impact.
                    </p>
                </div>

                {/* Timeline Line (Desktop) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/5 -translate-x-1/2 hidden md:block" />

                <div className="space-y-24 relative">
                    {steps.map((step, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div key={step.phase} className="relative">
                                {/* Node Center */}
                                <div className="absolute left-1/2 -translate-x-1/2 top-0 z-20 hidden md:block">
                                    <div
                                        className="w-4 h-4 rounded-full border-4 border-black animate-glow-breath"
                                        style={{ backgroundColor: step.color, boxShadow: step.glow } as any}
                                    />
                                </div>

                                {/* Content Card */}
                                <div className={`flex flex-col md:flex-row items-center gap-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                    {/* Left Side (Content) */}
                                    <div className={`flex-1 w-full ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                                        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-3xl relative overflow-hidden group hover:bg-white/10 transition-all duration-500 shadow-xl">
                                            {/* Status Pulse */}
                                            {step.status === 'current' && (
                                                <div className="absolute top-4 right-4 md:right-auto md:left-4">
                                                    <span className="flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--accent))] opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[hsl(var(--accent))]"></span>
                                                    </span>
                                                </div>
                                            )}

                                            <span className="text-[hsl(var(--accent))] font-black text-xs tracking-widest uppercase mb-2 block">
                                                {step.phase} • {step.date}
                                            </span>
                                            <h3 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase tracking-tighter">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-400 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Icon / Center Spacer */}
                                    <div className="flex-shrink-0 relative">
                                        <div
                                            className="w-20 h-20 rounded-2xl bg-black border-2 flex items-center justify-center animate-glow-breath"
                                            style={{ borderColor: `${step.color}50`, color: step.color, boxShadow: step.glow } as any}
                                        >
                                            <step.icon className="h-10 w-10" />
                                        </div>
                                    </div>

                                    {/* Right Side (Spacer) */}
                                    <div className="flex-1 hidden md:block" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
