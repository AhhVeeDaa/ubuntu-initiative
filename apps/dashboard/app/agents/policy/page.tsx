'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Activity, CheckCircle, XCircle, Clock, AlertTriangle, PlayCircle } from 'lucide-react';

export default function PolicyAgentPage() {
  const [stats, setStats] = useState({
    lastRun: null as any,
    totalUpdates: 0,
    pendingApproval: 0,
    approved: 0,
    rejected: 0,
    avgConfidence: 0
  });
  
  const [recentRuns, setRecentRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchRecentRuns();
  }, []);

  async function fetchStats() {
    try {
      // Get last run
      const { data: lastRun } = await supabase
        .from('agent_runs')
        .select('*')
        .eq('agent_id', 'agent_001_policy_monitor')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Get update counts
      const { data: updates } = await supabase
        .from('policy_updates')
        .select('status, confidence_score');

      if (updates && Array.isArray(updates)) {
        const pending = updates.filter((u: any) => u.status === 'pending').length;
        const approved = updates.filter((u: any) => u.status === 'approved').length;
        const rejected = updates.filter((u: any) => u.status === 'rejected').length;
        const avgConf = updates.length > 0
          ? updates.reduce((sum: number, u: any) => sum + (u.confidence_score || 0), 0) / updates.length
          : 0;

        setStats({
          lastRun,
          totalUpdates: updates.length,
          pendingApproval: pending,
          approved,
          rejected,
          avgConfidence: avgConf
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecentRuns() {
    const { data } = await supabase
      .from('agent_runs')
      .select('*')
      .eq('agent_id', 'agent_001_policy_monitor')
      .order('created_at', { ascending: false })
      .limit(10);

    setRecentRuns(data || []);
  }

  async function triggerManualRun() {
    setTriggering(true);
    try {
      const response = await fetch('/api/agents/policy', {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        alert('Agent run started successfully!');
        setTimeout(() => {
          fetchStats();
          fetchRecentRuns();
        }, 2000);
      } else {
        alert('Failed to start agent: ' + result.error);
      }
    } catch (error) {
      alert('Error triggering agent: ' + error);
    } finally {
      setTriggering(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))] mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading agent data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Policy Monitor Agent</h1>
        <p className="text-gray-400">agent_001_policy_monitor v1.0.0</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Review</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.pendingApproval}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Confidence</p>
              <p className="text-3xl font-bold text-white mt-2">
                {(stats.avgConfidence * 100).toFixed(0)}%
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Last Run */}
      {stats.lastRun && (
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-medium text-white mb-4">Last Run</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Status</p>
              <p className={`font-medium mt-1 ${
                stats.lastRun.status === 'success' ? 'text-green-500' :
                stats.lastRun.status === 'partial' ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {stats.lastRun.status}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Processed</p>
              <p className="text-white font-medium mt-1">{stats.lastRun.items_processed}</p>
            </div>
            <div>
              <p className="text-gray-400">Duration</p>
              <p className="text-white font-medium mt-1">{stats.lastRun.duration_ms}ms</p>
            </div>
            <div>
              <p className="text-gray-400">Trigger</p>
              <p className="text-white font-medium mt-1 capitalize">{stats.lastRun.trigger_type}</p>
            </div>
            <div>
              <p className="text-gray-400">Time</p>
              <p className="text-white font-medium mt-1">
                {new Date(stats.lastRun.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Manual Trigger */}
      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-lg font-medium text-white mb-4">Manual Execution</h3>
        <button
          onClick={triggerManualRun}
          disabled={triggering}
          className="flex items-center gap-2 px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlayCircle className="h-5 w-5" />
          {triggering ? 'Running...' : 'Run Agent Now'}
        </button>
        <p className="text-gray-400 text-sm mt-2">
          Triggers immediate policy scan. Agent will run and queue updates for approval.
        </p>
      </div>

      {/* Recent Runs */}
      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-lg font-medium text-white mb-4">Recent Runs</h3>
        <div className="space-y-3">
          {recentRuns.map((run: any) => (
            <div key={run.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  run.status === 'success' ? 'bg-green-500' :
                  run.status === 'partial' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                <div>
                  <p className="text-white text-sm font-medium">
                    {new Date(run.created_at).toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {run.trigger_type} • {run.items_processed} processed
                  </p>
                </div>
              </div>
              <span className={`text-sm font-medium ${
                run.status === 'success' ? 'text-green-500' :
                run.status === 'partial' ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {run.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
