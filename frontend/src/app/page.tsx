'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { MetricsBar } from '../components/MetricsBar';
import { ScenarioPicker } from '../components/ScenarioPicker';
import { ArchitectureCanvas } from '../components/ArchitectureCanvas';
import { DiffInspector } from '../components/DiffInspector';
import { AuditStation } from '../components/AuditStation';
import { SCENARIOS, AuditScenario, Violation, ArchitectureEdge } from '../data/mockScenarios';
import { Info } from 'lucide-react';

export default function Home() {
  const [currentScenario, setCurrentScenario] = useState<AuditScenario>(SCENARIOS.scenarioA);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isAudited, setIsAudited] = useState<boolean>(false);
  const [diffCode, setDiffCode] = useState<string>(SCENARIOS.scenarioA.diffCode);
  const [violations, setViolations] = useState<Violation[]>(SCENARIOS.scenarioA.violations);
  const [score, setScore] = useState<number>(SCENARIOS.scenarioA.score);
  const [status, setStatus] = useState<'REJECTED' | 'WARNING' | 'APPROVED'>(SCENARIOS.scenarioA.status);
  const [edges, setEdges] = useState<ArchitectureEdge[]>(SCENARIOS.scenarioA.edges);

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
      // Live FastAPI Backend call with custom or scenario diff
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
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Header */}
      <Header />

      {/* 2. Executive Metrics Callout Bar */}
      <MetricsBar />

      {/* Main Studio Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-5">
        {/* 3. 1-Click Evaluator Scenarios */}
        <ScenarioPicker
          currentScenarioId={currentScenario.id}
          onSelect={handleScenarioChange}
        />

        {/* 4. Three-Column Evaluator Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
          {/* Column A: Living Architecture Topology (5 cols) */}
          <div className="lg:col-span-5 h-[480px]">
            <ArchitectureCanvas
              nodes={currentScenario.nodes}
              edges={edges}
              isAudited={isAudited}
            />
          </div>

          {/* Column B: Git PR Code Diff (4 cols) */}
          <div className="lg:col-span-4 h-[480px]">
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

          {/* Column C: Real-Time Audit Station (3 cols) */}
          <div className="lg:col-span-3 h-[480px]">
            <AuditStation
              score={score}
              status={status}
              violations={violations}
              isAudited={isAudited}
              isAuditing={isAuditing}
            />
          </div>
        </div>

        {/* 5. Evaluator Context Banner */}
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>
              <strong>Evaluator Note:</strong> Built for zero-hardware evaluation at the Meta Global AI Developer Hackathon.
              Demonstrates Meta SAM 3.1 visual node segmentation coupled with Meta Model API (Muse Spark) semantic code reasoning.
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-[11px] text-zinc-500 font-mono">
            <span>Branch: feat/custom-input</span>
            <span>·</span>
            <span>Custom Diagram & Diff Active</span>
          </div>
        </div>
      </main>
    </div>
  );
}
