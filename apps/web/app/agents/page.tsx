'use client';

import { useEffect, useState } from 'react';

interface Agent {
  id: string;
  name: string;
  status: string;
}

interface AgentStatus {
  status: string;
  agents: Agent[];
  count: number;
  version: string;
  timestamp: string;
}

export default function AgentsPage() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agents/status')
      .then(res => res.json())
      .then(data => {
        setAgentStatus(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load agent status:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🌍 Ubuntu Initiative
          </h1>
          <p className="text-xl text-white/90">AI Agent System Dashboard</p>
          <p className="text-sm text-white/70 mt-2">Version {agentStatus?.version}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">System Status</h2>
            <div className={`px-6 py-3 rounded-full text-white font-semibold ${
              agentStatus?.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
            }`}>
              {agentStatus?.status === 'healthy' ? '✅ Healthy' : '⚠️ Configuration Needed'}
            </div>
          </div>
          <div className="text-gray-600">
            <p className="text-lg">{agentStatus?.count} agents operational</p>
            <p className="text-sm mt-2">Last updated: {agentStatus?.timestamp && new Date(agentStatus.timestamp).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Active Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agentStatus?.agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border-l-4 border-purple-500 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">{agent.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{agent.id}</p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-4">🚀 Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/api/agents/status"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors"
            >
              <div className="font-semibold mb-1">API Status</div>
              <div className="text-sm opacity-90">GET /api/agents/status</div>
            </a>
            <a
              href="/dashboard"
              className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors"
            >
              <div className="font-semibold mb-1">Main Dashboard</div>
              <div className="text-sm opacity-90">View project progress</div>
            </a>
            <a
              href="/"
              className="bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors"
            >
              <div className="font-semibold mb-1">Home</div>
              <div className="text-sm opacity-90">Return to main site</div>
            </a>
          </div>
        </div>

        <div className="text-center mt-12 text-white/80">
          <p className="text-sm">Built for Africa's First Sovereign AI Supercomputer</p>
          <p className="text-xs mt-2">Powered by Inga Hydropower 🌊</p>
        </div>
      </div>
    </div>
  );
}
