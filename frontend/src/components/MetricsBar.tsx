import React from 'react';

export const MetricsBar: React.FC = () => {
  return (
    <div className="border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md py-2.5 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-[11px] text-zinc-300 font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          <span className="text-zinc-400">TAM Impact:</span>
          <span className="text-zinc-100 font-semibold">$2.41T/yr CISQ Cost</span>
        </div>

        <div className="hidden sm:inline text-zinc-600">•</div>

        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-zinc-400">P95 Latency:</span>
          <span className="text-emerald-400 font-semibold">&lt; 850ms Real-Time Stream</span>
        </div>

        <div className="hidden md:inline text-zinc-600">•</div>

        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
          <span className="text-zinc-400">Visual Perception:</span>
          <span className="text-zinc-100 font-semibold">Meta SAM 3.1 Zero-Shot Masking</span>
        </div>

        <div className="hidden lg:inline text-zinc-600">•</div>

        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
          <span className="text-zinc-400">Deterministic Safety:</span>
          <span className="text-zinc-100 font-semibold">Pydantic Air-Gapped Gate</span>
        </div>
      </div>
    </div>
  );
};
