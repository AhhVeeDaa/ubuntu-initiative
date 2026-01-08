/**
 * Approval Queue Badge
 * Shows pending approval count with link to approvals page
 * Add this to the main agents dashboard
 */

'use client';

import { useEffect, useState } from 'react';
import { Bell, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export function ApprovalQueueBadge() {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchPendingCount() {
    try {
      const res = await fetch('/api/agents/approvals?status=pending');
      const data = await res.json();
      
      if (data.success) {
        setPendingCount(data.count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch pending approvals:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return null;
  }

  return (
    <Link
      href="/agents/approvals"
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
        pendingCount > 0
          ? 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20 text-orange-400'
          : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-400'
      }`}
    >
      {pendingCount > 0 ? (
        <AlertCircle className="h-5 w-5 animate-pulse" />
      ) : (
        <Bell className="h-5 w-5" />
      )}
      
      <span className="font-semibold">
        {pendingCount > 0 ? `${pendingCount} Pending Approval${pendingCount > 1 ? 's' : ''}` : 'Approvals'}
      </span>

      {pendingCount > 0 && (
        <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
          {pendingCount}
        </span>
      )}
    </Link>
  );
}
