import { Cpu, Server, HardDrive, Zap } from 'lucide-react';

const specs = [
    {
        name: 'Processing Power',
        value: '1000 PFLOPS',
        unit: 'FP16',
        icon: Cpu,
        detail: 'Specialized for LLM Training',
    },
    {
        name: 'Energy Capacity',
        value: '40,000 MW',
        unit: 'Hydro',
        icon: Zap,
        detail: 'Zero-Carbon Baseload',
    },
    {
        name: 'Compute Nodes',
        value: '10,000+',
        unit: 'H100 Eq',
        icon: Server,
        detail: 'Liquid Cooled Clusters',
    },
    {
        name: 'Data Storage',
        value: '500 PB',
        unit: 'NVMe',
        icon: HardDrive,
        detail: 'Sovereign Data Lake',
    },
];

export function TechSpecs() {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {specs.map((item) => (
                <div key={item.name} className="glass-card p-6 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/5 group-hover:bg-[hsl(var(--primary))]/10 transition-colors"></div>

                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <item.icon className="h-8 w-8 text-[hsl(var(--primary))]" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-400 truncate">{item.name}</dt>
                                <dd>
                                    <div className="text-2xl font-medium text-white">{item.value}</div>
                                    <div className="text-xs text-[hsl(var(--accent))] mt-1">{item.unit}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div className="mt-4 border-t border-white/10 pt-4">
                        <span className="text-xs text-gray-500 uppercase tracking-widest">{item.detail}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
