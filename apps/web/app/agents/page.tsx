'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Zap, BarChart3, Clock, Eye, CheckCircle2, AlertCircle, Globe } from 'lucide-react';

/**
 * PUBLIC AGENTS PAGE - REDESIGNED
 * 
 * PURPOSE: Build trust through transparency
 * FOCUS: What agents do, why they matter, oversight framework
 * NO OPERATIONAL CONTROLS: This is public information only
 */

interface PublicAuditLog {
  id: string;
  agent_id: string;
  action_type: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  approved_at: string;
}

export default function AgentsPage() {
  const [auditLog, setAuditLog] = useState<PublicAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicAuditLog();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchPublicAuditLog, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchPublicAuditLog() {
    try {
      const res = await fetch('/api/agents/audit-log');
      const data = await res.json();
      setAuditLog(data.logs || []);
    } catch (error) {
      console.error('Failed to fetch audit log:', error);
    } finally {
      setLoading(false);
    }
  }

  const agents = [
    {
      id: 'agent_001_policy',
      name: 'Policy Monitor',
      purpose: 'Tracks regional energy policies, AI sovereignty regulations, and infrastructure frameworks affecting the Ubuntu Initiative',
      icon: ShieldCheck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      capabilities: [
        'Monitors African Union policy announcements',
        'Tracks World Bank infrastructure guidelines',
        'Scans DRC energy ministry updates',
        'Identifies relevant regulatory changes'
      ],
      transparency: [
        'All policy scans logged publicly',
        'Human review before any recommendations',
        'Full source attribution maintained'
      ],
      oversight: 'Requires manual approval before policy alerts are published'
    },
    {
      id: 'agent_002_funding',
      name: 'Funding & Grants',
      purpose: 'Monitors donation streams via Stripe and scans for relevant grant opportunities while performing fraud detection',
      icon: Zap,
      color: 'text-[hsl(var(--accent))]',
      bgColor: 'bg-[hsl(var(--accent))]/10',
      capabilities: [
        'Verifies Stripe transactions',
        'Scans grant databases',
        'Detects suspicious patterns',
        'Tracks funding milestones'
      ],
      transparency: [
        'All transactions verified manually',
        'Grant opportunities vetted by team',
        'Rate limited to prevent spam',
        'Financial data never exposed publicly'
      ],
      oversight: 'Two-factor approval required for all financial actions'
    },
    {
      id: 'agent_004_milestones',
      name: 'Milestone Tracker',
      purpose: 'Validates and publishes project progress updates from GitHub commits and manual submissions',
      icon: BarChart3,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      capabilities: [
        'Monitors GitHub repository activity',
        'Validates milestone completion',
        'Timestamps progress immutably',
        'Generates progress reports'
      ],
      transparency: [
        'All milestones publicly visible',
        'Source verification required',
        'Audit trail immutable'
      ],
      oversight: 'Manual verification before publication to progress page'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[200px] bg-[hsl(var(--primary))]/5 rounded-full blur-[100px] -z-10" />
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
              Transparent <span className="text-gradient">AI Oversight</span>
            </h1>
            
            <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
              Our semi-autonomous agent network operates with complete transparency.
              Every action is logged, reviewed, and auditable. No black boxes, no secrets.
            </p>

            {/* Trust Signals */}
            <div className="flex items-center justify-center flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-gray-300 font-medium">Human Oversight Required</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <Eye className="h-4 w-4 text-blue-500" />
                <span className="text-gray-300 font-medium">Full Audit Trail</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <ShieldCheck className="h-4 w-4 text-purple-500" />
                <span className="text-gray-300 font-medium">Rate Limited</span>
              </div>
            </div>
          </div>

          {/* What Our Agents Do */}
          <div className="mb-20">
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
              What Our Agents Do
            </h2>
            <p className="text-gray-400 mb-12 max-w-3xl">
              These AI agents automate research and monitoring tasks, allowing our team to focus on 
              strategic decisions. Every agent action requires human approval before taking effect.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {agents.map((agent) => (
                <div 
                  key={agent.id} 
                  className="group relative bg-[#0a0f1a] border border-white/10 rounded-[40px] p-8 backdrop-blur-3xl hover:border-white/20 transition-all duration-500"
                >
                  {/* Icon */}
                  <div className={`p-5 rounded-2xl ${agent.bgColor} border border-white/5 w-fit mb-6`}>
                    <agent.icon className={`h-10 w-10 ${agent.color}`} />
                  </div>

                  {/* Agent Name & Purpose */}
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
                    {agent.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {agent.purpose}
                  </p>

                  {/* Capabilities */}
                  <div className="mb-6">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                      Capabilities
                    </h4>
                    <ul className="space-y-2">
                      {agent.capabilities.map((capability, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                          <span className="text-[hsl(var(--primary))] flex-shrink-0 mt-1">•</span>
                          <span>{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Transparency Signals */}
                  <div className="mb-6">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                      Transparency
                    </h4>
                    <ul className="space-y-2">
                      {agent.transparency.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Oversight Info */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-500 leading-relaxed">
                        <strong className="text-blue-400">Oversight:</strong> {agent.oversight}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Public Audit Log */}
          <div className="mb-20">
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
              Recent Agent Actions
            </h2>
            <p className="text-gray-400 mb-12 max-w-3xl">
              Public log of agent actions that have been reviewed and approved by our team.
              This log demonstrates our commitment to transparency and accountability.
            </p>

            <div className="bg-[#0a0f1a] border border-white/10 rounded-[40px] overflow-hidden">
              <div className="p-8 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[hsl(var(--primary))]" />
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                      Public Audit Trail
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-widest">
                    Live Updates
                  </span>
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--primary))] mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm">Loading audit log...</p>
                  </div>
                ) : auditLog.length === 0 ? (
                  <div className="text-center py-12 text-gray-600">
                    <Clock className="h-12 w-12 opacity-20 mx-auto mb-4" />
                    <p className="font-bold uppercase tracking-widest text-xs">
                      No public actions yet
                    </p>
                    <p className="text-gray-600 text-xs mt-2">
                      Agent actions will appear here once approved
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {auditLog.map((log) => (
                      <div 
                        key={log.id}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all"
                      >
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-black text-white/60 uppercase tracking-wider">
                              {log.agent_id} • {log.action_type}
                            </span>
                            <span className="text-xs text-gray-600">
                              {new Date(log.approved_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {log.description}
                          </p>
                          {log.impact && (
                            <span className={`inline-block mt-2 text-[10px] px-2 py-1 rounded-full border font-bold uppercase tracking-wider ${
                              log.impact === 'high' ? 'border-red-500/30 text-red-500 bg-red-500/5' :
                              log.impact === 'medium' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5' :
                              'border-green-500/30 text-green-500 bg-green-500/5'
                            }`}>
                              {log.impact} Impact
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Oversight Framework */}
          <div className="p-1 rounded-[40px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 mb-20">
            <div className="bg-[#05080f] rounded-[39px] p-10 md:p-16 border border-white/5 flex flex-col md:flex-row items-center gap-12">
              <div className="w-24 h-24 rounded-full bg-black border-2 border-[hsl(var(--primary))]/30 flex items-center justify-center flex-shrink-0">
                <Globe className="h-10 w-10 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
                  Human-Centered Automation
                </h4>
                <p className="text-gray-400 text-lg leading-relaxed mb-4">
                  Our agents amplify human decision-making, they don't replace it.
                  Every autonomous action requires explicit approval.
                  Every decision is cross-verified and logged to an immutable audit trail.
                </p>
                <p className="text-gray-500 text-sm">
                  Built on the <strong className="text-white">Inter-Agent Audit Network (IAAN)</strong> principle:
                  No single agent operates without lateral oversight.
                </p>
              </div>
            </div>
          </div>

          {/* Why This Matters */}
          <div className="bg-[#0a0f1a] border border-white/10 rounded-[40px] p-10 md:p-16">
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
              Why Transparency Matters
            </h3>
            <div className="grid md:grid-cols-2 gap-8 text-gray-400">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="h-5 w-5 text-[hsl(var(--primary))]" />
                  <h4 className="text-lg font-bold text-white">No Black Boxes</h4>
                </div>
                <p className="text-sm leading-relaxed">
                  Every agent decision is explainable and traceable. You can see exactly what our 
                  agents are doing and why they're doing it.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="h-5 w-5 text-[hsl(var(--primary))]" />
                  <h4 className="text-lg font-bold text-white">Built for Trust</h4>
                </div>
                <p className="text-sm leading-relaxed">
                  We're building Africa's AI infrastructure. Trust is our foundation. 
                  That's why every agent action is logged and auditable.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--primary))]" />
                  <h4 className="text-lg font-bold text-white">Human Oversight</h4>
                </div>
                <p className="text-sm leading-relaxed">
                  AI is a tool, not a replacement. Our team reviews every significant 
                  agent action before it's executed.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="h-5 w-5 text-[hsl(var(--primary))]" />
                  <h4 className="text-lg font-bold text-white">Accountable by Design</h4>
                </div>
                <p className="text-sm leading-relaxed">
                  Our audit trail is immutable and public. We're accountable to our 
                  supporters and stakeholders at every step.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
