'use client';

import { useEffect, useState } from 'react';
import { 
  Bot, Play, Loader2, CheckCircle2, XCircle, Clock, TrendingUp, 
  Activity, AlertCircle, Zap, Shield, Database, ArrowRight 
} from 'lucide-react';

/**
 * DASHBOARD AGENTS PAGE - REDESIGNED
 * 
 * PURPOSE: Full agent control and monitoring
 * FOCUS: Real-time execution, metrics, admin controls
 * OPERATIONAL CONTROLS: All triggers and management here
 */

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'error';
  lastRun?: Date;
  successRate?: number;
}

interface AgentEvent {
  id: string;
  run_id: string;
  agent_id: string;
  event_type: string;
  message: string;
  severity: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  created_at: string;
  data?: any;
}

interface AgentMetrics {
  totalRuns: number;
  successRate: number;
  avgTime: number;
  itemsProcessed: number;
  recentRuns: any[];
  errors: any[];
}

export default function AgentsDashboard() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'agent_001_policy',
      name: 'Policy Monitor',
      description: 'Monitors policy discussions and regulatory changes',
      status: 'idle',
      successRate: 98
    },
    {
      id: 'agent_002_funding',
      name: 'Funding & Grants',
      description: 'Tracks donations and grant opportunities',
      status: 'idle',
      successRate: 95
    },
    {
      id: 'agent_004_milestones',
      name: 'Milestone Tracker',
      description: 'Validates and publishes project progress',
      status: 'idle',
      successRate: 100
    }
  ]);

  const [realtimeEvents, setRealtimeEvents] = useState<AgentEvent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<AgentMetrics | null>(null);
  const [triggering, setTriggering] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Real-time SSE connection
  useEffect(() => {
    console.log('[AgentsDashboard] Establishing SSE connection...');
    const eventSource = new EventSource('/api/agents/stream');

    eventSource.onopen = () => {
      setConnectionStatus('connected');
      console.log('[AgentsDashboard] SSE connection established');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'connected') {
          console.log('[AgentsDashboard] Stream connected:', data.message);
          return;
        }

        console.log('[AgentsDashboard] Received event:', data.type, data);

        // Add to event feed
        if (data.type === 'agent_event') {
          setRealtimeEvents(prev => [data, ...prev].slice(0, 100));
        }

        // Update agent status
        if (data.type === 'status_change') {
          setAgents(prev => prev.map(agent =>
            agent.id === data.agent_id
              ? { 
                  ...agent, 
                  status: data.status === 'running' ? 'running' : 
                          data.status === 'error' ? 'error' : 'idle',
                  lastRun: data.completed_at ? new Date(data.completed_at) : agent.lastRun
                }
              : agent
          ));

          // Refresh metrics if this agent is selected
          if (selectedAgent === data.agent_id && data.status !== 'running') {
            fetchMetrics(data.agent_id);
          }
        }
      } catch (error) {
        console.error('[AgentsDashboard] Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('[AgentsDashboard] SSE error:', error);
      setConnectionStatus('disconnected');
      eventSource.close();
      
      // Attempt reconnect after 5 seconds
      setTimeout(() => {
        setConnectionStatus('connecting');
      }, 5000);
    };

    return () => {
      console.log('[AgentsDashboard] Closing SSE connection');
      eventSource.close();
    };
  }, [selectedAgent]);

  // Fetch metrics for selected agent
  async function fetchMetrics(agentId: string) {
    try {
      const res = await fetch(`/api/agents/${agentId}/metrics`);
      const data = await res.json();
      setSelectedMetrics(data.metrics);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  }

  // Select agent and load metrics
  function selectAgent(agentId: string) {
    setSelectedAgent(agentId);
    fetchMetrics(agentId);
  }

  // Trigger agent execution
  async function handleTrigger(agentId: string) {
    setTriggering(agentId);
    
    try {
      console.log(`[AgentsDashboard] Triggering agent: ${agentId}`);
      const res = await fetch('/api/agents/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, triggeredBy: 'dashboard' })
      });

      const result = await res.json();
      console.log('[AgentsDashboard] Trigger result:', result);
      
      if (result.success) {
        // Update agent status immediately
        setAgents(prev => prev.map(agent =>
          agent.id === agentId ? { ...agent, status: 'running' } : agent
        ));
      } else {
        console.error('[AgentsDashboard] Failed to trigger agent:', result.error);
        alert(`Failed to trigger agent: ${result.error}`);
      }
    } catch (error) {
      console.error('[AgentsDashboard] Trigger error:', error);
      alert(`Error triggering agent: ${error}`);
    } finally {
      setTriggering(null);
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Connection Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Agent Control Center</h1>
          <p className="mt-2 text-gray-400">
            Monitor and control autonomous agents in real-time
          </p>
        </div>

        {/* Real-Time Connection Status */}
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
            connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
            'bg-red-500'
          }`} />
          <span className="text-xs text-gray-300 uppercase tracking-wider font-semibold">
            {connectionStatus === 'connected' ? 'Connected' : 
             connectionStatus === 'connecting' ? 'Connecting...' : 
             'Disconnected'}
          </span>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={Bot}
          label="Active Agents"
          value={agents.length}
          color="text-blue-500"
        />
        <StatCard
          icon={Zap}
          label="Running"
          value={agents.filter(a => a.status === 'running').length}
          color="text-yellow-500"
        />
        <StatCard
          icon={CheckCircle2}
          label="Idle"
          value={agents.filter(a => a.status === 'idle').length}
          color="text-green-500"
        />
        <StatCard
          icon={Activity}
          label="Events Today"
          value={realtimeEvents.length}
          color="text-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Agent Control Cards (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-[hsl(var(--primary))]" />
            Agents
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {agents.map((agent) => (
              <AgentControlCard
                key={agent.id}
                agent={agent}
                isSelected={selectedAgent === agent.id}
                isTriggering={triggering === agent.id}
                onSelect={() => selectAgent(agent.id)}
                onTrigger={() => handleTrigger(agent.id)}
              />
            ))}
          </div>
        </div>

        {/* Right: Event Feed & Metrics (1 column) */}
        <div className="space-y-4">
          {/* Real-Time Event Feed */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-5 w-5 text-[hsl(var(--primary))]" />
              <h3 className="text-lg font-semibold text-white">Live Activity</h3>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
              {realtimeEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <Clock className="h-8 w-8 opacity-20 mx-auto mb-2" />
                  <p className="text-xs uppercase tracking-wider">Waiting for events...</p>
                </div>
              ) : (
                realtimeEvents.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))
              )}
            </div>
          </div>

          {/* Metrics Panel */}
          {selectedAgent && selectedMetrics && (
            <MetricsPanel 
              agentId={selectedAgent}
              metrics={selectedMetrics}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${color} opacity-50`} />
      </div>
    </div>
  );
}

