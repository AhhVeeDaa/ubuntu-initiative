/**
 * AI Orchestration - THE PRODUCT PAGE
 */

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Cpu, Zap, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'AI Orchestration | Ubuntu',
  description: 'Licensable AI orchestration layer for 500MW-scale compute. Governed, deployable, available now.',
};

export default function AIOrchestrationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              AI Orchestration Layer
            </h1>
            <p className="text-2xl text-gray-300 mb-8">
              Licensable. Deployable. Governed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-all text-lg"
              >
                Contact for Licensing
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/governance-framework"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all text-lg"
              >
                View Governance Framework
              </Link>
            </div>
          </div>

          {/* What We Sell */}
          <div className="glass-card p-8 rounded-xl mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">What We Sell</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              Ubuntu sells an AI execution and governance layer that assumes explicit energy 
              envelopes (e.g., 500MW per Ubuntu Cell).
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              This is not a future product.
              <br />
              This is not a demo.
            </p>
            <p className="text-white text-xl font-semibold">
              This is the orchestration layer that makes sovereign-scale AI governable.
            </p>
          </div>

          {/* What It Does */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">What It Does</h2>
            <div className="grid md:grid-cols-3 gap-6">
              
              <div className="glass-card p-6 rounded-xl">
                <div className="h-12 w-12 rounded-lg bg-[hsl(var(--primary))]/20 flex items-center justify-center mb-4">
                  <Cpu className="h-6 w-6 text-[hsl(var(--primary))]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Orchestration</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Load-aware AI scheduling</li>
                  <li>• Quantum-classical workflow management</li>
                  <li>• Multi-tenant isolation with sovereign boundaries</li>
                </ul>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="h-12 w-12 rounded-lg bg-[hsl(var(--accent))]/20 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-[hsl(var(--accent))]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Agent Execution</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Policy-aware task routing</li>
                  <li>• Resource allocation within energy caps</li>
                  <li>• Audit trail generation for compliance</li>
                </ul>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Governance Enforcement</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Real-time load monitoring</li>
                  <li>• Ramp rate compliance</li>
                  <li>• Automatic constraint enforcement</li>
                  <li>• Revocation capability</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What It Assumes */}
          <div className="glass-card p-8 rounded-xl mb-12 border-l-4 border-[hsl(var(--primary))]">
            <h2 className="text-3xl font-bold text-white mb-6">What It Assumes</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">Energy Envelope</h3>
              <p className="text-gray-300 mb-4">
                Ubuntu orchestration assumes a defined power budget (e.g., 500MW per Ubuntu Cell).
              </p>
              <div className="p-4 bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/30 rounded-lg">
                <p className="text-gray-300 text-sm">
                  <strong className="text-white">Energy facilitation:</strong> Ubuntu facilitates access to renewable 
                  energy partnerships through DRC government relationships. The Inga hydro region offers 500MW+ envelopes 
                  for licensed deployments. Ubuntu does not own or operate power infrastructure—buyers procure energy 
                  with our facilitation.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-semibold mb-3">
                  <span className="text-[hsl(var(--primary))]">You provide:</span>
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Energy source (grid, hydro, solar, etc.)</li>
                  <li>• Physical infrastructure (compute, cooling, networking)</li>
                  <li>• Operational envelope</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">
                  <span className="text-[hsl(var(--accent))]">We provide:</span>
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Orchestration layer that respects constraints</li>
                  <li>• Governance enforcement</li>
                  <li>• Compliance automation</li>
                  <li>• Energy partnership facilitation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How It's Sold - continues below */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">How It's Sold</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <div className="text-[hsl(var(--primary))] text-2xl font-bold mb-3">1</div>
                <h3 className="text-xl font-bold text-white mb-3">Exclusive License</h3>
                <p className="text-gray-300 mb-4">
                  Full rights to AI orchestration layer for defined geography/sector
                </p>
                <Link href="/contact" className="text-[hsl(var(--primary))] hover:underline font-semibold">
                  Contact for terms →
                </Link>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="text-[hsl(var(--accent))] text-2xl font-bold mb-3">2</div>
                <h3 className="text-xl font-bold text-white mb-3">Custom Deployment</h3>
                <p className="text-gray-300 mb-4">
                  Deploy Ubuntu orchestration on your infrastructure
                </p>
                <Link href="/contact" className="text-[hsl(var(--primary))] hover:underline font-semibold">
                  Schedule consultation →
                </Link>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="text-blue-500 text-2xl font-bold mb-3">3</div>
                <h3 className="text-xl font-bold text-white mb-3">Joint Venture</h3>
                <p className="text-gray-300 mb-4">
                  Partner funds compute, Ubuntu provides orchestration + governance
                </p>
                <Link href="/contact" className="text-[hsl(var(--primary))] hover:underline font-semibold">
                  Partnership inquiry →
                </Link>
              </div>
            </div>
          </div>

          {/* Who Buys It */}
          <div className="glass-card p-8 rounded-xl mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Who Buys It</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-[hsl(var(--primary))] pl-6">
                <h3 className="text-xl font-bold text-white mb-2">Hyperscalers</h3>
                <p className="text-gray-300">
                  License orchestration for sovereign compute deployments. Governance built-in. Energy agnostic.
                </p>
              </div>

              <div className="border-l-4 border-[hsl(var(--accent))] pl-6">
                <h3 className="text-xl font-bold text-white mb-2">Sovereign Buyers</h3>
                <p className="text-gray-300">
                  Deploy governed AI within national infrastructure. Policy compliance automated.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-bold text-white mb-2">Industrial AI</h3>
                <p className="text-gray-300">
                  Operate AI at scale with enforceable constraints. Load management included.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="glass-card p-8 rounded-xl mb-12 bg-black/40">
            <h2 className="text-3xl font-bold text-white mb-6">The Ubuntu Cell</h2>
            <p className="text-gray-300 mb-6">
              1 Ubuntu Cell = 500MW governed energy envelope + AI orchestration + execution layer + sovereign governance
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-3">Assumed Envelope</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Base unit: 500MW continuous</li>
                  <li>• Scalable via replication (not expansion)</li>
                  <li>• Governed load ramps</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Interfaces</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• API layer for workload submission</li>
                  <li>• Dashboard for monitoring and audit</li>
                  <li>• Compliance reporting automated</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Governance</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Hard caps on resource allocation</li>
                  <li>• Audit trail immutable</li>
                  <li>• Revocation protocol built-in</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Why This Matters */}
          <div className="glass-card p-8 rounded-xl border-l-4 border-amber-500">
            <h2 className="text-3xl font-bold text-white mb-6">Why This Matters</h2>
            
            <p className="text-gray-300 mb-4">
              Most AI deployments fail at scale because:
            </p>
            <ul className="text-gray-300 space-y-2 mb-6">
              <li>• Energy constraints are ignored</li>
              <li>• Governance is bolted on</li>
              <li>• Infrastructure precedes demand</li>
            </ul>

            <p className="text-white font-semibold mb-4">
              Ubuntu inverts this:
            </p>
            <ul className="text-gray-300 space-y-2 mb-6">
              <li>• Constraints are designed-in</li>
              <li>• Governance enables deployment</li>
              <li>• Infrastructure follows proven demand</li>
            </ul>

            <p className="text-white text-xl font-bold">
              This is what makes 500MW-scale AI possible.
            </p>
          </div>

          {/* Final CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-all text-xl"
            >
              License the Stack Today
              <ArrowRight className="h-6 w-6" />
            </Link>
            <p className="text-gray-400 mt-4 text-sm">
              Available for licensing Q1 2026
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
