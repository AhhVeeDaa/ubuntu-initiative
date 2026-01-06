'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ExternalLink, Shield, TrendingUp, Calendar } from 'lucide-react';
import Image from 'next/image';

export default function PolicyPage() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedUpdates();
  }, []);

  async function fetchApprovedUpdates() {
    const { data } = await supabase
      .from('policy_updates')
      .select('*')
      .eq('status', 'approved')
      .order('publication_date', { ascending: false })
      .limit(50);

    setUpdates(data || []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">

        {/* Header Hero */}
        <section className="relative py-20 overflow-hidden mb-12 -mt-24 pt-48">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-infrastructure.jpg"
              alt="Policy Intelligence Background"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-[hsl(var(--background))]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Policy Intelligence
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg drop-shadow-md">
              Verified policy and regulatory updates affecting African energy infrastructure and AI development.
              All entries reviewed by human experts before publication.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust Badge */}

          {/* Trust Badge */}
          <div className="glass p-5 rounded-xl mb-8 flex items-start gap-4">
            <Shield className="h-6 w-6 text-[hsl(var(--primary))] flex-shrink-0 mt-1" />
            <div>
              <p className="text-white font-medium mb-1">Transparency Note</p>
              <p className="text-sm text-gray-300">
                All policy updates are analyzed by AI, verified by humans, and include confidence scores.
                Sources are always linked. We track policies relevant to the Inga hydropower project and
                African AI infrastructure development.
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))] mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading policy updates...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && updates.length === 0 && (
            <div className="glass p-12 rounded-xl text-center">
              <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Policy Updates Yet</h3>
              <p className="text-gray-400">
                Our policy monitoring agent is actively tracking developments.
                Approved updates will appear here.
              </p>
            </div>
          )}

          {/* Updates List */}
          {!loading && updates.length > 0 && (
            <div className="space-y-6">
              {updates.map((update: any) => (
                <PolicyUpdateCard key={update.id} update={update} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PolicyUpdateCard({ update }: { update: any }) {
  return (
    <div className="glass p-6 rounded-xl space-y-4 hover:bg-white/5 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 leading-tight">
            {update.headline}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(update.publication_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span>•</span>
            <span>{update.jurisdiction}</span>
            <span>•</span>
            <span className="capitalize">{update.policy_category.replace('_', ' ')}</span>
          </div>
        </div>

        {update.risk_flag && (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium whitespace-nowrap">
            Risk Flag
          </span>
        )}
      </div>

      {/* Summary */}
      <p className="text-gray-300 leading-relaxed">{update.summary}</p>

      {/* Metadata Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-6">
          {/* Relevance */}
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-400">
              Relevance:{' '}
              <span className="text-white font-mono font-medium">
                {(update.relevance_score * 100).toFixed(0)}%
              </span>
            </span>
          </div>

          {/* Confidence */}
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-400">
              Confidence:{' '}
              <span className="text-white font-mono font-medium">
                {(update.confidence_score * 100).toFixed(0)}%
              </span>
            </span>
          </div>
        </div>

        {/* Source Link */}
        <a
          href={update.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 transition-colors text-sm font-medium"
        >
          <span>View Source</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Provenance Details */}
      <details className="pt-3 border-t border-white/10">
        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
          Verification Details
        </summary>
        <div className="mt-3 space-y-2 text-sm text-gray-400 pl-4 border-l-2 border-white/10">
          <p><span className="text-gray-500">Source:</span> {update.source_name}</p>
          <p><span className="text-gray-500">Detected:</span> {new Date(update.detection_date).toLocaleString()}</p>
          <p><span className="text-gray-500">Approved:</span> {new Date(update.approved_at).toLocaleString()}</p>
          <p><span className="text-gray-500">Agent:</span> Policy Monitor v1.0</p>
        </div>
      </details>
    </div>
  );
}
