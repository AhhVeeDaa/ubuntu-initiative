'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getStatusColor, getCategoryLabel } from '@/lib/utils';
import { CheckCircle2, Circle, AlertCircle, Clock } from 'lucide-react';

type Milestone = {
  id: string;
  title: string;
  description: string | null;
  phase: string;
  category: string;
  status: string;
  progress: number;
  owner: string | null;
  deadline: string | null;
};

export function ProgressTracker() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'legal', 'feasibility', 'partnerships', 'funding', 'operational'];

  useEffect(() => {
    fetchMilestones();
  }, []);

  async function fetchMilestones() {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('phase', 'phase_0')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMilestones(data || []);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredMilestones = selectedCategory === 'all' 
    ? milestones 
    : milestones.filter(m => m.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-xl p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))] mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading milestones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="glass-panel rounded-xl p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {cat === 'all' ? 'All' : getCategoryLabel(cat).split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {filteredMilestones.length === 0 ? (
          <div className="glass-panel rounded-xl p-12 text-center">
            <p className="text-gray-400">No milestones found in this category</p>
          </div>
        ) : (
          filteredMilestones.map(milestone => (
            <div key={milestone.id} className="glass-panel rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {getStatusIcon(milestone.status)}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {milestone.title}
                    </h3>
                    {milestone.description && (
                      <p className="text-gray-400 text-sm mb-3">
                        {milestone.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="px-2 py-1 rounded bg-white/5 text-gray-400">
                        {getCategoryLabel(milestone.category)}
                      </span>
                      {milestone.owner && (
                        <span className="px-2 py-1 rounded bg-white/5 text-gray-400">
                          👤 {milestone.owner}
                        </span>
                      )}
                      {milestone.deadline && (
                        <span className="px-2 py-1 rounded bg-white/5 text-gray-400">
                          📅 {new Date(milestone.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-white mb-1">
                    {milestone.progress}%
                  </div>
                  <div className={`text-xs font-medium ${getStatusColor(milestone.status)}`}>
                    {milestone.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] transition-all duration-500"
                  style={{ width: `${milestone.progress}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
