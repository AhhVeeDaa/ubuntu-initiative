'use client'

import Link from 'next/link';
import { ArrowRight, Zap, Database, Globe, Activity } from 'lucide-react';
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
                {/* Hero Vision Background - Inga + Datacenter */}
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="/hero-inga-vision.jpg"
                        alt="Vision of Inga Falls hydropower station with modern AI computing facility"
                        className="w-full h-full object-cover"
                    />
                    {/* Multi-layer gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--background))]/90 via-[hsl(var(--background))]/20 to-[hsl(var(--background))]/90"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--background))]/60 via-transparent to-[hsl(var(--background))]/60"></div>
                </div>
                <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--primary))] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-[hsl(var(--accent))] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-75"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full glass border border-[hsl(var(--primary))]/30 text-[hsl(var(--primary))] text-sm font-medium mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-[hsl(var(--primary))] mr-2 animate-ping"></span>
                    Phase 0: Day {daysRunning} {!loading && `• ${phase0Progress}% Complete`}
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8">
                    The Infrastructure <br />
                    <span className="text-gradient">Catalyst for Africa</span>
                </h1>

                <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-300 mb-6">
                    We're the <strong className="text-[hsl(var(--primary))]">Anchor Tenant</strong> that makes Inga Dam bankable. 
                    Our AI supercomputer provides the 24/7 baseload demand required to secure international financing—unlocking 
                    42,000 MW of clean energy for the continent.
                </p>

                <div className="max-w-2xl mx-auto mb-10">
                    <div className="glass-card p-6 border-2 border-[hsl(var(--primary))]/40">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <Activity className="h-6 w-6 text-[hsl(var(--primary))] animate-pulse" />
                            <h3 className="text-lg font-bold text-white">The Anchor Tenant Model</h3>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            We're not just a power consumer—we're the engine that makes the entire grid possible. 
                            By guaranteeing 500MW of constant demand, we provide lenders the revenue certainty needed 
                            to finance the $80B Inga Dam expansion, bringing electricity to 500 million Africans.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/progress"
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-md text-[hsl(var(--primary-foreground))] bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 md:text-lg transition-all hover:scale-105"
                    >
                        View Progress
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                        href="https://ubuntu-initiative-dashboard.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-8 py-3 border border-white/20 text-base font-medium rounded-md text-white glass hover:bg-white/10 md:text-lg transition-all"
                    >
                        Mission Control
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>

                {/* Updated Stats Grid with Anchor Tenant Focus */}
                <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] mx-auto mb-4">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-white">500 MW Baseload</h3>
                        <p className="mt-2 text-sm text-gray-400">24/7 Guaranteed Demand</p>
                        <p className="mt-1 text-xs text-[hsl(var(--primary))]">The Anchor That Secures Financing</p>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] mx-auto mb-4">
                            <Database className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-white">100% Sovereign AI</h3>
                        <p className="mt-2 text-sm text-gray-400">Africa's Data, Africa's Infrastructure</p>
                        <p className="mt-1 text-xs text-[hsl(var(--accent))]">Built on African Soil</p>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500/20 text-purple-400 mx-auto mb-4">
                            <Globe className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-white">4,000 MW Surplus</h3>
                        <p className="mt-2 text-sm text-gray-400">Public Grid Output</p>
                        <p className="mt-1 text-xs text-purple-400">Powering 60M+ People</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
