'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Terminal, Shield, Zap, BarChart3, Clock } from 'lucide-react';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function SystemLogs() {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        // Initial fetch
        fetchLogs();

        // Subscribe to new logs
        const channel = supabase
            .channel('agent_audit_log_changes')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'agent_audit_log' },
                (payload) => {
                    setLogs(prev => [payload.new, ...prev].slice(0, 50));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function fetchLogs() {
        const { data, error } = await supabase
            .from('agent_audit_log')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(50);

        if (data) setLogs(data);
    }

    const getAgentIcon = (id: string) => {
        if (id === 'agent_001') return Shield;
        if (id === 'agent_002') return Zap;
        return BarChart3;
    };

    return (
        <div className="bg-[#05080f] border border-white/10 rounded-[40px] overflow-hidden flex flex-col h-[600px]">
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                    <Terminal className="h-5 w-5 text-[hsl(var(--primary))]" />
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">System Audit Trail</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Monitoring</span>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-2 scrollbar-hide bg-black/50">
                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4">
                        <Clock className="h-12 w-12 opacity-20" />
                        <p className="font-bold uppercase tracking-widest text-xs">No activity detected yet</p>
                    </div>
                ) : (
                    logs.map((log) => {
                        const Icon = getAgentIcon(log.agent_id);
                        return (
                            <div key={log.id} className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                                <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors`}>
                                    <Icon className="h-4 w-4 text-gray-400 group-hover:text-white" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white/60">
                                            {log.agent_id} • {log.action_type}
                                        </span>
                                        <span className="text-[10px] text-gray-600 font-medium">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm font-medium truncate">
                                        {log.reasoning || `Executed ${log.action_type}`}
                                    </p>
                                    {log.confidence_score && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="flex-grow h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[hsl(var(--primary))] to-cyan-400"
                                                    style={{ width: `${log.confidence_score * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-[8px] font-black text-[hsl(var(--primary))] tracking-tighter">
                                                {Math.round(log.confidence_score * 100)}% CONFIDENCE
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
