'use client';

import React from 'react';
import { CheckCircle, Circle, Clock, DollarSign, TrendingUp } from 'lucide-react';

export function MilestoneTracker() {
  // Phase 0 Funding Data
  const totalGoal = 500000;
  const raised = 12500;
  const remaining = totalGoal - raised;
  const progressPercentage = (raised / totalGoal) * 100;

  // Project Timeline Phases
  const phases = [
    {
      id: 1,
      name: "Phase 0: Feasibility & Legal",
      status: "current",
      goal: "$500k",
      description: "Site surveys, PPA framework, legal entity formation",
      milestones: [
        { name: "Entity Registration", complete: true },
        { name: "Site Assessment", complete: false },
        { name: "PPA Draft", complete: false }
      ]
    },
    {
      id: 2,
      name: "Phase 1: PPA Signing & Groundbreaking",
      status: "upcoming",
      goal: "$50M",
      description: "Power Purchase Agreement execution, land acquisition, grid connection design",
      milestones: [
        { name: "PPA Execution", complete: false },
        { name: "Land Acquisition", complete: false },
        { name: "Grid Design", complete: false }
      ]
    },
    {
      id: 3,
      name: "Phase 2: Compute Cluster Alpha",
      status: "future",
      goal: "$200M",
      description: "First 100MW facility, initial GPU deployment, sovereign AI operations begin",
      milestones: [
        { name: "Facility Construction", complete: false },
        { name: "Hardware Deployment", complete: false },
        { name: "Operations Launch", complete: false }
      ]
    }
  ];

  return (
    <div className="w-full space-y-8">
      {/* Funding Progress Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Phase 0 Funding Progress</h2>
          <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-bold">{progressPercentage.toFixed(1)}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-8 bg-slate-700 rounded-full overflow-hidden mb-6">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 flex items-center justify-end pr-4"
            style={{ width: `${Math.max(progressPercentage, 5)}%` }}
          >
            <span className="text-white text-sm font-bold">${(raised / 1000).toFixed(1)}k</span>
          </div>
        </div>

        {/* Funding Stats Grid */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-xl border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <p className="text-slate-400 text-sm font-semibold">Total Goal</p>
            </div>
            <p className="text-white text-3xl font-bold">${(totalGoal / 1000).toFixed(0)}k</p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-xl border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-slate-400 text-sm font-semibold">Raised</p>
            </div>
            <p className="text-green-400 text-3xl font-bold">${(raised / 1000).toFixed(1)}k</p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <p className="text-slate-400 text-sm font-semibold">Remaining</p>
            </div>
            <p className="text-purple-400 text-3xl font-bold">${(remaining / 1000).toFixed(1)}k</p>
          </div>
        </div>
      </div>

      {/* Project Timeline */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-8">Project Timeline</h2>

        <div className="space-y-6">
          {phases.map((phase, index) => (
            <div key={phase.id} className="relative">
              {/* Connector Line */}
              {index < phases.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-24 bg-slate-700" />
              )}

              <div className={`flex gap-6 ${
                phase.status === 'current' 
                  ? 'bg-blue-500/10 border-blue-500/50' 
                  : phase.status === 'upcoming'
                  ? 'bg-slate-800/30 border-slate-600/50'
                  : 'bg-slate-800/20 border-slate-700/30'
              } border-2 rounded-xl p-6 transition-all hover:scale-[1.02]`}>
                
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {phase.status === 'current' ? (
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50 animate-pulse">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  ) : phase.status === 'upcoming' ? (
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                      <Circle className="w-6 h-6 text-slate-400" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                      <Circle className="w-6 h-6 text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Phase Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className={`text-xl font-bold ${
                        phase.status === 'current' ? 'text-blue-400' : 'text-white'
                      }`}>
                        {phase.name}
                      </h3>
                      <p className="text-slate-400 mt-1">{phase.description}</p>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                      phase.status === 'current'
                        ? 'bg-blue-500/20 text-blue-400'
                        : phase.status === 'upcoming'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-slate-700/50 text-slate-500'
                    }`}>
                      {phase.goal}
                    </span>
                  </div>

                  {/* Milestones */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {phase.milestones.map((milestone, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          milestone.complete
                            ? 'bg-green-500/20 border border-green-500/50'
                            : 'bg-slate-800/50 border border-slate-700'
                        }`}
                      >
                        {milestone.complete ? (
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${
                          milestone.complete ? 'text-green-400' : 'text-slate-400'
                        }`}>
                          {milestone.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
