'use client';

import React from 'react';
import { SCENARIOS, AuditScenario } from '../data/mockScenarios';
import { PlayCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  currentScenarioId: string;
  onSelect: (scenario: AuditScenario) => void;
}

export const ScenarioPicker: React.FC<Props> = ({ currentScenarioId, onSelect }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-950/70 border border-white/[0.08] rounded-2xl p-2.5 shadow-xl shadow-black/40 backdrop-blur-xl">
      <div className="flex items-center space-x-2 pl-2">
        <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <PlayCircle className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-semibold text-zinc-200 tracking-tight">Evaluator Scenarios:</span>
      </div>

      {/* Segmented Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 w-full sm:w-auto">
        {Object.values(SCENARIOS).map((scenario) => {
          const isActive = currentScenarioId === scenario.id;
          const isCritical = scenario.status === 'REJECTED';

          return (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario)}
              className={`flex items-center justify-between sm:justify-start space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-md shadow-black/50 border border-white/10 ring-1 ring-white/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  isCritical ? 'bg-rose-500' : 'bg-emerald-500'
                } ${isActive ? 'animate-pulse' : ''}`}
              />
              <span className="truncate">{scenario.name.replace('Scenario ', '')}</span>
              <span
                className={`ml-1.5 text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                  isCritical
                    ? 'bg-rose-950/80 text-rose-300'
                    : 'bg-emerald-950/80 text-emerald-300'
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
