'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatRelativeTime } from '@/lib/utils';

type Activity = {
  id: string;
  type: string;
  action: string;
  title: string;
  description: string | null;
  actor: string;
  created_at: string;
};

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
    
    // Subscribe to new activities
    const channel = supabase
      .channel('public:activities')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'activities', filter: 'public=eq.true' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setActivities(prev => [payload.new as Activity, ...prev].slice(0, 20));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchActivities() {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('public', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  }

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      'milestone': '🎯',
      'partnership': '🤝',
      'document': '📄',
      'communication': '📧',
      'research': '🔍',
      'funding': '💰'
    };
    return icons[type] || '📌';
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-white/5 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-6 sticky top-8">
      <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No activity yet. Check back soon!
          </p>
        ) : (
          activities.map(activity => (
            <div key={activity.id} className="border-l-2 border-[hsl(var(--primary))]/30 pl-4 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                    <span className="text-sm font-medium text-white">
                      {activity.title}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-xs text-gray-400 mb-2">
                      {activity.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{activity.actor}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(activity.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
