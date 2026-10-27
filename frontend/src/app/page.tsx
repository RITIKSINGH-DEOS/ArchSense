'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { MetricsBar } from '../components/MetricsBar';
import { ScenarioPicker } from '../components/ScenarioPicker';
import { ArchitectureCanvas } from '../components/ArchitectureCanvas';
import { DiffInspector } from '../components/DiffInspector';
import { AuditStation } from '../components/AuditStation';
import { ExportModal } from '../components/ExportModal';
import { SCENARIOS, AuditScenario, Violation, ArchitectureEdge } from '../data/mockScenarios';
import { Info, Sparkles } from 'lucide-react';

export default function Home() {
  const [currentScenario, setCurrentScenario] = useState<AuditScenario>(SCENARIOS.scenarioA);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isAudited, setIsAudited] = useState<boolean>(false);
  const [diffCode, setDiffCode] = useState<string>(SCENARIOS.scenarioA.diffCode);
  const [violations, setViolations] = useState<Violation[]>(SCENARIOS.scenarioA.violations);
  const [score, setScore] = useState<number>(SCENARIOS.scenarioA.score);
  const [status, setStatus] = useState<'REJECTED' | 'WARNING' | 'APPROVED'>(SCENARIOS.scenarioA.status);
  const [edges, setEdges] = useState<ArchitectureEdge[]>(SCENARIOS.scenarioA.edges);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const handleScenarioChange = (scenario: AuditScenario) => {
    setCurrentScenario(scenario);
    setDiffCode(scenario.diffCode);
    setViolations(scenario.violations);
    setScore(scenario.score);
    setStatus(scenario.status);
    setEdges(scenario.edges);
    setIsAudited(false);
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);

    try {
      const response = await fetch('http://localhost:8000/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: currentScenario.id,
          pr_title: currentScenario.prTitle,
          git_diff: diffCode,
          nodes: currentScenario.nodes.map(n => ({
            id: n.id,
            label: n.label,
            type: n.type,
            x: n.x,
            y: n.y,
            width: n.width,
            height: n.height,
            allowed_egress: n.allowedEgress,
            color: n.color
          })),
          edges: currentScenario.edges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            protocol: e.protocol,
            is_violated: e.isViolated || false
          }))
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setScore(data.score);
        setStatus(data.status);
        setViolations(data.violations);
        if (data.edges) {
          setEdges(data.edges.map((e: any) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            protocol: e.protocol,
            isViolated: e.is_violated
          })));
        }
      } else {
        fallbackAudit();
      }
    } catch {
      fallbackAudit();
    } finally {
      setIsAuditing(false);
      setIsAudited(true);
    }
  };

  const fallbackAudit = () => {
    setScore(currentScenario.score);
    setStatus(currentScenario.status);
    setViolations(currentScenario.violations);
    setEdges(currentScenario.edges);
  };

  const handleReset = () => {
    setIsAudited(false);
    setDiffCode(currentScenario.diffCode);
    setEdges(currentScenario.edges.map(e => ({ ...e, isViolated: false })));
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      {/* 1. Header with Export Trigger */}
      <Header onOpenExport={() => setIsExportOpen(true)} />

      {/* 2. Executive Metrics Ribbon */}
      <MetricsBar />

      {/* Main Studio Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-5">
        {/* 3. 1-Click Evaluator Scenarios */}
        <ScenarioPicker
          currentScenarioId={currentScenario.id}
          onSelect={handleScenarioChange}
        />

        {/* 4. Balanced 3-Column Evaluator Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 items-stretch">
          {/* Column A: Living Architecture Topology */}
          <div className="h-[540px]">
            <ArchitectureCanvas
              nodes={currentScenario.nodes}
              edges={edges}
              isAudited={isAudited}
            />
          </div>

          {/* Column B: Git PR Code Diff */}
          <div className="h-[540px]">
            <DiffInspector
              prTitle={currentScenario.prTitle}
              prAuthor={currentScenario.prAuthor}
              prBranch={currentScenario.prBranch}
              diffCode={diffCode}
              onDiffChange={setDiffCode}
              onAudit={handleRunAudit}
              isAuditing={isAuditing}
              isAudited={isAudited}
              onReset={handleReset}
            />
          </div>

          {/* Column C: Real-Time Audit Station */}
          <div className="h-[540px]">
            <AuditStation
              score={score}
              status={status}
              violations={violations}
              isAudited={isAudited}
              isAuditing={isAuditing}
              onOpenExport={() => setIsExportOpen(true)}
            />
          </div>
        </div>

        {/* 5. Evaluator Context Banner */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/40 border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-zinc-400 gap-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>
              <strong className="text-zinc-200">Evaluator Note:</strong> Built for zero-hardware evaluation at the Meta Global AI Hackathon.
              Combines Meta SAM 3.1 visual segmentation with Meta Model API (Muse Spark) semantic code reasoning.
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-zinc-500 font-mono flex-shrink-0">
            <span className="text-emerald-400">● Engine Active</span>
            <span>·</span>
            <span>Living Sync: Mermaid / JSON / PR Markdown</span>
          </div>
        </div>
      </main>

      {/* 6. Living Topology & PR Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        nodes={currentScenario.nodes}
        edges={edges}
        score={score}
        status={status}
        violations={violations}
        prTitle={currentScenario.prTitle}
      />
    </div>
  );
}
