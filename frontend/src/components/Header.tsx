import React from 'react';
import { ShieldCheck, GitPullRequest, ExternalLink, Share2 } from 'lucide-react';

interface Props {
  onOpenExport?: () => void;
}

export const Header: React.FC<Props> = ({ onOpenExport }) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                ArchSense
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  v1.0-keynote
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Autonomous Visual Architecture Governance & PR Boundary Audit Agent
            </p>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-zinc-400">Meta Model API:</span>
            <span className="font-medium text-emerald-400 font-mono text-[11px]">SAM 3.1 + Muse Spark</span>
          </div>

          {onOpenExport && (
            <button
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs font-semibold text-indigo-300 transition-all shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Export Topology</span>
              <span className="sm:hidden">Export</span>
            </button>
          )}

          <a
            href="https://github.com/RITIKSINGH-DEOS/ArchSense"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 text-xs font-medium text-zinc-200 hover:text-white transition-all shadow-sm"
          >
            <GitPullRequest className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">GitHub</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </div>
    </header>
  );
};
