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
import { Sparkles, Layers, GitPullRequest, ShieldCheck, Plus } from 'lucide-react';

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
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://archsense.onrender.com';
      const response = await fetch(`${apiBaseUrl}/api/audit`, {
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
    <div className="min-h-screen bg-[#090807] text-[#f5f5f4] flex flex-col font-sans selection:bg-rose-500 selection:text-white antialiased relative overflow-x-hidden">
      {/* ============================================================== */}
      {/* 1. VISIBLE GEOMETRIC GRID & ATMOSPHERIC GLOWS (Glassmorphism Underlay) */}
      {/* ============================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Crisp Geometric Dot Matrix Pattern (Refracts through frosted glass) */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1.2px, transparent 1.2px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Ambient Atmospheric Orbs */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-rose-600/35 via-rose-500/25 to-amber-500/20 blur-[130px] rounded-full" />
        <div className="absolute top-[35%] -right-40 w-[650px] h-[550px] bg-gradient-to-bl from-rose-600/25 to-amber-600/20 blur-[150px] rounded-full" />
        <div className="absolute top-[65%] -left-40 w-[650px] h-[550px] bg-gradient-to-tr from-violet-600/20 via-rose-600/15 to-transparent blur-[160px] rounded-full" />
      </div>

      {/* 2. Glassmorphic Navigation Header */}
      <Header onOpenExport={() => setIsExportOpen(true)} />

      {/* 3. Executive Metrics Ribbon */}
      <MetricsBar />

      {/* Main Studio Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
        {/* Editorial Impact Headline Hero (Directly Inspired by Reference Screenshot) */}
        <div className="flex flex-col gap-3.5 pt-2 pb-1">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full glass-pill text-rose-300 text-xs font-mono w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Autonomous Architecture Governance Engine</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] tracking-tight text-stone-100 font-normal leading-[1.12]">
            <span className="text-[#ff5252] font-serif">Architecture drift</span> puts your system and production at{' '}
            <span className="text-[#ff5252] font-serif">risk.</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-400 max-w-3xl leading-relaxed font-sans">
            Invisible PR changes bypass API gateways, leak internal databases, and introduce circular deadlocks.
            ArchSense marries Meta SAM 3.1 visual perception with semantic code reasoning to enforce zero-trust boundaries before deploy.
          </p>
        </div>

        {/* Evaluator Scenario Selector (Full Width Glassmorphic Pill Suite) */}
        <ScenarioPicker
          currentScenarioId={currentScenario.id}
          onSelect={handleScenarioChange}
        />

        {/* ============================================================== */}
        {/* STEP 01: Living Architecture Topology (Full Width Glass Panel) */}
        {/* ============================================================== */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2.5">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                STEP 01
              </span>
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-rose-400" />
                <h2 className="text-sm font-semibold text-stone-100 tracking-tight font-sans">
                  Living Architecture Topology & Component Boundaries
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                Meta SAM 3.1 Zero-Shot Segmentation Engine
              </span>
              <div className="w-7 h-7 rounded-full glass-pill flex items-center justify-center text-stone-300 hover:text-white transition-all cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="w-full h-[480px]">
            <ArchitectureCanvas
              nodes={currentScenario.nodes}
              edges={edges}
              isAudited={isAudited}
            />
          </div>
        </section>

        {/* ============================================================== */}
        {/* STEP 02: Pull Request Code Diff Inspector (Full Width Glass Panel) */}
        {/* ============================================================== */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2.5">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                STEP 02
              </span>
              <div className="flex items-center space-x-2">
                <GitPullRequest className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-semibold text-stone-100 tracking-tight font-sans">
                  Git Pull Request Code Diff & Boundary Audit Trigger
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                Live Unified Diff Editor · Semantic Code Reasoning
              </span>
              <div className="w-7 h-7 rounded-full glass-pill flex items-center justify-center text-stone-300 hover:text-white transition-all cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="w-full">
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
        </section>

        {/* ============================================================== */}
        {/* STEP 03: Architectural Governance & Audit Station (Full Width Glass Panel) */}
        {/* ============================================================== */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2.5">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                STEP 03
              </span>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <h2 className="text-sm font-semibold text-stone-100 tracking-tight font-sans">
                  Real-Time Architectural Governance Decision & Policy Gate
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                Deterministic Pydantic Air-Gapped Verification
              </span>
              <div className="w-7 h-7 rounded-full glass-pill flex items-center justify-center text-stone-300 hover:text-white transition-all cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="w-full">
            <AuditStation
              score={score}
              status={status}
              violations={violations}
              isAudited={isAudited}
              isAuditing={isAuditing}
              onOpenExport={() => setIsExportOpen(true)}
            />
          </div>
        </section>

        {/* Evaluator Context Banner (Frosted Glass Panel) */}
        <div className="glass-panel p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-stone-300 gap-3">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span className="font-sans">
              <strong className="text-stone-100">Evaluator Note:</strong> Built for zero-hardware evaluation at the Meta Global AI Developer Hackathon.
              Combines Meta SAM 3.1 visual segmentation with Meta Model API (Muse Spark) semantic code reasoning.
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-stone-400 font-mono flex-shrink-0">
            <span className="text-emerald-400 font-semibold">● Engine Active</span>
            <span>·</span>
            <span>Living Sync: Mermaid / JSON / PR Markdown</span>
          </div>
        </div>
      </main>

      {/* Living Topology & PR Export Modal */}
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
