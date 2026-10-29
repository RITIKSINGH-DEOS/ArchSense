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
  Sparkles,
} from 'lucide-react';

interface Props {
  score: number;
  status: 'REJECTED' | 'WARNING' | 'APPROVED';
  violations: Violation[];
  isAudited: boolean;
  isAuditing: boolean;
  aiReasoning?: string | null;
  inferenceProvider?: string;
  onOpenExport?: () => void;
}

export const AuditStation: React.FC<Props> = ({
  score,
  status,
  violations,
  isAudited,
  isAuditing,
  aiReasoning,
  inferenceProvider,
  onOpenExport,
}) => {
  const [copiedReview, setCopiedReview] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'violations' | 'bot'>('violations');

  if (!isAudited && !isAuditing) {
    return (
      <div className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center w-full min-h-[220px] shadow-2xl transition-all duration-300">
        <div className="w-12 h-12 rounded-2xl glass-inner flex items-center justify-center text-rose-400 mb-2 shadow-inner">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-base font-normal text-stone-100 tracking-tight">Audit Station Ready</h3>
        <p className="text-xs text-stone-400 max-w-sm mt-1.5 leading-relaxed font-sans">
          Click <span className="text-rose-400 font-semibold">Run Boundary Audit</span> above to evaluate PR boundaries.
        </p>
      </div>
    );
  }

  const isApproved = status === 'APPROVED';
  const statusColor = isApproved ? 'text-emerald-400' : 'text-rose-400';
  const badgeBorder = isApproved
    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
    : 'border-rose-500/40 bg-rose-500/15 text-rose-300';
  const progressBarColor = isApproved
    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
    : 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500';

  const handleCopyReview = () => {
    let md = `## ${isApproved ? '✅' : '❌'} ArchSense Governance Check: **${status}** (${score}/100)\n\n`;
    if (isApproved) {
      md += `### ✅ Clean Clearance\nAll changes conform to microservice boundaries.\n`;
    } else {
      md += `### ⚠️ Boundary Violations (${violations.length})\n\n`;
      violations.forEach((v, idx) => {
        md += `#### ${idx + 1}. **${v.title}** (\`${v.severity}\`)\n`;
        md += `- **Location**: \`${v.file}\` (${v.line})\n`;
        md += `- **Breach**: ${v.breachDescription}\n`;
        md += `- **Remediation**: ${v.remediation}\n\n`;
      });
    }

    if (aiReasoning) {
      md += `\n### 🤖 Meta Muse Spark Semantic Reasoning (Baseten Cloud)\n${aiReasoning}\n\n`;
    }

    md += `\n*Automated review by ArchSense · Meta Global AI Hackathon*`;

    navigator.clipboard.writeText(md);
    setCopiedReview(true);
    setTimeout(() => setCopiedReview(false), 2000);
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col w-full shadow-2xl transition-all duration-300">
      {/* 1. Header Toolbar */}
      <div className="px-5 py-3 border-b border-stone-800/80 flex items-center justify-between bg-stone-950/60 backdrop-blur-xl">
        <div className="flex items-center space-x-2.5">
          {isApproved ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          )}
          <h3 className="text-xs font-semibold text-stone-100 tracking-tight font-sans">
            Audit Decision
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`text-xs font-mono font-bold px-3 py-0.5 rounded-full border flex items-center gap-1.5 transition-all duration-300 ${badgeBorder}`}
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

      {/* 2. Score Banner */}
      <div className="px-5 py-3 bg-stone-900/30 border-b border-stone-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-baseline space-x-2.5">
          <span className="text-xs text-stone-400 font-sans">Score:</span>
          <span className={`text-2xl font-black tracking-tight font-sans ${statusColor}`}>
            {score}
          </span>
          <span className="text-xs text-stone-500 font-mono">/ 100</span>
          <div className="w-28 sm:w-36 h-2 bg-stone-950 rounded-full overflow-hidden ml-2 inline-block border border-stone-800">
            <div
              className={`h-full transition-all duration-700 ease-out ${progressBarColor}`}
              style={{ width: `${Math.max(score, 4)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-stone-300">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-stone-200 font-medium">
              {isApproved ? '0 Violations' : `${violations.length} Critical Violations`}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Sub-tabs Bar */}
      <div className="px-5 py-2 flex items-center justify-between border-b border-stone-800/80 bg-stone-950/40">
        <div className="flex items-center space-x-1.5 bg-stone-950/80 p-1 rounded-xl border border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('violations')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition-all duration-200 ${
              activeTab === 'violations'
                ? 'bg-stone-800 text-white font-medium shadow-md border border-stone-700'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-sans">Violations ({violations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bot')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition-all duration-200 ${
              activeTab === 'bot'
                ? 'bg-stone-800 text-white font-medium shadow-md border border-stone-700'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-sans">PR Bot Review</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'bot' && (
            <button
              onClick={handleCopyReview}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-xl glass-pill text-stone-200 text-xs transition-colors"
            >
              {copiedReview ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-stone-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}

          {onOpenExport && (
            <button
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-xl glass-pill text-stone-200 text-xs transition-colors"
            >
              <Share2 className="w-3 h-3 text-rose-400" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Tab Content */}
      <div className="p-4 min-h-[220px] flex flex-col justify-start">
        {activeTab === 'violations' ? (
          <div className="animate-fade-in w-full">
            {violations.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                <div className="text-sm font-semibold text-stone-100 font-sans">Architecture Compliant</div>
                <p className="text-xs text-stone-400 mt-1 max-w-sm font-sans">
                  All pull request changes strictly conform to declared boundaries.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {violations.map((v) => {
                  const isCompliant = v.severity === 'COMPLIANT';
                  return (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-2xl glass-panel-subtle space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        {/* Title & Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2 font-semibold text-stone-100 text-xs font-sans">
                            {isCompliant ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                            )}
                            <span>{v.title}</span>
                          </div>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                              isCompliant
                                ? 'bg-emerald-950/80 text-emerald-300'
                                : 'bg-rose-950/80 text-rose-300'
                            }`}
                          >
                            {v.severity}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-stone-400">
                          <FileCode className="w-3 h-3 text-stone-400" />
                          <span className="text-stone-300">{v.file}</span>
                          <span>·</span>
                          <span className="text-rose-400 font-semibold">{v.line}</span>
                        </div>

                        {/* Breach */}
                        <p className="text-stone-300 text-xs leading-relaxed font-sans">
                          {v.breachDescription}
                        </p>
                      </div>

                      {/* Remediation */}
                      <div className="p-2.5 rounded-xl glass-inner text-xs leading-relaxed">
                        <div className="flex items-center space-x-1 text-rose-400 font-semibold mb-0.5 text-[10px]">
                          <ArrowRight className="w-3 h-3" />
                          <span className="font-sans">Remediation</span>
                        </div>
                        <div className="text-stone-200 text-xs font-sans">{v.remediation}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* GitHub PR Bot Comment Tab */
          <div className="glass-panel-subtle rounded-2xl overflow-hidden animate-fade-in w-full">
            <div className="p-2.5 bg-stone-950/60 border-b border-stone-800/70 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-rose-300" />
                </div>
                <span className="font-semibold text-stone-100 text-xs font-sans">github-actions[bot]</span>
                <span className="text-stone-500 font-mono text-[10px]">just now</span>
              </div>
            </div>

            <div className="p-4 space-y-3 text-xs text-stone-200 leading-relaxed font-sans">
              <div className="flex items-center space-x-2 font-semibold text-white text-xs">
                <span>{isApproved ? '✅' : '❌'} ArchSense Governance Verdict</span>
              </div>

              <div className="p-3 rounded-xl glass-inner font-mono text-xs text-stone-200 space-y-1">
                <div>Score: <span className="font-bold text-white">{score}/100</span></div>
                <div>Verdict: <span className={`font-bold ${isApproved ? 'text-emerald-400' : 'text-rose-400'}`}>{status}</span></div>
                <div>Inference: <span className="text-emerald-400">{inferenceProvider || 'Baseten Cloud (Muse Spark Open)'}</span></div>
              </div>

              {aiReasoning && (
                <div className="p-3 rounded-xl glass-inner border border-rose-500/20 text-xs text-stone-200 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-rose-400 font-semibold text-[11px] font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                    <span>Meta Muse Spark Reasoning (Baseten Cloud):</span>
                  </div>
                  <p className="text-stone-300 italic font-sans leading-relaxed text-xs">{aiReasoning}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
