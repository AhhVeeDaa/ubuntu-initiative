'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface DonationStats {
  daily_total: number;
  donor_count: number;
  milestone_progress: number;
}

export function RealtimeDonationTracker() {
  const [stats, setStats] = useState<DonationStats>({
    daily_total: 0,
    donor_count: 0,
    milestone_progress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchStats = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data } = await supabase
        .from('donation_aggregates')
        .select('*')
        .eq('date', today)
        .single();

      if (data) setStats(data);
      setLoading(false);
    };

    fetchStats();

    const channel = supabase
      .channel('donations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donation_aggregates' }, 
        (payload) => {
          if (payload.new) setStats(payload.new as DonationStats);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) return <div className="animate-pulse bg-white/5 rounded-2xl h-48"></div>;

  const target = 100000;
  const progress = (stats.daily_total / target) * 100;

  return (
    <div className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Phase 0 Funding</h3>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live
        </span>
      </div>

      <div className="h-8 bg-black/40 rounded-full overflow-hidden border border-white/10 mb-4">
        <div 
          className="h-full bg-gradient-to-r from-[hsl(var(--primary))] to-purple-500 transition-all duration-1000"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-white">${stats.daily_total.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Raised</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{stats.donor_count}</div>
          <div className="text-xs text-gray-400">Contributors</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[hsl(var(--primary))]">{progress.toFixed(1)}%</div>
          <div className="text-xs text-gray-400">Progress</div>
        </div>
      </div>
    </div>
  );
}
