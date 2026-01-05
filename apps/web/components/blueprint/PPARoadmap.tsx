'use client'

import { CheckCircle, Clock, Loader, MapPin, Calendar } from 'lucide-react';

export function PPARoadmap() {
  const milestones = [
    {
      quarter: 'Q4 2024',
      title: 'Phase 0: Feasibility & Environmental Impact',
      status: 'completed',
      description: 'Site assessment, environmental studies, and legal framework establishment',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-green-400',
      borderColor: 'border-green-500/40',
      progress: 100
    },
    {
      quarter: 'Q2 2025',
      title: 'Power Purchase Agreement Negotiation',
      status: 'in-progress',
      description: '500MW PPA terms, pricing structure, and grid integration planning',
      icon: Loader,
      color: 'from-yellow-500 to-orange-500',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/40',
      progress: 65
    },
    {
      quarter: 'Q4 2025',
      title: 'Groundbreaking on Data Center Site Alpha',
      status: 'upcoming',
      description: 'Physical construction begins, power infrastructure deployment',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/40',
      progress: 0
    },
    {
      quarter: '2026',
      title: 'First Compute Node Online',
      status: 'upcoming',
      description: 'Initial computing capacity live, AI training workloads commence',
      icon: MapPin,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/40',
      progress: 0
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: '✓ Complete', color: 'text-green-400 bg-green-500/20' };
      case 'in-progress':
        return { text: '⚡ In Progress', color: 'text-yellow-400 bg-yellow-500/20' };
      case 'upcoming':
        return { text: '○ Upcoming', color: 'text-blue-400 bg-blue-500/20' };
      default:
        return { text: status, color: 'text-slate-400 bg-slate-500/20' };
    }
  };

  return (
    <section className="w-full py-16 px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            PPA Roadmap
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            From feasibility to first compute: Our path to Africa's sovereign AI infrastructure
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-yellow-500 via-blue-500 to-purple-500 opacity-30"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const isLeft = index % 2 === 0;
                const statusBadge = getStatusBadge(milestone.status);
                
                return (
                  <div
                    key={milestone.quarter}
                    className={`relative flex items-center ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline Node */}
                    <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-20">
                      <div className={`relative h-20 w-20 rounded-full bg-gradient-to-br ${milestone.color} border-4 ${milestone.borderColor} border-slate-900 flex items-center justify-center ${
                        milestone.status === 'in-progress' ? 'animate-pulse' : ''
                      } shadow-2xl`}>
                        <Icon className={`h-10 w-10 text-white ${milestone.status === 'in-progress' ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                        
                        {/* Glow Effect */}
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${milestone.color} opacity-50 blur-xl -z-10`} />
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className={`w-full md:w-5/12 ml-24 md:ml-0 ${
                      isLeft ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
                    }`}>
                      <div className={`group relative bg-slate-900/80 backdrop-blur-sm border-2 ${milestone.borderColor} rounded-2xl p-6 hover:scale-105 transition-all duration-500 overflow-hidden`}>
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${milestone.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                        
                        <div className="relative z-10">
                          {/* Quarter Badge and Status */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className={`text-sm font-bold ${milestone.textColor} px-3 py-1 rounded-full bg-gradient-to-r ${milestone.color} bg-opacity-20 border ${milestone.borderColor}`}>
                                {milestone.quarter}
                              </span>
                            </div>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusBadge.color} border border-slate-700`}>
                              {statusBadge.text}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-white mb-2">
                            {milestone.title}
                          </h3>
                          <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            {milestone.description}
                          </p>

                          {/* Progress Bar */}
                          {milestone.progress > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">Progress</span>
                                <span className={`font-bold ${milestone.textColor}`}>{milestone.progress}%</span>
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full bg-gradient-to-r ${milestone.color} transition-all duration-1000 rounded-full`}
                                  style={{ width: `${milestone.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Corner Accent */}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${milestone.color} opacity-10 rounded-full blur-2xl`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Roadmap Context */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-3">
                  Why This Timeline Matters
                </h4>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Each milestone is designed to build investor confidence and demonstrate execution capability. Phase 0 proves 
                  technical feasibility. The PPA secures long-term revenue. Groundbreaking shows commitment. First compute online 
                  validates the entire model.
                </p>
                <p className="text-slate-500 text-sm italic">
                  This isn't just a construction timeline—it's a trust-building process that transforms vision into bankable infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}