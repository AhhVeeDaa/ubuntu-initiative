/**
 * Approval Queue Page
 * Dashboard interface for reviewing and approving agent actions
 * Keeps manual triggers available - this is an additional interface
 */

'use client';

import { useEffect, useState } from 'react';
import { 
  CheckCircle, XCircle, Clock, AlertTriangle, 
  RefreshCw, Filter, ChevronDown, ChevronUp,
  Shield, Zap, Activity
} from 'lucide-react';

interface Approval {
  id: string;
  agent_id: string;
  item_type: string;
  item_id: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  metadata: any;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  reviewer_notes?: string;
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchApprovals();
    
    // Auto-refresh every 30 seconds for pending items
    const interval = setInterval(() => {
      if (filter === 'pending') {
        fetchApprovals(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [filter]);

  async function fetchApprovals(silent = false) {
    if (!silent) setLoading(true);
    setRefreshing(true);

    try {
      const res = await fetch(`/api/agents/approvals?status=${filter}`);
      const data = await res.json();
      
      if (data.success) {
        setApprovals(data.approvals);
        setCounts(data.statusCounts);
      }
    } catch (error) {
      console.error('Failed to fetch approvals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleAction(approvalId: string, action: 'approve' | 'reject', notes: string) {
    try {
      const res = await fetch('/api/agents/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalId, action, notes })
      });

      const data = await res.json();

      if (data.success) {
        // Remove from list or refresh
        await fetchApprovals();
      } else {
        alert(`Failed to ${action}: ${data.error}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Approval Queue</h1>
            <p className="text-gray-400">
              Review and approve agent actions requiring human oversight
            </p>
          </div>

          <button
            onClick={() => fetchApprovals()}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'pending'
                ? 'bg-[hsl(var(--primary))] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Pending ({counts.pending})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'approved'
                ? 'bg-green-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Approved ({counts.approved})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'rejected'
                ? 'bg-red-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Rejected ({counts.rejected})
          </button>
        </div>

        {/* Approvals List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : approvals.length === 0 ? (
          <div className="text-center py-20">
            <CheckCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-semibold">
              No {filter} approvals
            </p>
            <p className="text-gray-600 text-sm mt-2">
              {filter === 'pending' 
                ? 'All caught up! Agent actions will appear here when they need review.'
                : `No ${filter} items to show.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map(approval => (
              <ApprovalCard
                key={approval.id}
                approval={approval}
                onApprove={(notes) => handleAction(approval.id, 'approve', notes)}
                onReject={(notes) => handleAction(approval.id, 'reject', notes)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// APPROVAL CARD COMPONENT
// ============================================================================

function ApprovalCard({ approval, onApprove, onReject }: any) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  async function handleApprove() {
    setProcessing(true);
    await onApprove(notes);
    setProcessing(false);
  }

  async function handleReject() {
    setProcessing(true);
    await onReject(notes);
    setProcessing(false);
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-500/10 text-red-400';
      case 'high': return 'border-orange-500 bg-orange-500/10 text-orange-400';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
      default: return 'border-blue-500 bg-blue-500/10 text-blue-400';
    }
  };

  const getAgentIcon = (agentId: string) => {
    if (agentId.includes('policy')) return <Shield className="h-5 w-5" />;
    if (agentId.includes('funding')) return <Zap className="h-5 w-5" />;
    if (agentId.includes('milestone')) return <Activity className="h-5 w-5" />;
    return <CheckCircle className="h-5 w-5" />;
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[hsl(var(--primary))]/10 rounded-lg border border-[hsl(var(--primary))]/20">
            {getAgentIcon(approval.agent_id)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {approval.item_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              {approval.agent_id} • {new Date(approval.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${getPriorityColor(approval.priority)}`}>
          {approval.priority}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-300 leading-relaxed">
          {approval.metadata?.reason || 'No description provided'}
        </p>
      </div>

      {/* Recommended Action */}
      {approval.metadata?.recommended_action && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-300">
            <strong className="font-semibold">Recommended:</strong>{' '}
            {approval.metadata.recommended_action}
          </p>
        </div>
      )}

      {/* Expandable Details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 mb-4"
      >
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        {expanded ? 'Hide' : 'Show'} Details
      </button>

      {expanded && (
        <div className="mb-4 p-4 bg-black/50 border border-white/5 rounded-lg">
          <h4 className="text-xs text-gray-500 uppercase font-bold mb-2">Full Metadata</h4>
          <pre className="text-xs text-gray-400 overflow-x-auto">
            {JSON.stringify(approval.metadata, null, 2)}
          </pre>
        </div>
      )}

      {/* Actions */}
      {approval.status === 'pending' ? (
        <div className="space-y-3 pt-4 border-t border-white/10">
          <textarea
            placeholder="Add review notes (optional)..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full p-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--primary))] focus:outline-none"
            rows={2}
          />

          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              disabled={processing}
              className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {processing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Approve
            </button>

            <button
              onClick={handleReject}
              disabled={processing}
              className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {processing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Reject
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-4 border-t border-white/10">
          <div className={`p-3 rounded-lg ${
            approval.status === 'approved' 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            <p className="text-sm">
              <strong className={approval.status === 'approved' ? 'text-green-400' : 'text-red-400'}>
                {approval.status.toUpperCase()}
              </strong>
              {' by '}
              <span className="text-gray-300">{approval.reviewed_by}</span>
              {' on '}
              <span className="text-gray-400">
                {approval.reviewed_at && new Date(approval.reviewed_at).toLocaleString()}
              </span>
            </p>
            {approval.reviewer_notes && (
              <p className="text-sm text-gray-400 mt-2">
                <strong>Notes:</strong> {approval.reviewer_notes}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
