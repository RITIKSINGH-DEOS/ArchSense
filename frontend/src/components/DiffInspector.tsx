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
    <div className="bg-zinc-900/90 border border-zinc-700/70 rounded-2xl overflow-hidden flex flex-col w-full shadow-2xl shadow-black/70 backdrop-blur-xl transition-all duration-300">
      {/* Header Toolbar */}
      <div className="px-5 py-3.5 border-b border-zinc-700/60 bg-zinc-900/95 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <FileDiff className="w-4 h-4 text-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">Pull Request Diff Inspector</h3>
            <p className="text-[11px] text-zinc-400 hidden sm:block">Unified Code Delta Analysis</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center space-x-1.5 text-xs px-3.5 py-1.5 rounded-xl border transition-all duration-200 ${
              isEditMode
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold shadow-sm'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {isEditMode ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>View Diff</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit Diff</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors duration-200 border border-zinc-700"
            title="Reset to scenario default"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PR Metadata bar */}
      <div className="px-5 py-3 bg-zinc-800/40 border-b border-zinc-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="font-semibold text-zinc-100 flex items-center gap-2 truncate">
          <span className="text-indigo-400 font-mono text-xs font-bold">#142</span>
          <span className="truncate text-xs">{prTitle}</span>
        </div>
        <div className="flex items-center space-x-4 text-zinc-400 text-xs font-mono">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-300">{prAuthor}</span>
          </span>
          <span className="text-zinc-600">•</span>
          <span className="flex items-center gap-1.5 text-zinc-300">
            <GitBranch className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-indigo-400 font-medium">{prBranch}</span>
          </span>
          {isEditMode && (
            <span className="text-amber-400 text-[11px] font-semibold animate-pulse">
              ● Edit Mode
            </span>
          )}
        </div>
      </div>

      {/* Diff Content Area (Framed dark code viewport) */}
      <div className="bg-[#0a0b10] border border-zinc-800/80 rounded-xl m-3 font-mono text-xs overflow-y-auto h-[340px] shadow-inner">
        {isEditMode ? (
          <div className="p-4 h-full animate-fade-in">
            <textarea
              value={diffCode}
              onChange={(e) => onDiffChange(e.target.value)}
              placeholder="Paste any unified Git diff here..."
              className="w-full h-full p-4 bg-zinc-900/80 text-zinc-100 font-mono text-xs rounded-xl border border-zinc-700 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none transition-all duration-200"
            />
          </div>
        ) : (
          <div className="p-4 space-y-0.5 animate-fade-in">
            {diffCode.split('\n').map((line, idx) => {
              let bg = 'text-zinc-300';
              if (line.startsWith('+') && !line.startsWith('+++')) {
                bg = 'bg-emerald-500/15 text-emerald-300 border-l-2 border-emerald-400 pl-2.5 font-medium';
              } else if (line.startsWith('-') && !line.startsWith('---')) {
                bg = 'bg-rose-500/15 text-rose-300 border-l-2 border-rose-400 pl-2.5 opacity-80';
              } else if (line.startsWith('@@')) {
                bg = 'text-indigo-300 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded my-1 block border border-indigo-500/20';
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
      <div className="p-4 border-t border-zinc-700/60 bg-zinc-900/95">
        <button
          onClick={onAudit}
          disabled={isAuditing}
          className={`w-full py-3.5 px-5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2.5 transition-all duration-200 shadow-xl ${
            isAuditing
              ? 'bg-indigo-700/80 text-white opacity-80 cursor-wait'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-indigo-500/30 active:scale-[0.99]'
          }`}
        >
          {isAuditing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Auditing Microservice Boundaries with Meta SAM 3.1 & Muse Spark...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Run ArchSense Boundary Audit</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
