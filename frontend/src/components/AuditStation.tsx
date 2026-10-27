'use client';

import React, { useState } from 'react';
import { Violation } from '../data/mockScenarios';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileCode,
  Bot,
  CheckCircle2,
  Lock,
  Copy,
  Check,
  Share2,
  Sparkles,
  ArrowRight,
  MessageSquareCode,
  SlidersHorizontal,
} from 'lucide-react';

interface Props {
  score: number;
  status: 'REJECTED' | 'WARNING' | 'APPROVED';
  violations: Violation[];
  isAudited: boolean;
  isAuditing: boolean;
  onOpenExport?: () => void;
}

export const AuditStation: React.FC<Props> = ({
  score,
  status,
  violations,
  isAudited,
  isAuditing,
  onOpenExport,
}) => {
  const [copiedReview, setCopiedReview] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'violations' | 'bot'>('violations');

  if (!isAudited && !isAuditing) {
    return (
      <div className="bg-zinc-950/70 border border-white/[0.08] rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[380px] shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-zinc-500 mb-3 shadow-inner">
          <ShieldAlert className="w-6 h-6 text-zinc-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200 tracking-tight">Audit Station Standby</h3>
        <p className="text-xs text-zinc-400 max-w-xs mt-1.5 leading-relaxed">
          Select an evaluator scenario or test custom diffs, then trigger{' '}
          <span className="text-indigo-400 font-medium">Run Audit</span> to inspect architectural boundaries.
        </p>
      </div>
    );
  }

  const isApproved = status === 'APPROVED';
  const statusColor = isApproved ? 'text-emerald-400' : 'text-rose-400';
  const badgeBorder = isApproved
    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
    : 'border-rose-500/30 bg-rose-500/10 text-rose-300';
  const progressBarColor = isApproved
    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
    : 'bg-gradient-to-r from-rose-600 to-rose-400';

  const handleCopyReview = () => {
    let md = `## ${isApproved ? '✅' : '❌'} ArchSense Architectural Governance Check: **${status}** (${score}/100)\n\n`;
    if (isApproved) {
      md += `### ✅ Clean Boundary Clearance\nAll code changes strictly conform to declared microservice boundaries.\n`;
    } else {
      md += `### ⚠️ Detected Architectural Anomalies (${violations.length})\n\n`;
      violations.forEach((v, idx) => {
        md += `#### ${idx + 1}. **${v.title}** (\`${v.severity}\`)\n`;
        md += `- **Location**: \`${v.file}\` (${v.line})\n`;
        md += `- **Breach**: ${v.breachDescription}\n`;
        md += `- **Remediation**: ${v.remediation}\n\n`;
      });
    }
    md += `\n*Automated review by ArchSense · Meta Global AI Hackathon*`;

    navigator.clipboard.writeText(md);
    setCopiedReview(true);
    setTimeout(() => setCopiedReview(false), 2000);
  };

  return (
    <div className="bg-zinc-950/70 border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col h-full shadow-2xl shadow-black/60 backdrop-blur-xl">
      {/* 1. Header Toolbar */}
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between bg-zinc-950/60">
        <div className="flex items-center space-x-2">
          {isApproved ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          )}
          <span className="text-xs font-semibold text-zinc-200 tracking-tight">Audit Decision</span>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${badgeBorder}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isApproved ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'
              }`}
            />
            {status}
          </span>
        </div>
      </div>

      {/* 2. Sleek Score & Health Summary */}
      <div className="px-4 py-3 bg-zinc-900/40 border-b border-white/[0.06]">
        <div className="flex items-end justify-between mb-1.5">
          <div className="flex items-baseline space-x-1.5">
            <span className={`text-2xl font-black tracking-tight ${statusColor}`}>
              {score}
            </span>
            <span className="text-xs text-zinc-500 font-mono">/ 100</span>
            <span className="text-[11px] text-zinc-400 ml-2 font-medium">Health Score</span>
          </div>

          <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
            <Lock className="w-3 h-3 text-indigo-400" />
            <span>{isApproved ? 'All Policies Cleared' : `${violations.length} Breach${violations.length > 1 ? 'es' : ''}`}</span>
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${progressBarColor}`}
            style={{ width: `${Math.max(score, 4)}%` }}
          />
        </div>
      </div>

      {/* 3. Sub-tabs: Anomalies vs PR Bot Comment */}
      <div className="px-4 pt-2.5 pb-2 flex items-center justify-between border-b border-white/[0.06] bg-zinc-950/40">
        <div className="flex items-center space-x-1 bg-zinc-900/80 p-0.5 rounded-lg border border-white/[0.06] text-[11px]">
          <button
            onClick={() => setActiveTab('violations')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all ${
              activeTab === 'violations'
                ? 'bg-zinc-800 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Violations ({violations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bot')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all ${
              activeTab === 'bot'
                ? 'bg-zinc-800 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bot className="w-3 h-3 text-indigo-400" />
            <span>PR Review Bot</span>
          </button>
        </div>

        {activeTab === 'bot' && (
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleCopyReview}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] border border-white/[0.06] transition-colors"
              title="Copy Markdown PR Review"
            >
              {copiedReview ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-zinc-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
            {onOpenExport && (
              <button
                onClick={onOpenExport}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-[11px] border border-indigo-500/30 transition-colors"
                title="Export Topology, Mermaid & Review"
              >
                <Share2 className="w-3 h-3 text-indigo-400" />
                <span>Export</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 4. Tab Content (Scrollable, Clean) */}
      <div className="p-4 overflow-y-auto flex-1 space-y-3 font-sans text-xs">
        {activeTab === 'violations' ? (
          <>
            {violations.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                <div className="text-sm font-semibold text-zinc-200">Zero Violations Found</div>
                <p className="text-xs text-zinc-400 mt-1">PR conforms 100% to boundary contracts.</p>
              </div>
            ) : (
              violations.map((v) => {
                const isCompliant = v.severity === 'COMPLIANT';
                return (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl border border-white/[0.06] bg-zinc-900/40 hover:border-white/[0.1] transition-all space-y-2.5"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-1.5 font-semibold text-zinc-200">
                        {isCompliant ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        )}
                        <span>{v.title}</span>
                      </div>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                          isCompliant
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {v.severity}
                      </span>
                    </div>

                    {/* File location */}
                    <div className="flex items-center space-x-1.5 text-[11px] font-mono text-zinc-400">
                      <FileCode className="w-3 h-3 text-zinc-500" />
                      <span>{v.file}</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-indigo-400 font-semibold">{v.line}</span>
                    </div>

                    {/* Breach description */}
                    <p className="text-zinc-300 text-xs leading-relaxed">
                      {v.breachDescription}
                    </p>

                    {/* Remediation */}
                    <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-white/[0.05] text-[11px] leading-relaxed">
                      <div className="flex items-center space-x-1 text-zinc-400 font-medium mb-1">
                        <ArrowRight className="w-3 h-3 text-indigo-400" />
                        <span>Remediation</span>
                      </div>
                      <div className="text-zinc-300">{v.remediation}</div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        ) : (
          /* PR Bot Comment Tab */
          <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-zinc-950/80">
            <div className="p-3 bg-zinc-900/60 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-indigo-400" />
                </div>
                <span className="font-semibold text-zinc-200 text-xs">github-actions[bot]</span>
                <span className="text-zinc-500 font-mono text-[10px]">commented just now</span>
              </div>
            </div>

            <div className="p-4 space-y-3 text-xs text-zinc-300 leading-relaxed font-sans">
              <div className="flex items-center space-x-2 font-semibold text-zinc-100">
                <span>{isApproved ? '✅' : '❌'} ArchSense Architectural Governance Check</span>
              </div>

              <p className="text-zinc-400 text-xs">
                {isApproved
                  ? 'All changes strictly adhere to declared microservice boundaries. PR is cleared for automated merge.'
                  : `Blocking Check Failed: ${violations.length} critical architectural boundary violation(s) detected.`}
              </p>

              <div className="p-2.5 rounded-lg bg-zinc-900/90 font-mono text-[11px] text-zinc-300 border border-white/[0.06] space-y-1">
                <div>Audit Score: <span className="font-bold text-white">{score}/100</span></div>
                <div>Decision: <span className="font-bold text-rose-400">{status}</span></div>
                <div>Perception Engine: <span className="text-zinc-400">Meta SAM 3.1 + Muse Spark</span></div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>Automated review by ArchSense</span>
                <span>Meta Global AI Hackathon</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
