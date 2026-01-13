/**
 * Institutional Monitoring Agents
 * Public registry and transparency layer
 */

'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Zap, BarChart3, Eye, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export default function AgentsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="grid md:grid-cols-3 gap-12 items-center mb-16">
            <div className="md:col-span-2">
              <div className="inline-block px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-full mb-4">
                <span className="text-amber-400 text-sm font-bold uppercase tracking-wider">
                  Dashboard Feature - Not Part of Licensable Product
                </span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-6">
                Platform Monitoring Agents
              </h1>
              <p className="text-gray-300 text-xl leading-relaxed max-w-3xl">
                These are internal automation agents used by Ubuntu for platform operations and transparency.
                They are not part of the AI orchestration product available for licensing. For product features,
                see <a href="/ai-orchestration" className="text-[hsl(var(--primary))] hover:underline">AI Orchestration</a>.</p>
                institutional oversight and defined ethical boundaries.
              </p>
            </div>
            <div className="relative">
              <div className="relative z-10 glass-card p-4 rounded-2xl border border-white/10 shadow-2xl">
                <Image
                  src="/institutional_monitoring_agents_abstract.png"
                  alt="Monitoring Agents Connectivity"
                  width={400}
                  height={400}
                  className="rounded-xl"
                />
              </div>
              <div className="absolute -inset-4 bg-[hsl(var(--primary))]/10 blur-2xl rounded-full z-0" />
            </div>
          </div>

          {/* Boundary Statement - CRITICAL */}
          <div className="glass-card p-8 rounded-xl mb-12 border-l-4 border-amber-500">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              Operational Boundaries
            </h2>
            <p className="text-gray-300 mb-6">
              These agents operate under strict human oversight and defined limitations:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Automated Operations
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Data Collection:</strong> Public sources only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Analysis & Reporting:</strong> Flagged for review</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Recommendations:</strong> Advisory only</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Human-Only Operations
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span><strong>Policy Decisions:</strong> Human-only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span><strong>Fund Allocation:</strong> Human-only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span><strong>Institutional Commitments:</strong> Human-only</span>
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-gray-400 text-sm mt-6 p-4 bg-black/40 rounded-lg">
              All high-stakes actions require explicit human authorization. No agent operates
              autonomously beyond data aggregation and reporting.
            </p>
          </div>

          {/* Agent Registry */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Active Agents</h2>
            <div className="grid gap-6">

              {/* Policy Monitoring Agent */}
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-[hsl(var(--primary))]/20 flex items-center justify-center flex-shrink-0">
                      <Eye className="h-6 w-6 text-[hsl(var(--primary))]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Policy Monitoring Agent</h3>
                      <p className="text-gray-400">
                        Tracks African AI policy developments, government announcements, and regulatory changes.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-medium flex-shrink-0">
                    Active
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Scope</p>
                    <p className="text-gray-300 text-sm">Public policy documents, official announcements</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Limits</p>
                    <p className="text-gray-300 text-sm">Cannot interpret intent or make recommendations</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Oversight</p>
                    <p className="text-gray-300 text-sm">Reviewed by governance team</p>
                  </div>
                </div>
              </div>

              {/* Progress Tracking Agent */}
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-[hsl(var(--accent))]/20 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-6 w-6 text-[hsl(var(--accent))]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Progress & Milestone Agent</h3>
                      <p className="text-gray-400">
                        Tracks Phase 0 completion status, milestone achievements, and timeline adherence.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-medium flex-shrink-0">
                    Active
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Scope</p>
                    <p className="text-gray-300 text-sm">Internal project data, completion metrics</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Limits</p>
                    <p className="text-gray-300 text-sm">Reports status only, cannot adjust timelines</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Oversight</p>
                    <p className="text-gray-300 text-sm">Validated against institutional records</p>
                  </div>
                </div>
              </div>

              {/* Funding Transparency Agent */}
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Funding Transparency Agent</h3>
                      <p className="text-gray-400">
                        Aggregates funding allocation data for public transparency reporting.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-medium flex-shrink-0">
                    Active
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Scope</p>
                    <p className="text-gray-300 text-sm">Aggregated donation and allocation metrics</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Limits</p>
                    <p className="text-gray-300 text-sm">Cannot access individual transaction details</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase mb-1">Oversight</p>
                    <p className="text-gray-300 text-sm">Finance team review required</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Approval Process */}
          <div className="glass-card p-8 rounded-xl overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-8">Human Oversight Process</h2>
              <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
                <div className="space-y-6">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    The Ubuntu Initiative maintains a "Human-in-the-loop" architecture. Agents
                    are restricted to data processing and observation; they cannot commit the
                    institution to actions, allocate financial resources, or pivot policy without
                    explicit human authorization.
                  </p>
                  <div className="grid gap-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                      <p className="text-white font-semibold">Immutable Logging</p>
                      <p className="text-gray-400 text-sm">Every agent action and human decision is cryptographically logged.</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                      <p className="text-white font-semibold">Tiered Authorization</p>
                      <p className="text-gray-400 text-sm">High-stakes operations require multi-party consensus from human directors.</p>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <Image
                    src="/human_oversight_interaction.png"
                    alt="Human Oversight Interaction"
                    width={500}
                    height={300}
                    className="rounded-xl border border-white/10 shadow-xl opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-[hsl(var(--primary))] text-black text-xs font-bold rounded-full uppercase tracking-tighter">
                      Human Authorization Required
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 pt-8 border-t border-white/10">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-[hsl(var(--primary))]/20 flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-8 w-8 text-[hsl(var(--primary))]" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">1. Agent Action</h3>
                  <p className="text-gray-400 text-sm">Agent identifies action requiring approval</p>
                </div>

                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">2. Queue</h3>
                  <p className="text-gray-400 text-sm">Action enters approval queue for human review</p>
                </div>

                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">3. Review</h3>
                  <p className="text-gray-400 text-sm">Authorized personnel assess and decide</p>
                </div>

                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">4. Execute</h3>
                  <p className="text-gray-400 text-sm">Approved actions executed and logged</p>
                </div>
              </div>

              <p className="text-gray-500 text-sm mt-6 text-center">
                All agent activities are recorded in an immutable audit log accessible to governance stakeholders.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
