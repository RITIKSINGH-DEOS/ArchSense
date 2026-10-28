'use client';

import React, { useState } from 'react';
import { GitPullRequest, GitBranch, User, Sparkles, RefreshCw, Edit3, Eye, FileDiff } from 'lucide-react';

interface Props {
  prTitle: string;
  prAuthor: string;
  prBranch: string;
  diffCode: string;
  onDiffChange: (newDiff: string) => void;
  onAudit: () => void;
  isAuditing: boolean;
  isAudited: boolean;
  onReset: () => void;
}

export const DiffInspector: React.FC<Props> = ({
  prTitle,
  prAuthor,
  prBranch,
  diffCode,
  onDiffChange,
  onAudit,
  isAuditing,
  isAudited,
  onReset,
}) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  return (
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col w-full shadow-2xl transition-all duration-300">
      {/* Header Toolbar */}
      <div className="px-5 py-3.5 border-b border-stone-800/80 bg-stone-950/60 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <FileDiff className="w-4 h-4 text-rose-400" />
          <div>
            <h3 className="text-sm font-semibold text-stone-100 tracking-tight font-sans">Pull Request Diff Inspector</h3>
            <p className="text-[11px] text-stone-400 hidden sm:block font-sans">Unified Code Delta Analysis</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center space-x-1.5 text-xs px-3.5 py-1.5 rounded-xl border transition-all duration-200 ${
              isEditMode
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold shadow-sm'
                : 'bg-stone-900/70 border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            {isEditMode ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span className="font-sans">View Diff</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-sans">Edit Diff</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-stone-900/70 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors duration-200 border border-stone-800"
            title="Reset to scenario default"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PR Metadata bar */}
      <div className="px-5 py-3 bg-stone-900/30 border-b border-stone-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="font-semibold text-stone-100 flex items-center gap-2 truncate">
          <span className="text-rose-400 font-mono text-xs font-bold">#142</span>
          <span className="truncate text-xs text-stone-200">{prTitle}</span>
        </div>
        <div className="flex items-center space-x-4 text-stone-400 text-xs font-mono">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-stone-300">{prAuthor}</span>
          </span>
          <span className="text-stone-600">•</span>
          <span className="flex items-center gap-1.5 text-stone-300">
            <GitBranch className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-rose-300 font-medium">{prBranch}</span>
          </span>
          {isEditMode && (
            <span className="text-amber-400 text-[11px] font-semibold animate-pulse">
              ● Edit Mode
            </span>
          )}
        </div>
      </div>

      {/* Diff Content Area (Framed dark code viewport) */}
      <div className="bg-[#0c0a09] border border-stone-800/70 rounded-2xl m-3.5 font-mono text-xs overflow-y-auto h-[340px] shadow-inner">
        {isEditMode ? (
          <div className="p-4 h-full animate-fade-in">
            <textarea
              value={diffCode}
              onChange={(e) => onDiffChange(e.target.value)}
              placeholder="Paste any unified Git diff here..."
              className="w-full h-full p-4 bg-stone-900/60 text-stone-100 font-mono text-xs rounded-xl border border-stone-700/80 focus:outline-none focus:border-rose-500 leading-relaxed resize-none transition-all duration-200"
            />
          </div>
        ) : (
          <div className="p-4 space-y-0.5 animate-fade-in">
            {diffCode.split('\n').map((line, idx) => {
              let bg = 'text-stone-300';
              if (line.startsWith('+') && !line.startsWith('+++')) {
                bg = 'bg-emerald-500/15 text-emerald-300 border-l-2 border-emerald-400 pl-2.5 font-medium';
              } else if (line.startsWith('-') && !line.startsWith('---')) {
                bg = 'bg-rose-500/15 text-rose-300 border-l-2 border-rose-400 pl-2.5 opacity-80';
              } else if (line.startsWith('@@')) {
                bg = 'text-rose-300 font-semibold bg-rose-500/10 px-2 py-0.5 rounded my-1 block border border-rose-500/20';
              }

              return (
                <div key={idx} className={`py-1 px-2 font-mono leading-relaxed rounded-sm ${bg} transition-colors duration-150`}>
                  {line || ' '}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Audit Action CTA Button */}
      <div className="p-4 border-t border-stone-800/80 bg-stone-950/60 backdrop-blur-xl">
        <button
          onClick={onAudit}
          disabled={isAuditing}
          className={`w-full py-3.5 px-5 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2.5 transition-all duration-200 shadow-xl ring-1 ring-white/10 ${
            isAuditing
              ? 'bg-rose-900/70 text-white opacity-80 cursor-wait'
              : 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-rose-950/50 active:scale-[0.99]'
          }`}
        >
          {isAuditing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Auditing Microservice Boundaries with Meta SAM 3.1 & Muse Spark...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-rose-200" />
              <span className="font-sans">Run ArchSense Boundary Audit</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
