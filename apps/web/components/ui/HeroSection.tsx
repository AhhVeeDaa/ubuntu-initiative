'use client'

import Link from 'next/link';
import { ArrowRight, Zap, Database, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getDaysSinceLaunch, calculatePhase0Progress } from '@/lib/utils';

export function HeroSection() {
    const [daysRunning, setDaysRunning] = useState(0);
    const [phase0Progress, setPhase0Progress] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setDaysRunning(getDaysSinceLaunch());
        
        async function fetchProgress() {
            try {
                const { data: milestones } = await supabase
                    .from('milestones')
                    .select('*')
                    .eq('phase', 'phase_0');
                
                if (milestones) {
                    setPhase0Progress(calculatePhase0Progress(milestones));
                }
            } catch (error) {
                console.error('Error fetching progress:', error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchProgress();
    }, []);

    return (
        <div className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--primary))] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-[hsl(var(--accent))] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-75"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full glass border border-[hsl(var(--primary))]/30 text-[hsl(var(--primary))] text-sm font-medium mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-[hsl(var(--primary))] mr-2 animate-ping"></span>
                    Phase 0: Day {daysRunning} {!loading && `• ${phase0Progress}% Complete`}
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8">
                    Building Africa's <br />
                    <span className="text-gradient">Sovereign AI Future</span>
                </h1>

                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10">
                    We're building Africa's first sovereign AI supercomputer, powered by the Congo River's 
                    Inga Falls—the world's largest untapped clean energy source. Track our progress in real-time, 
                    from day one.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/progress"
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-md text-[hsl(var(--primary-foreground))] bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 md:text-lg transition-all hover:scale-105"
                    >
                        View Progress
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                        href="/vision"
                        className="inline-flex items-center justify-center px-8 py-3 border border-white/20 text-base font-medium rounded-md text-white glass hover:bg-white/10 md:text-lg transition-all"
                    >
                        Read the Blueprint
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] mx-auto mb-4">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-white">42,000 MW</h3>
                        <p className="mt-2 text-sm text-gray-400">Inga Falls Potential</p>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] mx-auto mb-4">
                            <Database className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-white">100% Sovereign</h3>
                        <p className="mt-2 text-sm text-gray-400">African Data, African Soil</p>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500/20 text-purple-400 mx-auto mb-4">
                            <Globe className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-white">60M+ People</h3>
                        <p className="mt-2 text-sm text-gray-400">Gaining Electricity Access</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
