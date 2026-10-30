'use client';

import React, { useState, useEffect } from 'react';
import { ArchitectureNode, ArchitectureEdge, Violation } from '../data/mockScenarios';
import { X, Copy, Check, Download, FileCode, Share2, Bot, Code } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  score: number;
  status: 'REJECTED' | 'WARNING' | 'APPROVED';
  violations: Violation[];
  prTitle: string;
}

export const ExportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  score,
  status,
  violations,
  prTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'mermaid' | 'json' | 'pr-markdown'>('mermaid');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Generate Mermaid.js
  const generateMermaid = (): string => {
    let mmd = 'graph TD\n';
    nodes.forEach((n) => {
      const cleanLabel = n.label.replace(/"/g, "'");
      mmd += `  ${n.id}["${cleanLabel} (${n.type})"]\n`;
    });
    edges.forEach((e) => {
      const marker = e.isViolated ? '==x' : '-->';
      const label = e.isViolated ? `|⚡ BREACH: ${e.protocol}|` : `|${e.protocol}|`;
      mmd += `  ${e.source} ${marker}${label} ${e.target}\n`;
    });
    return mmd;
  };

  // 2. Generate JSON Schema
  const generateJSON = (): string => {
    return JSON.stringify(
      {
        version: 'archsense.v1.0',
        generatedAt: new Date().toISOString(),
        score,
        status,
        topology: {
          nodes: nodes.map((n) => ({
            id: n.id,
            label: n.label,
            type: n.type,
            allowed_egress: n.allowedEgress,
          })),
          edges: edges.map((e) => ({
            source: e.source,
            target: e.target,
            protocol: e.protocol,
            is_violated: e.isViolated || false,
          })),
        },
        violations: violations.map((v) => ({
          rule: v.title,
          severity: v.severity,
          location: `${v.file}:${v.line}`,
          breach: v.breachDescription,
          remediation: v.remediation,
        })),
      },
      null,
      2
    );
  };

  // 3. Generate PR Markdown Review
  const generatePRMarkdown = (): string => {
    const isApproved = status === 'APPROVED';
    const statusIcon = isApproved ? '✅' : '❌';

    let md = `## ${statusIcon} ArchSense Architectural Governance Check: **${status}** (Score: ${score}/100)\n\n`;
    md += `> **PR**: ${prTitle}  \n`;
    md += `> **Audit Engine**: Meta SAM 3.1 + Muse Spark & NetworkX Graph Core  \n\n`;

    if (isApproved) {
      md += `### ✅ Clean Boundary Clearance\n`;
      md += `All code changes strictly conform to declared microservice boundaries and allowed egress routes.\n\n`;
    } else {
      md += `### ⚠️ Detected Architectural Anomalies (${violations.length})\n\n`;
      violations.forEach((v, idx) => {
        md += `#### ${idx + 1}. **${v.title}** (\`${v.severity}\`)\n`;
        md += `- **Location**: \`${v.file}\` (${v.line})\n`;
        md += `- **Boundary Flow**: \`${v.sourceNode}\` ➔ \`${v.targetNode}\`\n`;
        md += `- **Breach Description**: ${v.breachDescription}\n`;
        md += `- **Recommended Remediation**: ${v.remediation}\n\n`;
      });
    }

    md += `<details><summary><b>View Updated Living Mermaid Topology</b></summary>\n\n\`\`\`mermaid\n`;
    md += generateMermaid();
    md += `\`\`\`\n</details>\n\n`;
    md += `---\n*Automated review posted by [ArchSense](https://github.com/RITIKSINGH-DEOS/ArchSense) · Meta Global AI Hackathon 2026*`;

    return md;
  };

  const getActiveContent = (): string => {
    if (activeTab === 'mermaid') return generateMermaid();
    if (activeTab === 'json') return generateJSON();
    return generatePRMarkdown();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = getActiveContent();
    let ext = 'mmd';
    let mime = 'text/plain';
    if (activeTab === 'json') {
      ext = 'json';
      mime = 'application/json';
    } else if (activeTab === 'pr-markdown') {
      ext = 'md';
      mime = 'text/markdown';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archsense_export_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in overflow-hidden"
    >
      {/* Strict Fixed-Height Modal Card (Zero jumping between tabs) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-panel relative w-full max-w-2xl h-[580px] max-h-[90vh] rounded-3xl overflow-hidden flex flex-col transition-all duration-300 overscroll-contain"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-800/80 flex items-center justify-between bg-stone-950/60 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-100 font-sans">Export Living Topology & PR Review</h3>
              <p className="text-xs text-stone-400 font-sans">Sync living architecture with documentation and GitHub PRs</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="px-4 pt-2.5 border-b border-stone-800/70 bg-stone-950/40 flex space-x-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('mermaid')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all duration-200 font-sans ${
              activeTab === 'mermaid'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Mermaid.js Diagram</span>
          </button>

          <button
            onClick={() => setActiveTab('pr-markdown')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all duration-200 font-sans ${
              activeTab === 'pr-markdown'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>GitHub PR Review (.md)</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all duration-200 font-sans ${
              activeTab === 'json'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>JSON Schema</span>
          </button>
        </div>

        {/* Fixed Viewport with Internal Scrollbar (Strict fixed height - Zero layout shift) */}
        <div className="flex-1 p-4 bg-stone-950/60 overflow-hidden flex flex-col min-h-0">
          <pre
            key={activeTab}
            className="flex-1 p-4 rounded-2xl glass-inner overflow-y-auto font-mono text-xs text-stone-300 leading-relaxed whitespace-pre-wrap animate-fade-in shadow-inner"
          >
            {getActiveContent()}
          </pre>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-3.5 border-t border-stone-800/80 bg-stone-950/70 backdrop-blur-xl flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-stone-400 font-mono">
            {activeTab === 'mermaid' ? 'Format: Mermaid syntax' : activeTab === 'json' ? 'Format: Pydantic JSON' : 'Format: GitHub Flavored Markdown'}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-xs font-medium text-stone-200 border border-stone-800 transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold font-sans">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-sans">Copy to Clipboard</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-500 text-xs font-semibold text-white shadow-md shadow-rose-950/40 transition-all font-sans"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
