'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, ExternalLink, AlertTriangle, TrendingUp, Shield } from 'lucide-react';

export default function ApprovalQueuePage() {
  const [queue, setQueue] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  async function fetchQueue() {
    const { data } = await supabase
      .from('approval_queue')
      .select(`
        *,
        policy_updates!approval_queue_item_id_fkey (*)
      `)
      .eq('status', 'pending')
      .order('priority', { ascending: true })
      .order('created_at', { ascending: true });

    setQueue(data || []);
    setLoading(false);
  }

  async function handleApprove(item: any) {
    const confirmed = confirm('Approve this policy update for public display?');
    if (!confirmed) return;

    try {
      const response = await fetch('/api/approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          approvalQueueId: item.id,
          policyUpdateId: item.item_id,
          userId: 'founder'
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Policy update approved!');
        fetchQueue();
        setSelectedItem(null);
      } else {
        alert('Approval failed: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error);
    }
  }

  async function handleReject(item: any) {
    const reason = prompt('Rejection reason:');
    if (!reason) return;

    try {
      const response = await fetch('/api/approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          approvalQueueId: item.id,
          policyUpdateId: item.item_id,
          userId: 'founder',
          reason
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Policy update rejected');
        fetchQueue();
        setSelectedItem(null);
      } else {
        alert('Rejection failed: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))] mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading approval queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Approval Queue</h1>
        <p className="text-gray-400">{queue.length} items awaiting review</p>
      </div>

      {queue.length === 0 ? (
        <div className="glass-panel p-12 rounded-xl text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">All Clear!</h3>
          <p className="text-gray-400">No policy updates pending approval</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Queue List */}
          <div className="lg:col-span-1 space-y-4">
            {queue.map((item: any) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedItem?.id === item.id
                    ? 'bg-[hsl(var(--primary))]/20 border-2 border-[hsl(var(--primary))]'
                    : 'glass-panel hover:bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                    item.priority === 'high' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {item.priority}
                  </span>
                  {item.policy_updates?.risk_flag && (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  )}
                </div>
                <p className="text-white font-medium text-sm line-clamp-2">
                  {item.policy_updates?.headline}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {selectedItem ? (
              <DetailPanel
                item={selectedItem}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ) : (
              <div className="glass-panel p-12 rounded-xl text-center text-gray-400">
                <p>Select an item to review</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailPanel({ item, onApprove, onReject }: any) {
  const policy = item.policy_updates;

  return (
    <div className="glass-panel p-6 rounded-xl space-y-6">
      {/* Priority & Source */}
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          item.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
          item.priority === 'high' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-blue-500/20 text-blue-400'
        }`}>
          {item.priority.toUpperCase()}
        </span>
        <a
          href={policy.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 flex items-center gap-2 text-sm"
        >
          View Source <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Headline */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">{policy.headline}</h2>
        <p className="text-gray-400 text-sm">{policy.source_name} • {policy.jurisdiction}</p>
      </div>

      {/* Summary */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Summary</h3>
        <p className="text-white leading-relaxed">{policy.summary}</p>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-sm mb-2">Relevance Score</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-[hsl(var(--primary))]"
                style={{ width: `${policy.relevance_score * 100}%` }}
              />
            </div>
            <span className="text-white font-mono text-sm font-medium">
              {(policy.relevance_score * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-2">Confidence Score</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-[hsl(var(--accent))]"
                style={{ width: `${policy.confidence_score * 100}%` }}
              />
            </div>
            <span className="text-white font-mono text-sm font-medium">
              {(policy.confidence_score * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Risk Flag */}
      {policy.risk_flag && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-400 mb-1">Risk Flag</p>
              <p className="text-sm text-gray-300">{policy.risk_notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Category & Jurisdiction */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-black/30 rounded-lg">
        <div>
          <p className="text-gray-400 text-xs">Category</p>
          <p className="text-white text-sm mt-1 capitalize">
            {policy.policy_category.replace('_', ' ')}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Publication Date</p>
          <p className="text-white text-sm mt-1">
            {new Date(policy.publication_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-white/10">
        <button
          onClick={() => onApprove(item)}
          className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all font-medium"
        >
          <CheckCircle className="h-5 w-5" />
          Approve & Publish
        </button>
        <button
          onClick={() => onReject(item)}
          className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all font-medium"
        >
          <XCircle className="h-5 w-5" />
          Reject
        </button>
      </div>
    </div>
  );
}
