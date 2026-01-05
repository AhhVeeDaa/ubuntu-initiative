'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Activity, Users, FileText, TrendingUp } from 'lucide-react';
import { getDaysSinceLaunch, calculatePhase0Progress } from '@/lib/utils';
import { EnergyFlow, MilestoneTracker } from '@/components/visualization';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    daysRunning: 0,
    phase0Progress: 0,
    totalMilestones: 0,
    completedMilestones: 0,
    activePartners: 0,
    documentsCreated: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  type Milestone = {
    id: string;
    title: string;
    status: 'completed' | 'in_progress' | 'pending';
    phase: string;
  };

  async function fetchDashboardStats() {
    try {
      // Get milestones
      const { data, error: mError } = await supabase
        .from('milestones')
        .select('*')
        .eq('phase', 'phase_0');

      if (mError) throw mError;

      // Get partners
      const { data: partners } = await supabase
        .from('partners')
        .select('count');

      // Get documents
      const { data: documents } = await supabase
        .from('documents')
        .select('count');

      const phase0Milestones = (data || []) as Milestone[];
      const completed = phase0Milestones.filter(m => m.status === 'completed').length;

      setStats({
        daysRunning: getDaysSinceLaunch(),
        phase0Progress: calculatePhase0Progress(phase0Milestones),
        totalMilestones: phase0Milestones.length,
        completedMilestones: completed,
        activePartners: (partners as any)?.[0]?.count || 0,
        documentsCreated: (documents as any)?.[0]?.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      name: 'Days in Phase 0',
      value: stats.daysRunning,
      icon: Activity,
      color: 'text-[hsl(var(--primary))]',
      description: 'Since January 1, 2026'
    },
    {
      name: 'Phase 0 Progress',
      value: `${stats.phase0Progress}%`,
      icon: TrendingUp,
      color: 'text-[hsl(var(--accent))]',
      description: `${stats.completedMilestones}/${stats.totalMilestones} milestones completed`
    },
    {
      name: 'Partners Engaged',
      value: stats.activePartners,
      icon: Users,
      color: 'text-green-500',
      description: 'In partnership pipeline'
    },
    {
      name: 'Documents Created',
      value: stats.documentsCreated,
      icon: FileText,
      color: 'text-purple-500',
      description: 'MOUs, decks, studies'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))] mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Mission Control: Africa's Sovereign AI</h1>
        <p className="text-gray-400">Real-time infrastructure catalyst operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <div key={item.name} className="glass-panel p-6 rounded-xl overflow-hidden relative">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className={`h-8 w-8 ${item.color}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">{item.name}</dt>
                  <dd>
                    <div className="text-2xl font-medium text-white">{item.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Energy Flow Visualization - NEW */}
      <EnergyFlow />

      {/* Milestone Tracker - NEW */}
      <MilestoneTracker />

      {/* Quick Stats */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Phase 0 Milestones Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Completed</span>
            <span className="text-green-500 font-medium">{stats.completedMilestones}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">In Progress</span>
            <span className="text-blue-500 font-medium">
              {stats.totalMilestones - stats.completedMilestones}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total</span>
            <span className="text-white font-medium">{stats.totalMilestones}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
