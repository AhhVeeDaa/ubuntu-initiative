import { Activity, BatteryCharging, Zap } from 'lucide-react';

export default function EnergyPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Energy Grid</h1>
                <p className="text-gray-400">Inga Dam Power Distribution Status</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="w-24 h-24 text-[hsl(var(--primary))]" />
                    </div>
                    <h3 className="text-gray-400 font-medium mb-2">Total Output</h3>
                    <div className="text-4xl font-bold text-white">42.8 GW</div>
                    <div className="mt-2 text-green-400 text-sm flex items-center">
                        <Activity className="w-4 h-4 mr-1" />
                        98.2% Efficiency
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <BatteryCharging className="w-24 h-24 text-[hsl(var(--accent))]" />
                    </div>
                    <h3 className="text-gray-400 font-medium mb-2">Grid Frequency</h3>
                    <div className="text-4xl font-bold text-white">50.02 Hz</div>
                    <div className="mt-2 text-gray-400 text-sm">
                        Nominal Range
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-xl text-center border-dashed border-2 border-white/10">
                <p className="text-gray-500">Real-time telemetry map from Inga III turbines coming in Phase 3.</p>
            </div>
        </div>
    );
}
