'use client';

import { useEffect, useState } from 'react';
import { Bot, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  status: string;
  capabilities: string[];
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        setAgents(data.agents || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading agents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-400">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>Error loading agents: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Agent System</h1>
        <p className="mt-2 text-gray-400">
          Autonomous agents working to advance the Ubuntu Initiative
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3\">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-[hsl(var(--primary))]/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Bot className="h-8 w-8 text-[hsl(var(--primary))]" />
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                  <p className="text-xs text-gray-400 font-mono">{agent.id}</p>
                </div>
              </div>
              <div className="flex items-center">
                {agent.status === 'active' ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-400" />
                )}
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-4">{agent.description}</p>

            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Capabilities</h4>
              <ul className="space-y-1">
                {agent.capabilities.map((capability, idx) => (
                  <li key={idx} className="text-sm text-gray-400 flex items-start">
                    <span className="text-[hsl(var(--primary))] mr-2">•</span>
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
