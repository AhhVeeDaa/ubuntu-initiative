import { Server, Circle, Database } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Revalidate every 0 seconds (dynamic) for real-time feel, or standard ISR
export const revalidate = 0;

type Node = {
    id: string;
    cluster_id: string;
    status: 'online' | 'offline' | 'maintenance';
    region: string;
    load: number;
    temperature: number;
};

export default async function NodesPage() {
    const { data, error } = await supabase
        .from('nodes')
        .select('*')
        .order('cluster_id', { ascending: true });

    if (error) {
        console.error('Error fetching nodes:', error);
    }

    const clusters = (data || []) as Node[];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Compute Nodes</h1>
                    <p className="text-gray-400">Direct Infrastructure Monitoring</p>
                </div>
                <div className="flex gap-4">
                    <span className="flex items-center text-sm text-gray-400">
                        <Database className="h-4 w-4 mr-2" />
                        {clusters.length} Nodes Found
                    </span>
                    <button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 rounded-md text-sm font-bold hover:bg-[hsl(var(--primary))]/90 transition-colors">
                        Provision Node
                    </button>
                </div>
            </div>

            {clusters.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-xl">
                    <Server className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white">No Nodes Online</h3>
                    <p className="text-gray-400 mt-2">Database is connected but empty. Please seed the database.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clusters.map((node) => (
                        <div key={node.id} className="glass-panel p-6 rounded-xl border-l-4 border-l-[hsl(var(--primary))]">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    <Server className="h-5 w-5 text-gray-400 mr-2" />
                                    <h3 className="text-lg font-medium text-white font-mono">{node.cluster_id}</h3>
                                </div>
                                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize
                ${node.status === 'online' ? 'bg-green-500/10 text-green-500' :
                                        node.status === 'maintenance' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                                    <Circle className="h-2 w-2 mr-1 fill-current" />
                                    {node.status}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Region</span>
                                    <span className="text-gray-300">{node.region}</span>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">GPU Load</span>
                                        <span className="text-gray-300">{node.load}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                                        <div
                                            className="bg-[hsl(var(--primary))] h-1.5 rounded-full transition-all duration-1000"
                                            style={{ width: `${node.load}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                                    <span className="text-gray-500">Temperature</span>
                                    <span className={`${node.temperature > 80 ? 'text-red-400' : 'text-green-400'}`}>
                                        {node.temperature}°C
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
