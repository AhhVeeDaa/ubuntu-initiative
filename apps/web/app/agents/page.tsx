'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SystemLogs } from '@/components/ai/SystemLogs';
import { Cpu, ShieldCheck, Zap, BarChart3, Globe, Loader2, Play, CheckCircle2 } from 'lucide-react';

export default function AgentsPage() {
  const [triggering, setTriggering] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);

  const agents = [
    {
      id: 'agent_001',
      name: 'Policy Monitor',
      status: 'Operational',
      role: 'Monitors regional energy & AI policies',
      icon: ShieldCheck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      apiPath: '/api/agents/policy',
      triggerLabel: 'Trigger Policy Scan',
      capabilities: ['Policy Scraping', 'Relevance Filtering', 'Audit Logging']
    },
    {
      id: 'agent_002',
      name: 'Funding & Grants',
      status: 'Operational',
      role: 'Tracks donations and grant opportunities',
      icon: Zap,
      color: 'text-[hsl(var(--accent))]',
      bgColor: 'bg-[hsl(var(--accent))]/10',
      apiPath: '/api/agents/funding',
      triggerLabel: 'Scan for Grants',
      capabilities: ['Stripe Integration', 'Grant Scanning', 'Fraud Detection']
    },
    {
      id: 'agent_004',
      name: 'Milestone Ingestion',
      status: 'Online',
      role: 'Validates and publishes project progress',
      icon: BarChart3,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      apiPath: '/api/agents/milestones',
      triggerLabel: 'Verify Progress',
      capabilities: ['GitHub Hooks', 'Manual Verification', 'Phase 0 Compliance']
    }
  ];

  const handleTrigger = async (agent: any) => {
    setTriggering(agent.id);
    setLastResult(null);
    try {
      const res = await fetch(agent.apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: agent.id === 'agent_004' ? 'validate_milestone' : 'api', data: {} })
      });
      const result = await res.json();
      setLastResult({ id: agent.id, ...result });
    } catch (error) {
      console.error('Trigger error:', error);
    } finally {
      setTriggering(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[200px] bg-[hsl(var(--primary))]/5 rounded-full blur-[100px] -z-10" />
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
              Ubuntu <span className="text-gradient">Agent Network</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Our semi-autonomous agent network coordinates the initiative's complex operations—ensuring transparency, compliance, and rapid execution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            {/* Left Column: Agent Cards */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {agents.map((agent) => (
                  <div key={agent.id} className="group relative bg-[#0a0f1a] border border-white/10 rounded-[40px] p-10 backdrop-blur-3xl hover:border-white/20 transition-all duration-500 overflow-hidden">
                    <div className={`p-5 rounded-2xl ${agent.bgColor} border border-white/5 animate-glow-breath w-fit mb-8`}>
                      <agent.icon className={`h-10 w-10 ${agent.color}`} />
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">{agent.name}</h3>
                      <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border border-current bg-current/5 ${agent.color}`}>
                        {agent.status}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                      {agent.role}
                    </p>

                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-2">
                        {agent.capabilities.map((cap) => (
                          <span key={cap} className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-gray-300 font-bold">
                            {cap}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          disabled={triggering === agent.id}
                          onClick={() => handleTrigger(agent)}
                          className="flex-grow py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {triggering === agent.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Play className="h-3 w-3 fill-current" />
                          )}
                          {agent.triggerLabel}
                        </button>
                        {agent.id === 'agent_004' && (
                          <a
                            href="/agents/milestones"
                            className="p-4 bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/30 rounded-2xl text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/20 transition-all"
                            title="Open Manual Submission"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        )}
                      </div>

                      {lastResult?.id === agent.id && (
                        <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Execution Success</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Principle Panel */}
              <div className="p-1 rounded-[40px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20">
                <div className="bg-[#05080f] rounded-[39px] p-10 md:p-16 border border-white/5 flex flex-col md:flex-row items-center gap-12">
                  <div className="w-24 h-24 rounded-full bg-black border-2 border-[hsl(var(--primary))]/30 flex items-center justify-center flex-shrink-0 animate-glow-breath" style={{ color: 'hsl(var(--primary))' }}>
                    <Globe className="h-10 w-10 text-[hsl(var(--primary))]" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">The IAAN Principle</h4>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      Our <strong className="text-white">Inter-Agent Audit Network</strong> ensures no single agent operates without lateral oversight.
                      Every decision is cross-verified and logged to an immutable audit trail.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Logs */}
            <div className="lg:col-span-1">
              <SystemLogs />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  );
}
