import React from 'react';
import { Zap, ShieldCheck, Cpu, DollarSign } from 'lucide-react';

export const MetricsBar: React.FC = () => {
  return (
    <div className="border-b border-white/[0.06] bg-zinc-950/40 backdrop-blur-sm py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-6 text-[11px] text-zinc-400 font-mono no-scrollbar">
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          <span className="text-zinc-500">TAM Impact:</span>
          <span className="text-zinc-200 font-medium">$2.41T/yr CISQ Cost</span>
        </div>

        <div className="hidden sm:inline text-zinc-700">•</div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-zinc-500">P95 Latency:</span>
          <span className="text-emerald-400 font-medium">&lt; 850ms Real-Time Stream</span>
        </div>

        <div className="hidden md:inline text-zinc-700">•</div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
          <span className="text-zinc-500">Visual Perception:</span>
          <span className="text-zinc-200 font-medium">Meta SAM 3.1 Zero-Shot Masking</span>
        </div>

        <div className="hidden lg:inline text-zinc-700">•</div>

        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
          <span className="text-zinc-500">Deterministic Safety:</span>
          <span className="text-zinc-200 font-medium">Pydantic Air-Gapped Gate</span>
        </div>
      </div>
    </div>
  );
};
