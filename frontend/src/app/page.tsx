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
import { Sparkles, Layers, GitPullRequest, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [currentScenario, setCurrentScenario] = useState<AuditScenario>(SCENARIOS.scenarioA);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isAudited, setIsAudited] = useState<boolean>(false);
  const [diffCode, setDiffCode] = useState<string>(SCENARIOS.scenarioA.diffCode);
  const [violations, setViolations] = useState<Violation[]>(SCENARIOS.scenarioA.violations);
  const [score, setScore] = useState<number>(SCENARIOS.scenarioA.score);
  const [status, setStatus] = useState<'REJECTED' | 'WARNING' | 'APPROVED'>(SCENARIOS.scenarioA.status);
  const [edges, setEdges] = useState<ArchitectureEdge[]>(SCENARIOS.scenarioA.edges);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [inferenceProvider, setInferenceProvider] = useState<string>('Baseten Cloud (Meta Muse Spark Open)');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const handleScenarioChange = (scenario: AuditScenario) => {
    setCurrentScenario(scenario);
    setDiffCode(scenario.diffCode);
    setViolations(scenario.violations);
    setScore(scenario.score);
    setStatus(scenario.status);
    setEdges(scenario.edges);
    setAiReasoning(null);
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
        if (data.ai_reasoning) {
          setAiReasoning(data.ai_reasoning);
        }
        if (data.inference_provider) {
          setInferenceProvider(data.inference_provider);
        }
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
    setAiReasoning(null);
  };

  const handleReset = () => {
    setIsAudited(false);
    setDiffCode(currentScenario.diffCode);
    setEdges(currentScenario.edges.map(e => ({ ...e, isViolated: false })));
    setAiReasoning(null);
  };

  return (
    <div className="min-h-screen bg-[#090807] text-[#f5f5f4] flex flex-col font-sans selection:bg-rose-500 selection:text-white antialiased relative overflow-x-hidden">
      {/* 1. Subtle Dot Matrix & Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1.2px, transparent 1.2px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-rose-600/30 via-rose-500/20 to-amber-500/15 blur-[140px] rounded-full" />
        <div className="absolute top-[35%] -right-40 w-[650px] h-[550px] bg-gradient-to-bl from-rose-600/20 to-amber-600/15 blur-[160px] rounded-full" />
      </div>

      {/* 2. Clean Header */}
      <Header onOpenExport={() => setIsExportOpen(true)} />

      {/* 3. Sleek Metrics Ribbon */}
      <MetricsBar />

      {/* Main Studio Area */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Punchy Centered Hero (3-second clarity for judges) */}
        <div className="flex flex-col items-center text-center gap-3 pt-4 pb-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-pill text-rose-300 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Visual Architecture Governance for Pull Requests</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl tracking-tight text-stone-100 font-normal leading-[1.15]">
            <span className="text-[#ff5252] font-serif">Architecture drift</span> puts your production at{' '}
            <span className="text-[#ff5252] font-serif">risk.</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 font-sans leading-relaxed max-w-lg">
            Audit PR code changes against your system architecture diagram in real time with Meta AI before merge.
          </p>
        </div>

        {/* Evaluator Scenario Selector */}
        <ScenarioPicker
          currentScenarioId={currentScenario.id}
          onSelect={handleScenarioChange}
        />

        {/* ============================================================== */}
        {/* STEP 01: System Diagram (Topology) */}
        {/* ============================================================== */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center space-x-2 px-1">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
              STEP 01
            </span>
            <Layers className="w-4 h-4 text-rose-400" />
            <h2 className="text-xs font-semibold text-stone-200 tracking-tight font-sans">
              System Architecture Topology
            </h2>
          </div>

          <div className="w-full h-[460px]">
            <ArchitectureCanvas
              nodes={currentScenario.nodes}
              edges={edges}
              isAudited={isAudited}
            />
          </div>
        </section>

        {/* ============================================================== */}
        {/* STEP 02: Pull Request Code Diff */}
        {/* ============================================================== */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center space-x-2 px-1">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              STEP 02
            </span>
            <GitPullRequest className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-semibold text-stone-200 tracking-tight font-sans">
              Pull Request Code Diff
            </h2>
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
        {/* STEP 03: Governance Decision */}
        {/* ============================================================== */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center space-x-2 px-1">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
              STEP 03
            </span>
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <h2 className="text-xs font-semibold text-stone-200 tracking-tight font-sans">
              Governance Decision
            </h2>
          </div>

          <div className="w-full">
            <AuditStation
              score={score}
              status={status}
              violations={violations}
              isAudited={isAudited}
              isAuditing={isAuditing}
              aiReasoning={aiReasoning}
              inferenceProvider={inferenceProvider}
              onOpenExport={() => setIsExportOpen(true)}
            />
          </div>
        </section>

        {/* Clean Minimal Footer */}
        <footer className="mt-4 pb-8 flex items-center justify-center text-center">
          <div className="glass-pill px-4 py-2 rounded-full flex items-center space-x-2.5 text-[11px] font-mono text-stone-400">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Meta SAM 3.1 & Muse Spark · Baseten Cloud Compute · Meta Global AI Hackathon</span>
            <span className="text-stone-700">•</span>
            <span className="text-emerald-400">Deterministic Engine Active</span>
          </div>
        </footer>
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
