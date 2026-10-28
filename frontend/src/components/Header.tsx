import React from 'react';
import { ShieldCheck, GitPullRequest, ExternalLink, Share2 } from 'lucide-react';

interface Props {
  onOpenExport?: () => void;
}

export const Header: React.FC<Props> = ({ onOpenExport }) => {
  return (
    <header className="border-b border-stone-800/80 bg-[#0d0b0a]/80 backdrop-blur-2xl sticky top-0 z-40 shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/50 ring-1 ring-white/20">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold tracking-tight text-stone-100 font-sans">
              ArchSense
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
              Meta AI Hackathon
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {onOpenExport && (
            <button
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl glass-pill text-xs font-medium text-stone-200 hover:text-white transition-all shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Export</span>
            </button>
          )}

          <a
            href="https://github.com/RITIKSINGH-DEOS/ArchSense"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl glass-pill text-xs font-medium text-stone-300 hover:text-white transition-all shadow-sm"
          >
            <GitPullRequest className="w-3.5 h-3.5 text-stone-400" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-stone-500" />
          </a>
        </div>
      </div>
    </header>
  );
};
