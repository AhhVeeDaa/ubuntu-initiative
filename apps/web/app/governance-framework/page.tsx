/**
 * Governance Framework - Constraints Enable Scale
 */

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, CheckCircle, XCircle, AlertTriangle, Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Governance Framework | Ubuntu',
  description: 'Governance as infrastructure. Constraints that enable 500MW-scale AI deployment.',
};

export default function GovernanceFrameworkPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Governance as Infrastructure
            </h1>
            <p className="text-2xl text-gray-300">
              Constraints that enable scale.
            </p>
          </div>

          {/* Why Governance Matters */}
          <div className="glass-card p-8 rounded-xl mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Why Governance Matters</h2>
            <p className="text-gray-300 text-lg mb-6">
              Sovereign AI at 500MW scale requires enforceable constraints.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-red-400 mb-4">Without Governance:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                    <span>Energy overruns crash systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                    <span>Policy violations create liability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                    <span>Scale becomes unmanageable</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-green-400 mb-4">With Ubuntu Governance:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    <span>Load caps are hard limits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    <span>Compliance is automated</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    <span>Scale is repeatable</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* What Ubuntu Enforces */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">What Ubuntu Enforces</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <div className="h-12 w-12 rounded-lg bg-[hsl(var(--primary))]/20 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-[hsl(var(--primary))]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Load Envelope</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" />
                    <span>500MW cap per Ubuntu Cell (hard limit)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" />
                    <span>Ramp rate compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" />
                    <span>Real-time monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" />
                    <span>Automatic shutoff on violation</span>
                  </li>
                </ul>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Policy Compliance</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Sovereign data residency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Workload classification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Audit trail generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Regulatory alignment</span>
                  </li>
                </ul>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="h-12 w-12 rounded-lg bg-[hsl(var(--accent))]/20 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-[hsl(var(--accent))]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Operational Constraints</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[hsl(var(--accent))] flex-shrink-0 mt-0.5" />
                    <span>Multi-tenant isolation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[hsl(var(--accent))] flex-shrink-0 mt-0.5" />
                    <span>Resource allocation fairness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[hsl(var(--accent))] flex-shrink-0 mt-0.5" />
                    <span>Priority queuing rules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[hsl(var(--accent))] flex-shrink-0 mt-0.5" />
                    <span>Revocation capability</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* What Ubuntu Does NOT Provide */}
          <div className="glass-card p-8 rounded-xl mb-12 border-l-4 border-red-500">
            <h2 className="text-3xl font-bold text-white mb-6">What Ubuntu Does NOT Provide</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-red-400 font-semibold mb-3">Energy</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Ubuntu does not provide power infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Ubuntu does not manage energy contracts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Ubuntu does not build grid connections</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-red-400 font-semibold mb-3">Hardware</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Ubuntu does not procure compute</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Ubuntu does not manage data centers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Ubuntu does not provision cooling</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-red-400 font-semibold mb-3">Unlimited Scale</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Ubuntu enforces 500MW envelopes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Scale via replication, not expansion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Constraints are features, not bugs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How Governance Enables Deployment */}
          <div className="glass-card p-8 rounded-xl mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">How Governance Enables Deployment</h2>
            
            <p className="text-gray-300 mb-6">
              Institutional buyers require:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-black/40 p-4 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                <p className="text-white font-semibold">Predictable resource usage</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                <p className="text-white font-semibold">Enforceable policy compliance</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                <p className="text-white font-semibold">Audit trail for accountability</p>
              </div>
              <div className="bg-black/40 p-4 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                <p className="text-white font-semibold">Revocation for risk management</p>
              </div>
            </div>

            <p className="text-white text-lg font-semibold">
              Ubuntu provides all four as infrastructure.
            </p>
            <p className="text-gray-300 mt-4">
              This is why hyperscalers, sovereigns, and industrial AI operators can deploy at scale with confidence.
            </p>
          </div>

          {/* Governance as Product */}
          <div className="glass-card p-8 rounded-xl border-l-4 border-[hsl(var(--primary))]">
            <h2 className="text-3xl font-bold text-white mb-6">Governance as Product</h2>
            
            <p className="text-gray-300 mb-4">
              Governance is not ethics.
              <br />
              Governance is not marketing.
              <br />
              <span className="text-white font-semibold">Governance is what makes the product valuable.</span>
            </p>

            <div className="mt-6 mb-6">
              <p className="text-white mb-3">Buyers pay for:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-black/40 rounded-lg">
                  <p className="text-[hsl(var(--primary))] font-bold">Predictability</p>
                </div>
                <div className="text-center p-4 bg-black/40 rounded-lg">
                  <p className="text-[hsl(var(--primary))] font-bold">Compliance</p>
                </div>
                <div className="text-center p-4 bg-black/40 rounded-lg">
                  <p className="text-[hsl(var(--primary))] font-bold">Control</p>
                </div>
                <div className="text-center p-4 bg-black/40 rounded-lg">
                  <p className="text-[hsl(var(--primary))] font-bold">Revocation</p>
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-lg">
              Energy is cheap.
              <br />
              <span className="text-white font-semibold">Governed energy is scarce.</span>
            </p>
          </div>

          {/* Separability Statement */}
          <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-gray-300 text-center italic">
              Ubuntu is structured so that platform ownership, governance authority, and infrastructure deployment remain separable.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/ai-orchestration"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-all text-xl"
            >
              License Governed Orchestration
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
