import React from 'react';

export const MetricsBar: React.FC = () => {
  return (
    <div className="border-b border-stone-800/60 bg-[#0f0d0b]/50 backdrop-blur-md py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1.5 gap-x-4 text-[11px] text-stone-400 font-mono">
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
          <span>CISQ Cost:</span>
          <span className="text-stone-200 font-semibold">$2.41T/yr</span>
        </div>

        <div className="hidden sm:inline text-stone-700">•</div>

        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Latency:</span>
          <span className="text-emerald-400 font-semibold">&lt; 850ms</span>
        </div>

        <div className="hidden md:inline text-stone-700">•</div>

        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>Perception:</span>
          <span className="text-stone-200 font-semibold">Meta SAM 3.1</span>
        </div>

        <div className="hidden lg:inline text-stone-700">•</div>

        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
          <span>Engine:</span>
          <span className="text-stone-200 font-semibold">Deterministic Policy Gate</span>
        </div>
      </div>
    </div>
  );
};
