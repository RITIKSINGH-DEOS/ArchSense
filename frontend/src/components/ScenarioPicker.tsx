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
    <div className="glass-panel rounded-3xl p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-all duration-300">
      <div className="flex items-center space-x-3.5 pl-1">
        <div className="w-9 h-9 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 flex-shrink-0 shadow-inner">
          <PlayCircle className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-serif text-sm font-normal text-stone-100 tracking-tight">
              Evaluator Demo Suite
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-semibold hidden sm:inline">
              1-Click Test Drive
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5 font-sans">
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
              className={`flex items-center justify-between sm:justify-start space-x-2.5 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all duration-200 ease-out ${
                isActive
                  ? 'bg-rose-950/40 text-white shadow-xl shadow-rose-950/40 border border-rose-500/50 ring-1 ring-rose-500/50 backdrop-blur-md'
                  : 'glass-pill text-stone-300 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  isCritical ? 'bg-rose-500' : 'bg-emerald-400'
                } ${isActive ? 'animate-pulse ring-4 ring-rose-500/20' : ''}`}
              />
              <span className="truncate font-sans">{scenario.name.replace('Scenario ', '')}</span>
              <span
                className={`ml-1.5 text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                  isCritical
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
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
