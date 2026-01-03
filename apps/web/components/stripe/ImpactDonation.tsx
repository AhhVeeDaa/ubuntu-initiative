'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Zap, Shield, Rocket, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const PHASE_0_GOAL = 500000;

type ImpactTier = {
    amount: number;
    label: string;
    description: string;
    icon: React.ReactNode;
    impact: string;
};

const TIERS: ImpactTier[] = [
    {
        amount: 50,
        label: 'Seed Supporter',
        description: 'Keep the lights on.',
        icon: <Heart className="h-6 w-6 text-pink-500" />,
        impact: 'Funds 1 day of community server costs.'
    },
    {
        amount: 500,
        label: 'Coalition Builder',
        description: 'Power the legal framework.',
        icon: <Shield className="h-6 w-6 text-blue-500" />,
        impact: 'Funds 2 hours of specialized legal counsel.'
    },
    {
        amount: 5000,
        label: 'Phase 0 Angel',
        description: 'Launch the mission.',
        icon: <Rocket className="h-6 w-6 text-[hsl(var(--primary))]" />,
        impact: 'Funds an independent technical validation trip.'
    }
];

export function ImpactDonation() {
    const [selectedAmount, setSelectedAmount] = useState<number>(50);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [raised, setRaised] = useState(12500); // Default start

    useEffect(() => {
        async function fetchRaised() {
            try {
                const { data } = await supabase
                    .from('metrics')
                    .select('metric_value')
                    .eq('metric_name', 'Capital Committed')
                    .single<any>();

                if (data) setRaised(Number(data.metric_value));
            } catch (e) {
                console.error("Error fetching raised amount", e);
            }
        }
        fetchRaised();
    }, []);

    const activeAmount = customAmount ? parseInt(customAmount) : selectedAmount;
    const progressPercent = Math.min(100, (raised / PHASE_0_GOAL) * 100);
    const impactPercent = Math.min(100, ((raised + (activeAmount || 0)) / PHASE_0_GOAL) * 100);
    const contributionPercent = (((activeAmount || 0) / PHASE_0_GOAL) * 100).toFixed(4);

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomAmount(e.target.value);
        if (e.target.value) setSelectedAmount(0); // Deselect tiers
    };

    const selectTier = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleDonate = async () => {
        if (!activeAmount || activeAmount < 1) return;
        setIsLoading(true);

        const tierLabel = TIERS.find(t => t.amount === activeAmount)?.label || 'Custom Impact';

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: activeAmount,
                    label: tierLabel
                }),
            });
            const data = await response.json();
            if (data.url) window.location.href = data.url;
        } catch (error) {
            console.error('Checkout failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left: The Vision & Progress */}
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Fund the <span className="text-gradient">Foundation</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8">
                            We are raising <strong>$500,000</strong> for Phase 0: Feasibility, Legal Formation, and Anchor Partnerships.
                            Your contribution directly accelerates African digital sovereignty.
                        </p>

                        {/* Progress Bar */}
                        <div className="glass p-6 rounded-2xl mb-8 border border-white/10">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Raised: <span className="text-white font-mono">${raised.toLocaleString()}</span></span>
                                <span className="text-gray-400">Goal: <span className="text-[hsl(var(--primary))] font-mono">${PHASE_0_GOAL.toLocaleString()}</span></span>
                            </div>
                            <div className="h-4 bg-black/50 rounded-full overflow-hidden relative">
                                {/* Existing Progress */}
                                <div
                                    className="absolute top-0 left-0 h-full bg-[hsl(var(--primary))]/50 transition-all duration-1000"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                                {/* Potential Progress (Your Contribution) */}
                                {activeAmount > 0 && (
                                    <div
                                        className="absolute top-0 h-full bg-[hsl(var(--accent))] animate-pulse transition-all duration-300"
                                        style={{
                                            left: `${progressPercent}%`,
                                            width: `${((activeAmount / PHASE_0_GOAL) * 100)}%`
                                        }}
                                    ></div>
                                )}
                            </div>
                            <div className="mt-4 text-xs text-gray-500 flex justify-between">
                                <span>Phase 0 Launch</span>
                                <span>100% Funded</span>
                            </div>
                        </div>

                        {/* Dynamic Impact Statement */}
                        <div className="flex items-start space-x-4 p-4 rounded-xl bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                            <Zap className="h-6 w-6 text-[hsl(var(--accent))] flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="text-white font-bold text-lg mb-1">Your Impact</h4>
                                <p className="text-gray-300">
                                    A <strong>${activeAmount?.toLocaleString() || 0}</strong> contribution moves the needle by <strong>{contributionPercent}%</strong> towards the goal.
                                    {activeAmount >= 5000 ? " This is a major structural investment." :
                                        activeAmount >= 500 ? " This funds direct legal and operational hours." :
                                            " Every bit of signal power counts."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Donation Tiers */}
                    <div className="space-y-6">
                        {TIERS.map((tier) => (
                            <div
                                key={tier.amount}
                                onClick={() => selectTier(tier.amount)}
                                className={`
                                    cursor-pointer relative p-6 rounded-xl border transition-all duration-300
                                    ${selectedAmount === tier.amount
                                        ? 'bg-white/10 border-[hsl(var(--primary))] shadow-lg shadow-[hsl(var(--primary))]/10 translate-x-2'
                                        : 'bg-black/40 border-white/10 hover:bg-white/5 hover:border-white/20'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between pointer-events-none">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3 rounded-lg bg-black/50 ${selectedAmount === tier.amount ? 'text-[hsl(var(--primary))]' : 'text-gray-400'}`}>
                                            {tier.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg">{tier.label}</h3>
                                            <p className="text-[hsl(var(--primary))] font-mono font-bold">${tier.amount}</p>
                                        </div>
                                    </div>
                                    {selectedAmount === tier.amount && <Check className="h-6 w-6 text-[hsl(var(--primary))]" />}
                                </div>
                                <p className="mt-2 text-gray-400 text-sm ml-16">{tier.impact}</p>
                            </div>
                        ))}

                        {/* Custom Amount */}
                        <div className="bg-black/40 p-6 rounded-xl border border-white/10">
                            <label className="text-sm text-gray-400 mb-2 block">Or enter a custom amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                <input
                                    type="number"
                                    value={customAmount}
                                    onChange={handleCustomChange}
                                    className="w-full bg-black/50 border border-white/20 rounded-lg py-3 pl-8 pr-4 text-white focus:border-[hsl(var(--primary))] focus:outline-none transition-all"
                                    placeholder="Other amount"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleDonate}
                            disabled={isLoading || !activeAmount}
                            className={`
                                w-full py-4 rounded-xl font-bold text-lg transition-all
                                ${isLoading
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-white hover:scale-[1.02] shadow-xl shadow-[hsl(var(--primary))]/20'
                                }
                            `}
                        >
                            {isLoading ? 'Processing...' : `Donate $${activeAmount?.toLocaleString() || '0'}`}
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-4">
                            Secure payment via Stripe. Receipts provided automatically.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
