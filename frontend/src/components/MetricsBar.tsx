import React from 'react';
import { Zap, ShieldAlert, Cpu, DollarSign } from 'lucide-react';

export const MetricsBar: React.FC = () => {
  return (
    <div className="bg-zinc-900/50 border-b border-zinc-800/80 py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-zinc-500 font-medium">Global TAM Impact</div>
            <div className="text-zinc-200 font-semibold">$2.41T/yr CISQ Defect Cost</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-zinc-500 font-medium">P95 Audit Latency</div>
            <div className="text-emerald-400 font-semibold">&lt; 850 ms (Real-time Stream)</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-zinc-500 font-medium">Visual Perception Engine</div>
            <div className="text-zinc-200 font-semibold">Meta SAM 3.1 Mask Model</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-zinc-500 font-medium">Deterministic Safety Gate</div>
            <div className="text-zinc-200 font-semibold">100% Pydantic Air-Gapped</div>
          </div>
        </div>
      </div>
    </div>
  );
};
