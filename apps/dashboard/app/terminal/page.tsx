'use client';

import { WebTerminal } from '@/components/dashboard/WebTerminal';
import { Terminal, Cpu } from 'lucide-react';

export default function TerminalPage() {
    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                    <Terminal className="mr-3 h-6 w-6 text-[hsl(var(--primary))]" />
                    Remote Execution
                </h1>
                <p className="text-gray-400">Direct shell access to the Inga Supercomputer Controller.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                <div className="lg:col-span-2 flex flex-col min-h-0">
                    <WebTerminal />
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                            <Cpu className="h-5 w-5 mr-2 text-[hsl(var(--accent))]" />
                            Active Sessions
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                                    <div className="text-sm">
                                        <div className="text-white">root@tty1</div>
                                        <div className="text-gray-500 text-xs">192.168.1.42</div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">0s ago</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-3 animate-pulse"></div>
                                    <div className="text-sm">
                                        <div className="text-white">admin@tty2</div>
                                        <div className="text-gray-500 text-xs">10.0.0.5</div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">Idle 5m</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-lg font-medium text-white mb-2">Quick Commands</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => (window as any).executeCommand?.('systemctl status inga-core')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded transition-colors font-mono"
                            >
                                $ systemctl status inga-core
                            </button>
                            <button
                                onClick={() => (window as any).executeCommand?.('docker ps -a --format "table"')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded transition-colors font-mono"
                            >
                                $ docker ps -a --format "table"
                            </button>
                            <button
                                onClick={() => (window as any).executeCommand?.('powertop --auto-tune')}
                                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded transition-colors font-mono"
                            >
                                $ powertop --auto-tune
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
