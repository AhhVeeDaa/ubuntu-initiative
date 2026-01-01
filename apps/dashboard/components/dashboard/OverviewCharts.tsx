'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

const data = [
    { time: '00:00', power: 4000, nodes: 2400 },
    { time: '04:00', power: 3000, nodes: 2210 },
    { time: '08:00', power: 2000, nodes: 2290 },
    { time: '12:00', power: 2780, nodes: 2000 },
    { time: '16:00', power: 1890, nodes: 2181 },
    { time: '20:00', power: 2390, nodes: 2500 },
    { time: '24:00', power: 3490, nodes: 2100 },
];

export function OverviewCharts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-lg font-medium text-white mb-6">Power Consumption (MW)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="time" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                                itemStyle={{ color: '#F3F4F6' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="power"
                                stroke="hsl(var(--primary))"
                                fill="hsl(var(--primary))"
                                fillOpacity={0.2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-lg font-medium text-white mb-6">Active Compute Nodes</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="time" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                                itemStyle={{ color: '#F3F4F6' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="nodes"
                                stroke="hsl(var(--accent))"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
