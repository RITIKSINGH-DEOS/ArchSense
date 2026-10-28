import React from 'react';
import { ShieldCheck, GitPullRequest, ExternalLink, Share2 } from 'lucide-react';

interface Props {
  onOpenExport?: () => void;
}

export const Header: React.FC<Props> = ({ onOpenExport }) => {
  return (
    <header className="border-b border-stone-800/80 bg-[#0d0b0a]/80 backdrop-blur-2xl sticky top-0 z-40 shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/50 ring-1 ring-white/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-stone-100 flex items-center gap-1.5 font-sans">
                ArchSense
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  v1.0-keynote
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block">
              Autonomous Visual Architecture Governance & PR Boundary Audit Agent
            </p>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-stone-900/80 border border-stone-800/80 text-xs text-stone-300 shadow-sm backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-stone-400">Meta Model API:</span>
            <span className="font-medium text-emerald-400 font-mono text-[11px]">SAM 3.1 + Muse Spark</span>
          </div>

          {onOpenExport && (
            <button
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-stone-800/60 hover:bg-stone-700/60 border border-stone-700/70 text-xs font-semibold text-stone-200 hover:text-white transition-all shadow-sm backdrop-blur-md"
            >
              <Share2 className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Export Topology</span>
              <span className="sm:hidden">Export</span>
            </button>
          )}

          <a
            href="https://github.com/RITIKSINGH-DEOS/ArchSense"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800/80 text-xs font-medium text-stone-300 hover:text-white transition-all shadow-sm backdrop-blur-md"
          >
            <GitPullRequest className="w-3.5 h-3.5 text-stone-400" />
            <span className="hidden sm:inline">GitHub</span>
            <ExternalLink className="w-3 h-3 text-stone-500" />
          </a>
        </div>
      </div>
    </header>
  );
};
