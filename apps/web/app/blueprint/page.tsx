import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  SystemArchitecture,
  TechnicalSpecifications,
  SovereignStack,
  PPARoadmap
} from '@/components/blueprint';
import { ArrowLeft, FileText } from 'lucide-react';

import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Blueprint | Ubuntu Initiative',
  description: 'Technical architecture and roadmap for Africa\'s sovereign AI supercomputer. From energy infrastructure to compute deployment.',
  keywords: 'Ubuntu Blueprint, Technical Architecture, AI Infrastructure, Inga Dam, Power Purchase Agreement, Sovereign AI'
};

export default function BlueprintPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-infrastructure.jpg"
              alt="Blueprint Architecture Background"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-[hsl(var(--background))]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[hsl(var(--primary))]/30 text-[hsl(var(--primary))] text-sm font-medium mb-6">
                <FileText className="h-4 w-4" />
                Technical Blueprint
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
                The <span className="text-gradient">Architecture</span><br />
                of Sovereignty
              </h1>

              <p className="max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed">
                From hydropower infrastructure to sovereign AI: A complete technical overview
                of how we're building Africa's digital independence from the ground up.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
          {/* Section 1: Energy-to-Compute Flow */}
          <SystemArchitecture />

          {/* Section 2: Technical Specifications */}
          <TechnicalSpecifications />

          {/* Section 3: Sovereign Stack */}
          <SovereignStack />

          {/* Section 4: PPA Roadmap */}
          <PPARoadmap />

          {/* Call-to-Action Section */}
          <div className="glass-panel rounded-xl p-8 text-center border-2 border-[hsl(var(--primary))]/40">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Learn More?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Explore our real-time dashboard for Phase 0 progress updates, or return home
              to see how you can support Africa's sovereign AI future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://ubuntu-initiative-dashboard.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-md text-[hsl(var(--primary-foreground))] bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 transition-all hover:scale-105"
              >
                View Mission Control
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-3 border border-white/20 text-base font-medium rounded-md text-white glass hover:bg-white/10 transition-all"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
