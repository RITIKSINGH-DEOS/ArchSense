'use client';

import React from 'react';
import { SCENARIOS, AuditScenario } from '../data/mockScenarios';
import { PlayCircle, Sparkles } from 'lucide-react';

interface Props {
  currentScenarioId: string;
  onSelect: (scenario: AuditScenario) => void;
}

export const ScenarioPicker: React.FC<Props> = ({ currentScenarioId, onSelect }) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3.5 bg-zinc-900/90 border border-zinc-700/70 rounded-2xl p-3.5 shadow-xl shadow-black/60 backdrop-blur-xl transition-all duration-300">
      <div className="flex items-center space-x-3 pl-1.5">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
          <PlayCircle className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-zinc-100 tracking-tight uppercase">
              Evaluator Demo Suite
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold hidden sm:inline">
              1-Click Test Drive
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Select a pre-loaded real-world PR scenario, or upload your custom diagram & diff below.
          </p>
        </div>
      </div>

      {/* Segmented Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto">
        {Object.values(SCENARIOS).map((scenario) => {
          const isActive = currentScenarioId === scenario.id;
          const isCritical = scenario.status === 'REJECTED';

          return (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario)}
              className={`flex items-center justify-between sm:justify-start space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ease-out ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-lg shadow-black/60 border border-zinc-600/80 ring-1 ring-indigo-500/30'
                  : 'bg-zinc-950/60 text-zinc-300 hover:text-white hover:bg-zinc-800/60 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  isCritical ? 'bg-rose-500' : 'bg-emerald-500'
                } ${isActive ? 'animate-pulse' : ''}`}
              />
              <span className="truncate">{scenario.name.replace('Scenario ', '')}</span>
              <span
                className={`ml-1.5 text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                  isCritical
                    ? 'bg-rose-950/90 text-rose-300 border border-rose-800/40'
                    : 'bg-emerald-950/90 text-emerald-300 border border-emerald-800/40'
                }`}
              >
                {scenario.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
