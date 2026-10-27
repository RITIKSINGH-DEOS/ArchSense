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
  ArrowRight,
  ExternalLink,
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
      <div className="bg-zinc-950/70 border border-white/[0.08] rounded-2xl p-10 flex flex-col items-center justify-center text-center w-full min-h-[260px] shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-zinc-500 mb-3 shadow-inner">
          <ShieldAlert className="w-7 h-7 text-zinc-400" />
        </div>
        <h3 className="text-base font-semibold text-zinc-200 tracking-tight">Audit Station Standby</h3>
        <p className="text-xs text-zinc-400 max-w-md mt-2 leading-relaxed">
          Select an evaluator scenario above or edit custom PR diffs, then click{' '}
          <span className="text-indigo-400 font-semibold">Run ArchSense Boundary Audit</span> to trigger real-time architectural governance.
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
    <div className="bg-zinc-950/70 border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col w-full shadow-2xl shadow-black/60 backdrop-blur-xl">
      {/* 1. Header Toolbar */}
      <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between bg-zinc-950/60">
        <div className="flex items-center space-x-2.5">
          {isApproved ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          )}
          <div>
            <h3 className="text-sm font-semibold text-zinc-200 tracking-tight">Audit Decision Station</h3>
            <p className="text-[11px] text-zinc-500 hidden sm:block">Automated Boundary Compliance Verification</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`text-xs font-mono font-bold px-3 py-1 rounded-full border flex items-center gap-2 ${badgeBorder}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isApproved ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'
              }`}
            />
            {status}
          </span>
        </div>
      </div>

      {/* 2. Full-Width Score & Health Banner */}
      <div className="px-5 py-4 bg-zinc-900/40 border-b border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-baseline space-x-3">
          <div className="text-xs text-zinc-400 font-medium">Integrity Score:</div>
          <span className={`text-3xl font-black tracking-tight ${statusColor}`}>
            {score}
          </span>
          <span className="text-xs text-zinc-500 font-mono">/ 100</span>
          <div className="w-32 sm:w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden ml-3 inline-block">
            <div
              className={`h-full transition-all duration-500 ${progressBarColor}`}
              style={{ width: `${Math.max(score, 4)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-zinc-300 font-semibold">
              {isApproved ? '0 Violations Blocked' : `${violations.length} Critical Violations`}
            </span>
          </div>
          <span className="text-zinc-700">•</span>
          <span className="text-zinc-500">Pydantic Policy Gate Enforced</span>
        </div>
      </div>

      {/* 3. Sub-tabs Bar */}
      <div className="px-5 py-2.5 flex items-center justify-between border-b border-white/[0.06] bg-zinc-950/40">
        <div className="flex items-center space-x-1.5 bg-zinc-900/80 p-1 rounded-xl border border-white/[0.06] text-xs">
          <button
            onClick={() => setActiveTab('violations')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'violations'
                ? 'bg-zinc-800 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Detected Anomalies ({violations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bot')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'bot'
                ? 'bg-zinc-800 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>GitHub PR Bot Review</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'bot' && (
            <button
              onClick={handleCopyReview}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs border border-white/[0.06] transition-colors"
              title="Copy Markdown PR Review"
            >
              {copiedReview ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          )}

          {onOpenExport && (
            <button
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30 transition-colors"
              title="Export Full Topology & PR Sync"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export Package</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Tab Content */}
      <div className="p-5">
        {activeTab === 'violations' ? (
          <>
            {violations.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
                <div className="text-sm font-semibold text-zinc-200">Zero Architecture Boundary Violations</div>
                <p className="text-xs text-zinc-400 mt-1 max-w-md">
                  This pull request conforms 100% to declared service boundaries and permitted egress routes. Cleared for automated merge.
                </p>
              </div>
            ) : (
              /* Spacious 2-Column Responsive Grid for Full Width */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {violations.map((v) => {
                  const isCompliant = v.severity === 'COMPLIANT';
                  return (
                    <div
                      key={v.id}
                      className="p-4 rounded-xl border border-white/[0.06] bg-zinc-900/40 hover:border-white/[0.12] transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        {/* Title & Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2 font-semibold text-zinc-200 text-xs">
                            {isCompliant ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                            )}
                            <span className="leading-snug">{v.title}</span>
                          </div>
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase flex-shrink-0 ${
                              isCompliant
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            }`}
                          >
                            {v.severity}
                          </span>
                        </div>

                        {/* File & Line Location */}
                        <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-400">
                          <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{v.file}</span>
                          <span className="text-zinc-600">·</span>
                          <span className="text-indigo-400 font-semibold">{v.line}</span>
                        </div>

                        {/* Breach Description */}
                        <p className="text-zinc-300 text-xs leading-relaxed">
                          {v.breachDescription}
                        </p>
                      </div>

                      {/* Remediation Box */}
                      <div className="p-3 rounded-lg bg-zinc-950/70 border border-white/[0.05] text-xs leading-relaxed">
                        <div className="flex items-center space-x-1.5 text-indigo-400 font-medium mb-1 text-[11px]">
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>Actionable Remediation</span>
                        </div>
                        <div className="text-zinc-300 text-xs">{v.remediation}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* GitHub PR Bot Comment Tab */
          <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-zinc-950/80">
            <div className="p-3 bg-zinc-900/60 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="font-semibold text-zinc-200 text-xs">github-actions[bot]</span>
                <span className="text-zinc-500 font-mono text-[11px]">commented just now</span>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs text-zinc-300 leading-relaxed font-sans">
              <div className="flex items-center space-x-2 font-semibold text-zinc-100 text-sm">
                <span>{isApproved ? '✅' : '❌'} ArchSense Architectural Governance Check</span>
              </div>

              <p className="text-zinc-400 text-xs">
                {isApproved
                  ? 'All pull request changes strictly adhere to declared microservice boundaries. PR is cleared for automated merge.'
                  : `Blocking Check Failed: ${violations.length} critical architectural boundary violation(s) detected.`}
              </p>

              <div className="p-3 rounded-xl bg-zinc-900/90 font-mono text-xs text-zinc-300 border border-white/[0.06] space-y-1.5">
                <div>Audit Score: <span className="font-bold text-white">{score}/100</span></div>
                <div>Governance Decision: <span className={`font-bold ${isApproved ? 'text-emerald-400' : 'text-rose-400'}`}>{status}</span></div>
                <div>Perception Engine: <span className="text-zinc-400">Meta SAM 3.1 Mask Model + Muse Spark Semantic Reasoner</span></div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Automated review by ArchSense</span>
                <span>Meta Global AI Developer Hackathon</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
