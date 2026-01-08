import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Check authentication and admin role
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verify admin role
  const { data: adminRole } = await supabase
    .from('admin_roles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (!adminRole) {
    redirect('/login');
  }

  // Check expiration
  if (adminRole.expires_at && new Date(adminRole.expires_at) <= new Date()) {
    redirect('/login');
  }

  // Fetch agent activity
  const { data: auditLogs } = await supabase
    .from('agent_audit_log')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(20);

  // Fetch approval queue
  const { data: approvalQueue } = await supabase
    .from('approval_queue')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  // Fetch milestone stats
  const { data: milestones } = await supabase
    .from('milestone_events')
    .select('category, status');

  const stats = {
    total: milestones?.length || 0,
    verified: milestones?.filter((m: any) => m.status === 'verified').length || 0,
    pending: approvalQueue?.length || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Agent Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="text-gray-400 text-sm mb-2">Total Milestones</div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="text-gray-400 text-sm mb-2">Verified</div>
            <div className="text-3xl font-bold text-green-400">{stats.verified}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="text-gray-400 text-sm mb-2">Pending Review</div>
            <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
          </div>
        </div>

        {/* Active Agents Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { name: 'Policy Agent', status: 'active', icon: '⚖️', lastRun: '2 mins ago' },
            { name: 'Progress Agent', status: 'active', icon: '🏗️', lastRun: '1 hour ago' },
            { name: 'Funding Agent', status: 'active', icon: '💰', lastRun: '5 mins ago' },
          ].map((agent) => (
            <div key={agent.name} className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{agent.icon}</div>
                <div>
                  <div className="font-bold text-white">{agent.name}</div>
                  <div className="text-xs text-gray-400">Last run: {agent.lastRun}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm text-green-400 uppercase tracking-wider font-bold">Online</span>
              </div>
            </div>
          ))}
        </div>

        {/* Approval Queue */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-2xl font-bold mb-4">Approval Queue</h2>
          {approvalQueue && approvalQueue.length > 0 ? (
            <div className="space-y-4">
              {approvalQueue?.map((item: any) => (
                <div key={item.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm text-gray-400">{item.item_type}</span>
                      <div className="font-medium mt-1">Item ID: {item.item_id}</div>
                      {item.agent_recommendation && (
                        <div className="text-sm text-gray-400 mt-2">
                          {JSON.stringify(item.agent_recommendation).substring(0, 100)}...
                        </div>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${item.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                        item.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-blue-500/20 text-blue-400'
                      }`}>
                      {item.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-8">No items pending review</div>
          )}
        </div>

        {/* Recent Agent Activity */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Recent Agent Activity</h2>
          {auditLogs && auditLogs.length > 0 ? (
            <div className="space-y-3">
              {auditLogs?.map((log: any) => (
                <div key={log.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm font-mono text-[hsl(var(--primary))]">{log.agent_id}</span>
                      <div className="text-sm mt-1">{log.action_type}</div>
                      {log.reasoning && (
                        <div className="text-xs text-gray-400 mt-2">{log.reasoning}</div>
                      )}
                    </div>
                    <div className="text-right">
                      {log.confidence_score && (
                        <div className="text-sm font-medium mb-1">
                          {(log.confidence_score * 100).toFixed(0)}% confidence
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-8">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  );
}
