'use client';

import React from 'react';
import { SCENARIOS, AuditScenario } from '../data/mockScenarios';
import { PlayCircle, ShieldAlert, GitCommit, CheckCircle2 } from 'lucide-react';

interface Props {
  currentScenarioId: string;
  onSelect: (scenario: AuditScenario) => void;
}

export const ScenarioPicker: React.FC<Props> = ({ currentScenarioId, onSelect }) => {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 shadow-md">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-zinc-300">
          <PlayCircle className="w-4 h-4 text-indigo-400" />
          <span>60-Second Evaluator Scenarios (1-Click Test Suite)</span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
          Click any scenario to simulate real-world PR evaluation
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {Object.values(SCENARIOS).map((scenario) => {
          const isActive = currentScenarioId === scenario.id;
          const isCritical = scenario.status === 'REJECTED';

          return (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                isActive
                  ? 'bg-zinc-800/90 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md'
                  : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-900/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs text-zinc-100 truncate pr-2">
                  {scenario.name}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase flex-shrink-0 ${
                    isCritical
                      ? 'bg-rose-950/60 text-rose-300 border-rose-800/40'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                  }`}
                >
                  {scenario.badge}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                {scenario.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
