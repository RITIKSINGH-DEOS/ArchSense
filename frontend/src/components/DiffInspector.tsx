'use client';

import React, { useState } from 'react';
import { GitPullRequest, GitBranch, User, Sparkles, RefreshCw, Edit3, Eye } from 'lucide-react';

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
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="p-3 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GitPullRequest className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold text-zinc-200">GitHub Pull Request Diff</span>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Toggle between View & Edit mode */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center space-x-1 text-xs px-2.5 py-1 rounded-md border transition-colors ${
              isEditMode
                ? 'bg-amber-950/60 border-amber-700/50 text-amber-300'
                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
            }`}
          >
            {isEditMode ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>View Mode</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit / Paste Diff</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Reset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PR Metadata bar */}
      <div className="px-3.5 py-2.5 bg-zinc-900/90 border-b border-zinc-800/80 flex flex-col gap-1 text-xs">
        <div className="font-medium text-zinc-100 flex items-center gap-1.5 truncate">
          <span className="text-indigo-400 font-mono">#142</span>
          <span className="truncate">{prTitle}</span>
        </div>
        <div className="flex items-center space-x-3 text-zinc-400 text-[11px]">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3 text-zinc-500" />
            {prAuthor}
          </span>
          <span className="flex items-center gap-1 font-mono text-zinc-300">
            <GitBranch className="w-3 h-3 text-zinc-500" />
            {prBranch}
          </span>
          {isEditMode && (
            <span className="text-amber-400 font-mono text-[10px] ml-auto">
              ● Custom Edit Active
            </span>
          )}
        </div>
      </div>

      {/* Diff Content Area */}
      <div className="flex-1 bg-zinc-950 font-mono text-xs overflow-auto max-h-[300px]">
        {isEditMode ? (
          <div className="p-2 h-full flex flex-col">
            <textarea
              value={diffCode}
              onChange={(e) => onDiffChange(e.target.value)}
              placeholder="Paste any unified Git diff here (e.g. + import { Client } from 'pg')..."
              className="w-full h-full min-h-[260px] p-2.5 bg-zinc-900 text-zinc-200 font-mono text-xs rounded-lg border border-zinc-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-none"
            />
          </div>
        ) : (
          <div className="p-3">
            {diffCode.split('\n').map((line, idx) => {
              let bg = 'text-zinc-400';
              if (line.startsWith('+') && !line.startsWith('+++')) {
                bg = 'bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500 pl-1';
              } else if (line.startsWith('-') && !line.startsWith('---')) {
                bg = 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500 pl-1 opacity-70';
              } else if (line.startsWith('@@')) {
                bg = 'text-indigo-400 font-semibold bg-indigo-950/30';
              }

              return (
                <div key={idx} className={`py-0.5 leading-relaxed ${bg}`}>
                  {line || ' '}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Run Audit CTA button */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950">
        <button
          onClick={onAudit}
          disabled={isAuditing}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md ${
            isAuditing
              ? 'bg-indigo-700 text-white opacity-70 cursor-wait'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-indigo-500/20 active:scale-[0.99]'
          }`}
        >
          {isAuditing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Auditing custom diff with Meta SAM 3.1 & Muse Spark...</span>
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
