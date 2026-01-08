/**
 * About UbuntuHub
 * Platform context, boundaries, and governance structure
 */

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Database, Shield, Eye, Users } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'About UbuntuHub | Operational Platform',
  description: 'UbuntuHub is the operational transparency platform of the Ubuntu Initiative, providing coordination infrastructure and institutional monitoring.',
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
                What is Ubuntu<span className="text-[hsl(var(--primary))]">Hub</span>?
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl leading-relaxed">
                The operational transparency platform of the Ubuntu Initiative—providing
                real-time monitoring, policy tracking, and institutional coordination.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Platform Definition */}
            <div className="glass-card p-8 rounded-xl mb-12 border-l-4 border-[hsl(var(--primary))]">
              <h2 className="text-2xl font-bold text-white mb-4">Institutional Definition</h2>
              <p className="text-gray-300 leading-relaxed">
                UbuntuHub serves as the operational platform and coordination infrastructure supporting
                the Ubuntu Initiative's mandate to develop sovereign artificial intelligence capacity in Africa.
                It functions as a transparency layer, providing stakeholders—including governments, partners,
                and oversight bodies—with real-time access to policy monitoring, operational metrics, funding
                allocation tracking, and institutional decision-making processes.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                UbuntuHub does not set policy or make institutional decisions; it surfaces data, monitors
                compliance, and provides coordination tools that enable informed governance. All agent-assisted
                functions operate under human oversight and are designed to augment—not replace—institutional
                accountability.
              </p>
            </div>

            {/* What We Are / Are Not */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">

              {/* What We Are */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Database className="h-6 w-6 text-[hsl(var(--primary))]" />
                  What UbuntuHub IS
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--primary))] mt-1">✓</span>
                    <span>An operational transparency platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--primary))] mt-1">✓</span>
                    <span>A coordination infrastructure layer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--primary))] mt-1">✓</span>
                    <span>A monitoring and reporting system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--primary))] mt-1">✓</span>
                    <span>A data aggregation tool</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--primary))] mt-1">✓</span>
                    <span>An interface for institutional accountability</span>
                  </li>
                </ul>
              </div>

              {/* What We Are Not */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-red-500" />
                  What UbuntuHub IS NOT
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Not the institution (that is Ubuntu Initiative)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Not a decision-making authority</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Not autonomous governance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Not a community platform or social hub</span>
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
                Relationship to Ubuntu Initiative
              </h2>
              <div className="bg-black/40 p-6 rounded-lg border border-white/10 mb-4">
                <p className="text-gray-300 text-lg font-medium text-center">
                  UbuntuHub is to Ubuntu Initiative as <span className="text-[hsl(var(--primary))]">EDGAR is to the SEC</span>
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">Ubuntu Initiative</h3>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• The institution</li>
                    <li>• Vision and mandate</li>
                    <li>• Governance authority</li>
                    <li>• Policy decisions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">UbuntuHub</h3>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• The operational platform</li>
                    <li>• Transparency infrastructure</li>
                    <li>• Coordination layer</li>
                    <li>• Monitoring systems</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Governance Structure */}
            <div className="glass-card p-8 rounded-xl mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-[hsl(var(--primary))]" />
                Governance & Oversight
              </h2>
              <p className="text-gray-300 mb-6">
                All platform operations are subject to Ubuntu Initiative governance framework and human oversight:
              </p>
              <div className="space-y-4">
                <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                  <h3 className="text-white font-semibold mb-2">Data Collection</h3>
                  <p className="text-gray-400 text-sm">
                    Automated from public sources only. No proprietary data aggregation without authorization.
                  </p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                  <h3 className="text-white font-semibold mb-2">Analysis & Reporting</h3>
                  <p className="text-gray-400 text-sm">
                    Automated processing with human review required before publication of findings.
                  </p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                  <h3 className="text-white font-semibold mb-2">High-Stakes Actions</h3>
                  <p className="text-gray-400 text-sm">
                    Policy decisions, fund allocation, and institutional commitments require explicit human authorization.
                  </p>
                </div>
              </div>
            </div>

            {/* Limitations */}
            <div className="glass-card p-8 rounded-xl bg-amber-500/5 border-amber-500/20">
              <h2 className="text-2xl font-bold text-white mb-4">Platform Limitations</h2>
              <p className="text-gray-300 mb-4">
                UbuntuHub operates within defined boundaries to ensure institutional accountability:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Cannot make policy recommendations without human review</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Cannot allocate funds or make financial commitments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Cannot engage partners without institutional authorization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>All agent actions beyond data aggregation require approval</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="mt-12 text-center">
              <p className="text-gray-400 mb-4">
                For institutional inquiries, partnership discussions, or governance questions:
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-all"
              >
                Contact Ubuntu Initiative
              </a>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
