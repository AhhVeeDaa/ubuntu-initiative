/**
 * Agent Status Dashboard Component
 * Shows real-time health, circuit breaker states, and quick actions
 */

'use client';

import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface AgentHealth {
  agentId: string;
  name: string;
  health: {
    status: 'healthy' | 'degraded' | 'critical' | 'unknown';
    totalRuns: number;
    successRate: number;
    lastRunAt: string | null;
  };
  circuitBreaker: {
    state: 'closed' | 'open' | 'half-open';
    failures: number;
  };
}

export function AgentStatusDashboard() {
  const [agents, setAgents] = useState<AgentHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  async function fetchHealth() {
    try {
      const res = await fetch('/api/agents/health');
      const data = await res.json();
      setAgents(data.agents || []);
    } catch (error) {
      console.error('Failed to fetch health:', error);
    } finally {
      setLoading(false);
    }
  }

  async function resetCircuitBreaker(agentId: string) {
    setResetting(agentId);
    try {
      const res = await fetch('/api/agents/admin/circuit-breaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, action: 'reset' })
      });

      const data = await res.json();
      if (data.success) {
        await fetchHealth(); // Refresh
      } else {
        alert('Failed to reset: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error);
    } finally {
      setResetting(null);
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCircuitColor = (state: string) => {
    switch (state) {
      case 'closed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'half-open': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'open': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {agents.map(agent => (
        <div
          key={agent.agentId}
          className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getHealthIcon(agent.health.status)}
              <div>
                <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                <p className="text-xs text-gray-400 font-mono">{agent.agentId}</p>
              </div>
            </div>

            {/* Circuit Breaker Badge */}
            <div className={`px-3 py-1 rounded-full border text-xs font-semibold uppercase ${getCircuitColor(agent.circuitBreaker.state)}`}>
              {agent.circuitBreaker.state}
            </div>
          </div>

          {/* Health Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">Total Runs</div>
              <div className="text-xl font-bold text-white">{agent.health.totalRuns}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Success Rate</div>
              <div className="text-xl font-bold text-white">{agent.health.successRate}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Circuit Failures</div>
              <div className="text-xl font-bold text-white">{agent.circuitBreaker.failures}</div>
            </div>
          </div>

          {/* Last Run */}
          <div className="text-xs text-gray-400 mb-4">
            Last run: {agent.health.lastRunAt 
              ? new Date(agent.health.lastRunAt).toLocaleString()
              : 'Never'
            }
          </div>

          {/* Circuit Breaker Actions */}
          {agent.circuitBreaker.state === 'open' && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-yellow-500">
                  ⚠️ Circuit breaker open - agent blocked due to failures
                </div>
                <button
                  onClick={() => resetCircuitBreaker(agent.agentId)}
                  disabled={resetting === agent.agentId}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  {resetting === agent.agentId ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Reset Circuit Breaker
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
