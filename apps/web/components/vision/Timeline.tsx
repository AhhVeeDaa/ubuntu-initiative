import { CheckCircle2, Circle, Clock } from 'lucide-react';

const steps = [
    {
        phase: 'Phase 0',
        title: 'Initialization',
        date: 'Q1 2026',
        status: 'current',
        description: 'project structure, legal framework, partnership pipeline, and initial capitalization.',
    },
    {
        phase: 'Phase 1',
        title: 'Pilot Cluster',
        date: 'Q3 2026',
        status: 'upcoming',
        description: 'Deployment of 10MW pilot facility at Inga III site. Training of first sovereign models.',
    },
    {
        phase: 'Phase 2',
        title: 'Foundation Training',
        date: '2027',
        status: 'upcoming',
        description: 'Scaling to 100MW. Full-scale training of pan-African foundation models on local infrastructure.',
    },
    {
        phase: 'Phase 3',
        title: 'Continental Deployment',
        date: '2028+',
        status: 'upcoming',
        description: 'Integration with national grids and rigorous data sovereignty enforcement across the continent.',
    },
];

export function Timeline() {
    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {steps.map((step, stepIdx) => (
                    <li key={step.phase}>
                        <div className="relative pb-8">
                            {stepIdx !== steps.length - 1 ? (
                                <span
                                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-white/10"
                                    aria-hidden="true"
                                />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-[hsl(var(--background))] ${step.status === 'complete' ? 'bg-[hsl(var(--primary))]' :
                                            step.status === 'current' ? 'bg-[hsl(var(--accent))]' : 'bg-gray-800'
                                        }`}>
                                        {step.status === 'complete' ? (
                                            <CheckCircle2 className="h-5 w-5 text-[hsl(var(--primary-foreground))]" aria-hidden="true" />
                                        ) : step.status === 'current' ? (
                                            <Clock className="h-5 w-5 text-[hsl(var(--accent-foreground))]" aria-hidden="true" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-gray-500" aria-hidden="true" />
                                        )}
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${step.status === 'current' ? 'text-[hsl(var(--accent))]' : 'text-gray-500'
                                                }`}>
                                                {step.phase}
                                            </span>
                                            <h3 className="text-lg font-medium text-white">{step.title}</h3>
                                        </div>

                                        <p className="mt-2 text-sm text-gray-400 max-w-xl">{step.description}</p>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                        <time dateTime={step.date}>{step.date}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
