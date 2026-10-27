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

  if (!isAudited && !isAuditing) {
    return (
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
        <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400 mb-3">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">Audit Station Idle</h3>
        <p className="text-xs text-zinc-400 max-w-sm mt-1">
          Select an evaluator scenario or paste a custom PR diff, then click{' '}
          <strong className="text-indigo-400">Run ArchSense Boundary Audit</strong> to inspect system violations.
        </p>
      </div>
    );
  }

  const isApproved = status === 'APPROVED';
  const statusColor = isApproved ? 'text-emerald-400' : 'text-rose-400';
  const badgeBg = isApproved
    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
    : 'bg-rose-950/60 text-rose-400 border-rose-800/40';

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
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      {/* Header with Score */}
      <div className="p-3 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isApproved ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          )}
          <span className="text-sm font-semibold text-zinc-200">Audit Governance Decision</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${badgeBg}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[600px]">
        {/* Score Card */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-400 font-medium">Architecture Integrity Score</div>
            <div className={`text-3xl font-black tracking-tight ${statusColor}`}>
              {score}
              <span className="text-zinc-600 text-sm font-normal"> / 100</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-zinc-500 font-mono">Pydantic Policy Gate</div>
            <div className="text-xs font-semibold text-zinc-300 flex items-center gap-1 justify-end">
              <Lock className="w-3 h-3 text-indigo-400" />
              {isApproved ? '0 Violations Blocked' : `${violations.length} Critical Violations`}
            </div>
          </div>
        </div>

        {/* Violations List */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Detected Architectural Anomalies ({violations.length})
          </div>

          {violations.map((v) => {
            const isCompliant = v.severity === 'COMPLIANT';
            return (
              <div
                key={v.id}
                className={`p-3 rounded-lg border text-xs ${
                  isCompliant
                    ? 'bg-emerald-950/20 border-emerald-800/30'
                    : 'bg-rose-950/20 border-rose-800/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                    {isCompliant ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    <span>{v.title}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                      isCompliant
                        ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50'
                        : 'bg-rose-900/40 text-rose-300 border-rose-700/50'
                    }`}
                  >
                    {v.severity}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-zinc-400 font-mono mb-2">
                  <FileCode className="w-3 h-3 text-zinc-500" />
                  <span>{v.file}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-indigo-400">{v.line}</span>
                </div>

                <p className="text-zinc-300 text-[11px] leading-relaxed mb-2">
                  {v.breachDescription}
                </p>

                <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800/80 text-[11px]">
                  <strong className="text-zinc-400 block mb-0.5">Recommended Remediation:</strong>
                  <span className="text-zinc-300">{v.remediation}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* GitHub PR Bot Comment Mockup & Sync Action */}
        <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
          <div className="p-2.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-zinc-200">github-actions[bot]</span>
              <span className="text-zinc-500 font-mono text-[11px]">commented just now</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleCopyReview}
                className="flex items-center space-x-1 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] border border-zinc-700 transition-colors"
                title="Copy Markdown PR Comment"
              >
                {copiedReview ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>

              {onOpenExport && (
                <button
                  onClick={onOpenExport}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 text-[11px] border border-indigo-500/40 transition-colors"
                  title="Open Full Export Modal"
                >
                  <Share2 className="w-3 h-3 text-indigo-400" />
                  <span>Export</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-3 text-xs text-zinc-300 space-y-2">
            <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
              <span>🏛️ ArchSense Architecture Guardrail Report</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {isApproved
                ? '✅ All code diffs strictly adhere to declared microservice boundaries. PR is cleared for merge.'
                : '❌ Blocking Check Failed: 1 or more unauthorized architectural boundaries breached.'}
            </p>
            <div className="p-2 rounded bg-zinc-900 font-mono text-[10px] text-zinc-400 border border-zinc-800">
              Audit Score: {score}/100 | Status: {status} | Engine: Meta SAM 3.1 + Muse Spark
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
