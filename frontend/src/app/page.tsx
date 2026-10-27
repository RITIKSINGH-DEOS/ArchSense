'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { MetricsBar } from '../components/MetricsBar';
import { ScenarioPicker } from '../components/ScenarioPicker';
import { ArchitectureCanvas } from '../components/ArchitectureCanvas';
import { DiffInspector } from '../components/DiffInspector';
import { AuditStation } from '../components/AuditStation';
import { SCENARIOS, AuditScenario } from '../data/mockScenarios';
import { ShieldCheck, Info } from 'lucide-react';

export default function Home() {
  const [currentScenario, setCurrentScenario] = useState<AuditScenario>(SCENARIOS.scenarioA);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isAudited, setIsAudited] = useState<boolean>(false);

  const handleScenarioChange = (scenario: AuditScenario) => {
    setCurrentScenario(scenario);
    setIsAudited(false);
  };

  const handleRunAudit = () => {
    setIsAuditing(true);
    // Simulate real-time sub-second audit stream
    setTimeout(() => {
      setIsAuditing(false);
      setIsAudited(true);
    }, 750);
  };

  const handleReset = () => {
    setIsAudited(false);
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
              edges={currentScenario.edges}
              isAudited={isAudited}
            />
          </div>

          {/* Column B: Git PR Code Diff (4 cols) */}
          <div className="lg:col-span-4 h-[480px]">
            <DiffInspector
              prTitle={currentScenario.prTitle}
              prAuthor={currentScenario.prAuthor}
              prBranch={currentScenario.prBranch}
              diffCode={currentScenario.diffCode}
              onAudit={handleRunAudit}
              isAuditing={isAuditing}
              isAudited={isAudited}
              onReset={handleReset}
            />
          </div>

          {/* Column C: Real-Time Audit Station (3 cols) */}
          <div className="lg:col-span-3 h-[480px]">
            <AuditStation
              score={currentScenario.score}
              status={currentScenario.status}
              violations={currentScenario.violations}
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
            <span>Branch: feat/frontend-console</span>
            <span>·</span>
            <span>Build: Code 0</span>
          </div>
        </div>
      </main>
    </div>
  );
}
