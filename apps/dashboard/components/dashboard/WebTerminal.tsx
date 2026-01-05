'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, ShieldAlert } from 'lucide-react';

type LogEntry = {
    id: string;
    timestamp: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'command';
    content: string;
};

export function WebTerminal() {
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState<LogEntry[]>([
        { id: '1', timestamp: new Date().toISOString(), type: 'info', content: 'Connected to Ubuntu Inga Cluster (v0.1.0)' },
        { id: '2', timestamp: new Date().toISOString(), type: 'warning', content: '3 nodes require firmware updates.' },
        { id: '3', timestamp: new Date().toISOString(), type: 'success', content: 'Secure shell session established.' },
    ]);
    const endRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    const handleCommand = useCallback((cmd: string) => {
        const timestamp = new Date().toISOString();

        // Add command to log
        setLogs(prev => [...prev, { id: Math.random().toString(), timestamp, type: 'command', content: `> ${cmd}` }]);

        // Process command
        setTimeout(() => {
            let response: LogEntry | null = null;
            const lowerCmd = cmd.toLowerCase().trim();

            if (lowerCmd === 'help') {
                response = { id: Math.random().toString(), timestamp: new Date().toISOString(), type: 'info', content: 'Available commands: status, nodes, efficiency, clear, reboot <node_id>' };
            } else if (lowerCmd === 'status') {
                response = { id: Math.random().toString(), timestamp: new Date().toISOString(), type: 'success', content: 'System Nominal. Load: 42%. Temp: 58°C.' };
            } else if (lowerCmd === 'nodes') {
                response = { id: Math.random().toString(), timestamp: new Date().toISOString(), type: 'info', content: 'Listing active nodes... [alpha-01, alpha-02, beta-01, gamma-01]' };
            } else if (lowerCmd === 'clear') {
                setLogs([]);
                return;
            } else if (lowerCmd.startsWith('reboot')) {
                response = { id: Math.random().toString(), timestamp: new Date().toISOString(), type: 'warning', content: `Initiating remote reboot sequence for ${cmd.split(' ')[1] || 'all nodes'}...` };
            } else {
                response = { id: Math.random().toString(), timestamp: new Date().toISOString(), type: 'error', content: `Command not recognized: ${cmd}` };
            }

            if (response) {
                setLogs(prev => [...prev, response!]);
            }
        }, 400);
    }, []);

    useEffect(() => {
        (window as any).executeCommand = handleCommand;
        return () => { delete (window as any).executeCommand; };
    }, [handleCommand]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        handleCommand(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-[600px] glass-panel rounded-xl overflow-hidden border border-white/10 font-mono text-sm">
            {/* Terminal Header */}
            <div className="bg-black/40 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <span className="ml-3 text-gray-400 text-xs">root@inga-cluster:~</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                    <ShieldAlert className="w-3 h-3 mr-1" />
                    SSH-2.0-OpenSSH_8.9p1
                </div>
            </div>

            {/* Output Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-black/80">
                {logs.map((log) => (
                    <div key={log.id} className="flex items-start">
                        <span className="text-gray-600 mr-3 text-[10px] w-24 shrink-0 mt-0.5">
                            [{new Date(log.timestamp).toLocaleTimeString()}]
                        </span>
                        <div className={`break-all ${log.type === 'error' ? 'text-red-400' :
                            log.type === 'warning' ? 'text-yellow-400' :
                                log.type === 'success' ? 'text-green-400' :
                                    log.type === 'command' ? 'text-cyan-300 font-bold' :
                                        'text-gray-300'
                            }`}>
                            {log.content}
                        </div>
                    </div>
                ))}
                <div ref={endRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="bg-[hsl(var(--card))] p-2 border-t border-white/10 flex items-center">
                <span className="text-green-500 mr-2">$</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600 focus:ring-0"
                    placeholder="Enter command..."
                    autoFocus
                />
                <button type="submit" disabled={!input.trim()} className="p-2 text-[hsl(var(--primary))] hover:text-white transition-colors disabled:opacity-50">
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
}
