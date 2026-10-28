'use client';

import React from 'react';
import { SCENARIOS, AuditScenario } from '../data/mockScenarios';
import { Sparkles } from 'lucide-react';

interface Props {
  currentScenarioId: string;
  onSelect: (scenario: AuditScenario) => void;
}

export const ScenarioPicker: React.FC<Props> = ({ currentScenarioId, onSelect }) => {
  return (
    <div className="glass-panel rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all duration-300">
      <div className="flex items-center space-x-2 pl-1">
        <Sparkles className="w-4 h-4 text-rose-400" />
        <span className="text-xs font-semibold text-stone-200 tracking-tight font-sans">
          Select Demo Scenario:
        </span>
      </div>

      {/* Segmented Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
        {Object.values(SCENARIOS).map((scenario) => {
          const isActive = currentScenarioId === scenario.id;
          const isCritical = scenario.status === 'REJECTED';

          return (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario)}
              className={`flex items-center justify-between space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-rose-950/50 text-white shadow-lg border border-rose-500/60 ring-1 ring-rose-500/40 backdrop-blur-md'
                  : 'glass-pill text-stone-300 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  isCritical ? 'bg-rose-500' : 'bg-emerald-400'
                } ${isActive ? 'animate-pulse ring-2 ring-rose-500/30' : ''}`}
              />
              <span className="font-sans font-medium">{scenario.name}</span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                  isCritical
                    ? 'bg-rose-950/90 text-rose-300'
                    : 'bg-emerald-950/90 text-emerald-300'
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
