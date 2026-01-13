/**
 * About UbuntuHub
 * Platform context, boundaries, and governance structure
 */

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Database, Shield, Eye, Users } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'About Ubuntu | AI Orchestration Platform',
  description: 'Ubuntu provides sovereign AI orchestration and governance infrastructure. Licensable platform for 500MW-scale compute deployments.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Image Section */}
          <div className="relative h-[400px] w-full rounded-2xl overflow-hidden mb-16 group">
            <Image
              src="/ubuntuhub_hero_interface.png"
              alt="UbuntuHub Platform Infrastructure"
              fill
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                What is <span className="text-[hsl(var(--primary))]">Ubuntu</span>?
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl leading-relaxed">
                AI orchestration and governance platform for sovereign 500MW-scale compute deployments.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Platform Definition */}
            <div className="glass-card p-8 rounded-xl mb-12 border-l-4 border-[hsl(var(--primary))]">
              <h2 className="text-2xl font-bold text-white mb-4">What Ubuntu Is</h2>
              <p className="text-gray-300 leading-relaxed">
                Ubuntu is an AI orchestration platform that provides governance and execution infrastructure
                for sovereign-scale compute deployments. The platform assumes explicit energy envelopes
                (typically 500MW per unit) and enforces operational constraints that enable institutional deployment.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Ubuntu is not an energy provider, hardware vendor, or infrastructure builder. It is the
                orchestration layer that makes governed, auditable, sovereign AI possible at scale.
              </p>
            </div>

            {/* What We Are / Are Not */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">

              {/* What We Are */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Database className="h-6 w-6 text-[hsl(var(--primary))]" />
                  What Ubuntu IS
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--primary))] mt-1">✓</span>
                    <span>AI orchestration platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--primary))] mt-1">✓</span>
                    <span>Governance enforcement infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--primary))] mt-1">✓</span>
                    <span>Load-aware scheduling system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--primary))] mt-1">✓</span>
                    <span>Compliance automation layer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--primary))] mt-1">✓</span>
                    <span>Licensable, deployable software</span>
                  </li>
                </ul>
              </div>

              {/* What We Are Not */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-red-500" />
                  What Ubuntu IS NOT
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Not an energy infrastructure provider</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Not a hardware procurement vendor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Not a charitable/donation initiative</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Not a future-only vision</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Not affiliated with Ubuntu OS/Canonical</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Relationship to Ubuntu Initiative */}
            <div className="glass-card p-8 rounded-xl mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-[hsl(var(--primary))]" />
                Platform Structure & Separability
              </h2>
              <div className="bg-black/40 p-6 rounded-lg border border-[hsl(var(--primary))]/30 mb-6">
                <p className="text-gray-300 text-lg font-medium mb-3">
                  Ubuntu is architected so that platform ownership, governance authority, and 
                  infrastructure deployment remain separable entities.
                </p>
                <p className="text-gray-400 text-sm">
                  This structural design enables flexible licensing models, regulatory compliance across 
                  jurisdictions, and clean deployment partnerships without institutional conflicts.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">Platform (Software)</h3>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Orchestration layer</li>
                    <li>• Governance code</li>
                    <li>• Licensable IP</li>
                    <li>• Technical specs</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Governance (Authority)</h3>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Policy framework</li>
                    <li>• Compliance rules</li>
                    <li>• Audit protocols</li>
                    <li>• Institutional oversight</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Infrastructure (Physical)</h3>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Energy procurement</li>
                    <li>• Hardware deployment</li>
                    <li>• Facilities management</li>
                    <li>• Partner-funded</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Commercial Structure */}
            <div className="glass-card p-8 rounded-xl mb-12 bg-[hsl(var(--primary))]/5 border border-[hsl(var(--primary))]/20">
              <h2 className="text-2xl font-bold text-white mb-4">Commercial Structure</h2>
              <p className="text-gray-300 mb-6">
                Ubuntu operates as a licensable platform with multiple revenue pathways:
              </p>
              <div className="space-y-4">
                <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                  <h3 className="text-white font-semibold mb-2">Licensing Model</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Platform rights (exclusive or non-exclusive) licensed to hyperscalers, sovereigns, or infrastructure partners
                  </p>
                  <p className="text-gray-500 text-xs">
                    Revenue: Upfront license fee + recurring annual licensing + percentage of compute revenue
                  </p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                  <h3 className="text-white font-semibold mb-2">Custom Deployment</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Build infrastructure from scratch according to buyer's budget and specifications
                  </p>
                  <p className="text-gray-500 text-xs">
                    Revenue: Project-based fees + deployment services + ongoing platform support
                  </p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                  <h3 className="text-white font-semibold mb-2">Joint Venture Partnership</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Partner funds compute, Ubuntu provides orchestration + governance
                  </p>
                  <p className="text-gray-500 text-xs">
                    Revenue: Revenue share structure + operational fees
                  </p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-black/60 rounded-lg border border-[hsl(var(--primary))]/30">
                <p className="text-white font-semibold text-sm mb-2">
                  Critical: Ubuntu does not carry infrastructure capex
                </p>
                <p className="text-gray-400 text-xs">
                  Energy and hardware are buyer responsibilities. Ubuntu facilitates access to renewable 
                  energy partnerships (e.g., 500MW+ Inga hydro envelopes via DRC government relationships) 
                  but does not own or operate power infrastructure.
                </p>
              </div>
            </div>

            {/* Governance Structure */}
            <div className="glass-card p-8 rounded-xl mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-[hsl(var(--primary))]" />
                Governance & Transparency
              </h2>
              <p className="text-gray-300 mb-6">
                All platform operations maintain institutional accountability and transparency:
              </p>
              <div className="space-y-4">
                <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                  <h3 className="text-white font-semibold mb-2">Platform Monitoring</h3>
                  <p className="text-gray-400 text-sm">
                    Real-time oversight of orchestration operations, resource allocation, and compliance status
                  </p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                  <h3 className="text-white font-semibold mb-2">Audit Trail</h3>
                  <p className="text-gray-400 text-sm">
                    Immutable logging of all governance decisions, policy enforcement actions, and system events
                  </p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                  <h3 className="text-white font-semibold mb-2">Institutional Oversight</h3>
                  <p className="text-gray-400 text-sm">
                    Licensed deployments operate under buyer governance with Ubuntu protocol enforcement
                  </p>
                </div>
              </div>
            </div>

            {/* Limitations */}
            <div className="glass-card p-8 rounded-xl bg-amber-500/5 border-amber-500/20">
              <h2 className="text-2xl font-bold text-white mb-4">Contact for Reference Architecture</h2>
              <p className="text-gray-300 mb-4">
                Ubuntu is beginning commercial deployment. While we don't yet have deployed customer references,
                we can provide:
              </p>
              <ul className="space-y-2 text-gray-300 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Technical specifications and architecture documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Governance framework details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Reference deployment models</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Energy partnership facilitation pathways</span>
                </li>
              </ul>
              <p className="text-gray-400 text-sm italic">
                One successful licensing enables immediate project deployment. Contact us to be the first.
              </p>
            </div>

            {/* Contact */}
            <div className="mt-12 text-center">
              <p className="text-gray-400 mb-4">
                For licensing inquiries, partnership discussions, or technical specifications:
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-all"
              >
                Contact for Licensing
              </a>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