function AgentControlCard({ agent, isSelected, isTriggering, onSelect, onTrigger }: any) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-400 bg-blue-500/10';
      case 'error': return 'text-red-400 bg-red-500/10';
      default: return 'text-green-400 bg-green-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'error': return <XCircle className="h-5 w-5" />;
      default: return <CheckCircle2 className="h-5 w-5" />;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`bg-white/5 backdrop-blur-xl rounded-xl p-6 border transition-all cursor-pointer hover:bg-white/[0.07] ${
        isSelected 
          ? 'border-[hsl(var(--primary))] shadow-lg shadow-[hsl(var(--primary))]/20' 
          : 'border-white/10'
      }`}
    >
      {/* Agent Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-[hsl(var(--primary))]" />
          <div>
            <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
            <p className="text-xs text-gray-400 font-mono">{agent.id}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(agent.status)}`}>
          {getStatusIcon(agent.status)}
          <span className="text-xs font-semibold uppercase">{agent.status}</span>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4">{agent.description}</p>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Success Rate</div>
          <div className="text-xl font-bold text-white">{agent.successRate}%</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Last Run</div>
          <div className="text-xs font-medium text-white">
            {agent.lastRun 
              ? new Date(agent.lastRun).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Never'
            }
          </div>
        </div>
      </div>

      {/* Trigger Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTrigger();
        }}
        disabled={isTriggering || agent.status === 'running'}
        className="w-full py-3 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        {isTriggering || agent.status === 'running' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Running...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Run Agent
          </>
        )}
      </button>
    </div>
  );
}

function EventItem({ event }: { event: AgentEvent }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500/30 bg-red-500/10 text-red-400';
      case 'error': return 'border-red-500/30 bg-red-500/10 text-red-400';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
      case 'info': return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
      default: return 'border-white/10 bg-white/5 text-gray-400';
    }
  };

  return (
    <div className={`p-3 rounded-lg border ${getSeverityColor(event.severity)} hover:opacity-80 transition-all`}>
      <div className="flex items-start justify-between mb-1">
        <span className="text-xs font-mono">
          {event.agent_id}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(event.created_at).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-sm">{event.message}</p>
      {event.severity === 'error' && (
        <div className="mt-2 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span className="text-xs font-semibold uppercase">Error</span>
        </div>
      )}
    </div>
  );
}

function MetricsPanel({ agentId, metrics }: { agentId: string; metrics: AgentMetrics }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="h-5 w-5 text-[hsl(var(--primary))]" />
        <h3 className="text-lg font-semibold text-white">Performance</h3>
      </div>

      <div className="space-y-3 mb-4">
        <MetricRow label="Total Runs" value={metrics.totalRuns} />
        <MetricRow label="Success Rate" value={`${metrics.successRate}%`} />
        <MetricRow label="Avg Time" value={`${metrics.avgTime}ms`} />
        <MetricRow label="Items Processed" value={metrics.itemsProcessed} />
      </div>

      {metrics.recentRuns && metrics.recentRuns.length > 0 && (
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2">Recent Runs</h4>
          <div className="space-y-2">
            {metrics.recentRuns.slice(0, 5).map((run: any) => (
              <div key={run.id} className="flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  {new Date(run.started_at).toLocaleString([], { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                <span className={`font-semibold px-2 py-1 rounded ${
                  run.status === 'success' ? 'text-green-400 bg-green-500/10' :
                  run.status === 'error' ? 'text-red-400 bg-red-500/10' :
                  'text-yellow-400 bg-yellow-500/10'
                }`}>
                  {run.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {metrics.errors && metrics.errors.length > 0 && (
        <div className="pt-4 border-t border-white/10 mt-4">
          <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <AlertCircle className="h-3 w-3 text-red-500" />
            Recent Errors
          </h4>
          <div className="space-y-2">
            {metrics.errors.slice(0, 3).map((error: any) => (
              <div key={error.id} className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                {error.error_message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-lg font-bold text-white">{value}</span>
    </div>
  );
}
