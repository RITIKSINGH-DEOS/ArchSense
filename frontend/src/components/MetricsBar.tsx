import React from 'react';

export const MetricsBar: React.FC = () => {
  return (
    <div className="border-b border-white/[0.06] bg-zinc-950/60 backdrop-blur-md py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-[11px] text-zinc-400 font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          <span className="text-zinc-500">TAM Impact:</span>
          <span className="text-zinc-200 font-medium">$2.41T/yr CISQ Cost</span>
        </div>

        <div className="hidden sm:inline text-zinc-700">•</div>

        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-zinc-500">P95 Latency:</span>
          <span className="text-emerald-400 font-medium">&lt; 850ms Real-Time Stream</span>
        </div>

        <div className="hidden md:inline text-zinc-700">•</div>

        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
          <span className="text-zinc-500">Visual Perception:</span>
          <span className="text-zinc-200 font-medium">Meta SAM 3.1 Zero-Shot Masking</span>
        </div>

        <div className="hidden lg:inline text-zinc-700">•</div>

        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
          <span className="text-zinc-500">Deterministic Safety:</span>
          <span className="text-zinc-200 font-medium">Pydantic Air-Gapped Gate</span>
        </div>
      </div>
    </div>
  );
};
