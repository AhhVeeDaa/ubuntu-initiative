import { FileText, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const logs = [
    { id: 1, type: 'error', message: 'Connection timeout: node-alpha-03', timestamp: '2026-01-01 14:23:11' },
    { id: 2, type: 'info', message: 'Scheduled maintenance task started', timestamp: '2026-01-01 14:00:00' },
    { id: 3, type: 'success', message: 'Backup completed successfully', timestamp: '2026-01-01 13:45:22' },
    { id: 4, type: 'warning', message: 'High CPU load detected on node-beta-01', timestamp: '2026-01-01 13:30:05' },
    { id: 5, type: 'info', message: 'System boot sequence initiated', timestamp: '2026-01-01 09:00:00' },
    { id: 6, type: 'info', message: 'Inga Hydro Interface v2.1 loaded', timestamp: '2026-01-01 09:00:05' },
];

export default function LogsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">System Logs</h1>
                    <p className="text-gray-400">Audit trail and system events</p>
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-sm text-gray-300">Export CSV</button>
                    <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-sm text-gray-300">Clear</button>
                </div>
            </div>

            <div className="glass-panel overflow-hidden rounded-xl">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/20">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors font-mono text-sm">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {log.type === 'error' && <span className="flex items-center text-red-400"><AlertTriangle className="w-4 h-4 mr-2" /> ERROR</span>}
                                    {log.type === 'warning' && <span className="flex items-center text-yellow-400"><AlertTriangle className="w-4 h-4 mr-2" /> WARN</span>}
                                    {log.type === 'success' && <span className="flex items-center text-green-400"><CheckCircle className="w-4 h-4 mr-2" /> OK</span>}
                                    {log.type === 'info' && <span className="flex items-center text-blue-400"><Info className="w-4 h-4 mr-2" /> INFO</span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{log.timestamp}</td>
                                <td className="px-6 py-4 text-gray-300">{log.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
