'use client';

import React, { useState } from 'react';
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
            allowedEgress: n.allowedEgress,
          })),
          edges: edges.map((e) => ({
            source: e.source,
            target: e.target,
            protocol: e.protocol,
            isViolated: e.isViolated || false,
          })),
        },
        violationsCount: violations.length,
      },
      null,
      2
    );
  };

  // 3. Generate GitHub PR Comment Markdown
  const generatePRMarkdown = (): string => {
    const isApproved = status === 'APPROVED';
    const statusIcon = isApproved ? '✅' : '❌';
    const badgeColor = isApproved ? 'success' : 'critical';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Export Living Topology & PR Review</h3>
              <p className="text-xs text-zinc-400">Sync living architecture with documentation and GitHub PRs</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="px-4 pt-3 border-b border-zinc-800 bg-zinc-950 flex space-x-2">
          <button
            onClick={() => setActiveTab('mermaid')}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'mermaid'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Mermaid.js Diagram</span>
          </button>

          <button
            onClick={() => setActiveTab('pr-markdown')}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'pr-markdown'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>GitHub PR Review (.md)</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'json'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>JSON Schema</span>
          </button>
        </div>

        {/* Code Content Box */}
        <div className="flex-1 p-4 bg-zinc-950 overflow-auto font-mono text-xs text-zinc-300 leading-relaxed max-h-[380px]">
          <pre className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/80 overflow-x-auto whitespace-pre-wrap">
            {getActiveContent()}
          </pre>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-3.5 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-mono">
            {activeTab === 'mermaid' ? 'Format: Mermaid syntax' : activeTab === 'json' ? 'Format: Pydantic JSON' : 'Format: GitHub Flavored Markdown'}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 border border-zinc-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all"
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
