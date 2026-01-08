/**
 * UbuntuHub Transparency Page
 * Public accountability layer - data-first, institutional tone
 */

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/server';
import { Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { Database } from '@/lib/supabase/types';

type MilestoneEvent = Database['public']['Tables']['milestone_events']['Row'];
type AuditLog = Database['public']['Tables']['agent_audit_log']['Row'];

export const metadata = {
  title: 'Transparency | UbuntuHub',
  description: 'Real-time operational transparency and accountability data for the Ubuntu Initiative.',
};

export default async function TransparencyPage() {
  const supabase = await createClient();

  // Fetch aggregated metrics (public data only)
  const { data: milestoneData } = await supabase
    .from('milestone_events')
    .select('*')
    .order('created_at', { ascending: false });

  const milestones = (milestoneData || []) as MilestoneEvent[];

  const { data: auditLogData } = await supabase
    .from('agent_audit_log')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(50);

  const auditLogs = (auditLogData || []) as AuditLog[];

  // Calculate metrics
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = milestones.length;
  const progressPercentage = totalMilestones > 0
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;

  const agentActionsThisMonth = auditLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const now = new Date();
    return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
  }).length;

  const approvalRate = auditLogs.length > 0 ?
    Math.round((auditLogs.filter(l => l.human_review_status === 'approved').length / auditLogs.length) * 100) :
    0;

  const lastUpdate = auditLogs?.[0]?.timestamp
    ? new Date(auditLogs[0].timestamp).toISOString()
    : new Date().toISOString();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="grid md:grid-cols-3 gap-12 items-center mb-16">
            <div className="md:col-span-2">
              <h1 className="text-5xl font-bold text-white mb-6">Transparency Dashboard</h1>
              <p className="text-gray-300 text-xl leading-relaxed font-medium">
                Real-time operational data for the Ubuntu Initiative. All metrics are automatically
                aggregated from institutional monitoring agents and human oversight processes to
                ensure institutional accountability.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm text-gray-400 bg-white/5 border border-white/10 w-fit px-4 py-2 rounded-full">
                <Clock className="h-4 w-4 text-[hsl(var(--primary))]" />
                <span>Last Updated: {new Date(lastUpdate).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'UTC'
                })} UTC</span>
              </div>
            </div>
            <div className="relative group">
              <div className="relative z-10 glass-card p-4 rounded-2xl border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src="/transparency_governance_symbolic.png"
                  alt="Transparency & Governance"
                  width={400}
                  height={400}
                  className="rounded-xl opacity-90"
                />
              </div>
              <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full z-0" />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Phase 0 Progress */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400">Phase 0 Progress</h3>
                <CheckCircle className="h-5 w-5 text-[hsl(var(--primary))]" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{progressPercentage}%</div>
              <p className="text-sm text-gray-500">
                {completedMilestones} of {totalMilestones} milestones
              </p>
            </div>

            {/* Agent Actions */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400">Agent Actions</h3>
                <Activity className="h-5 w-5 text-[hsl(var(--accent))]" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{agentActionsThisMonth}</div>
              <p className="text-sm text-gray-500">This month</p>
            </div>

            {/* Approval Rate */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400">Approval Rate</h3>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{approvalRate}%</div>
              <p className="text-sm text-gray-500">Human oversight</p>
            </div>

            {/* System Status */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400">System Status</h3>
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">Operational</div>
              <p className="text-sm text-gray-500">All systems active</p>
            </div>
          </div>

          {/* Milestone Timeline */}
          <div className="glass-card p-8 rounded-xl mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Milestone Timeline</h2>
            <div className="space-y-4">
              {milestones.length > 0 ? (
                milestones.slice(0, 10).map((milestone, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-white/10 last:border-0">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${milestone.status === 'completed'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-gray-500/20 text-gray-500'
                      }`}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-white font-medium">{milestone.title || 'Milestone'}</h3>
                      <p className="text-gray-400 text-sm mt-1">{milestone.description}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        {new Date(milestone.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${milestone.status === 'completed'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-gray-500/20 text-gray-500'
                      }`}>
                      {milestone.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No milestone data available yet.</p>
              )}
            </div>
          </div>

          {/* Institutional Statement */}
          <div className="glass-card p-8 rounded-xl border-l-4 border-[hsl(var(--primary))]">
            <h2 className="text-xl font-bold text-white mb-4">Data Methodology</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-4">
                All data presented on this page is automatically aggregated from operational systems
                and subject to human oversight by the Ubuntu Initiative governance team.
              </p>
              <ul className="text-gray-400 space-y-2 list-disc list-inside">
                <li>Milestone data: Sourced from institutional project tracking systems</li>
                <li>Agent activity: Aggregated from audit logs (individual actions not disclosed)</li>
                <li>Approval metrics: Calculated from human review processes</li>
                <li>System status: Real-time monitoring of platform infrastructure</li>
              </ul>
              <p className="text-gray-400 mt-4 text-sm">
                This transparency layer does not disclose sensitive operational details, partner negotiations,
                or financial transaction specifics. Full audit reports are available to governance stakeholders
                upon request.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
