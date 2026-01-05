'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Database, Activity } from 'lucide-react';

export function EnergyFlow() {
  const [flowProgress, setFlowProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlowProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700">
      <h2 className="text-3xl font-bold text-white mb-2 text-center">
        Sovereign AI Infrastructure
      </h2>
      <p className="text-slate-300 text-center mb-8">
        From River to Intelligence: The Anchor Tenant Model
      </p>

      <div className="relative h-64 flex items-center justify-between">
        {/* Hydro Source */}
        <div className="flex flex-col items-center z-10">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50 animate-pulse">
            <Zap className="w-12 h-12 text-white" />
          </div>
          <div className="text-center">
            <p className="text-blue-400 font-bold text-lg">Inga Falls</p>
            <p className="text-slate-400 text-sm">Hydropower Source</p>
          </div>
        </div>

        {/* Animated Flow Line */}
        <div className="absolute left-32 right-32 top-12 h-1">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="0"
              stroke="url(#flowGradient)"
              strokeWidth="4"
              strokeDasharray="10 5"
              strokeDashoffset={-flowProgress}
              className="transition-all"
            />
          </svg>
          
          {/* Energy Particles */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"
            style={{ 
              left: `${flowProgress}%`,
              transition: 'left 0.05s linear'
            }}
          />
        </div>

        {/* Baseload Label */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 bg-slate-800 px-4 py-2 rounded-lg border border-purple-500 shadow-lg">
          <p className="text-purple-400 font-bold text-sm">Baseload: 500MW Guaranteed</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Activity className="w-3 h-3 text-green-400" />
            <p className="text-green-400 text-xs">24/7 Anchor Demand</p>
          </div>
        </div>

        {/* Compute Destination */}
        <div className="flex flex-col items-center z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
            <Database className="w-12 h-12 text-white" />
          </div>
          <div className="text-center">
            <p className="text-purple-400 font-bold text-lg">AI Supercomputer</p>
            <p className="text-slate-400 text-sm">Compute Cluster</p>
          </div>
        </div>

        {/* Output Flow to Grid */}
        <div className="absolute right-4 top-32 bg-slate-800 px-6 py-3 rounded-lg border border-green-500 shadow-lg">
          <p className="text-green-400 font-bold">Public Grid Surplus</p>
          <p className="text-green-300 text-2xl font-bold">4,000MW</p>
          <p className="text-slate-400 text-xs mt-1">Enabling Continental Scale</p>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-3 gap-4 mt-12">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-blue-500/30">
          <p className="text-blue-400 text-sm font-semibold">Infrastructure Catalyst</p>
          <p className="text-white text-lg font-bold mt-1">Bankable Demand</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/30">
          <p className="text-purple-400 text-sm font-semibold">Sovereign AI</p>
          <p className="text-white text-lg font-bold mt-1">Africa-Owned</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/30">
          <p className="text-green-400 text-sm font-semibold">Grid Multiplier</p>
          <p className="text-white text-lg font-bold mt-1">8x Effect</p>
        </div>
      </div>
    </div>
  );
}
