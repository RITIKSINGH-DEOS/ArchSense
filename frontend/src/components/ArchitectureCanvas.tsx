'use client';

import React, { useState, useRef } from 'react';
import { ArchitectureNode, ArchitectureEdge } from '../data/mockScenarios';
import { Layers, Scan, UploadCloud, X, Sparkles, Sliders } from 'lucide-react';

interface Props {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  isAudited: boolean;
}

export const ArchitectureCanvas: React.FC<Props> = ({ nodes, edges, isAudited }) => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [showSamMasks, setShowSamMasks] = useState<boolean>(true);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'graph' | 'upload'>('graph');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomImage(e.target?.result as string);
        setActiveTab('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-zinc-950/70 border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col h-full shadow-2xl shadow-black/60 backdrop-blur-xl">
      {/* Sleek Toolbar */}
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between bg-zinc-950/60">
        <div className="flex items-center space-x-1 bg-zinc-900/80 p-1 rounded-xl border border-white/[0.06] text-xs">
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'graph'
                ? 'bg-zinc-800 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Living Topology</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'upload'
                ? 'bg-zinc-800 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
            <span>Custom Diagram</span>
            {customImage && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSamMasks(!showSamMasks)}
            className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all ${
              showSamMasks
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 font-medium'
                : 'bg-zinc-900 border-white/[0.06] text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>SAM 3.1 Masks: {showSamMasks ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      {activeTab === 'graph' ? (
        <div className="relative flex-1 bg-gradient-to-b from-zinc-950/50 to-black/80 flex items-center justify-center min-h-[440px] p-6 select-none overflow-hidden">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <svg viewBox="0 0 820 340" className="w-full h-full max-w-full drop-shadow-2xl">
            <defs>
              <marker id="arrow-rest" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366F1" />
              </marker>
              <marker id="arrow-grpc" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
              </marker>
              <marker id="arrow-db" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#3B82F6" />
              </marker>
              <marker id="arrow-violation" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#EF4444" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map((edge) => {
              const src = nodes.find((n) => n.id === edge.source);
              const tgt = nodes.find((n) => n.id === edge.target);
              if (!src || !tgt) return null;

              const isViolated = isAudited && edge.isViolated;
              const strokeColor = isViolated ? '#EF4444' : '#6366F1';
              const markerId = isViolated
                ? 'url(#arrow-violation)'
                : edge.protocol === 'gRPC'
                ? 'url(#arrow-grpc)'
                : edge.protocol === 'DirectDB'
                ? 'url(#arrow-db)'
                : 'url(#arrow-rest)';

              const x1 = src.x + src.width / 2;
              const y1 = src.y + src.height / 2;
              const x2 = tgt.x + tgt.width / 2;
              const y2 = tgt.y + tgt.height / 2;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2 + (isViolated ? 55 : 0);

              const pathD = isViolated
                ? `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`
                : `M ${x1} ${y1} L ${x2} ${y2}`;

              return (
                <g key={edge.id} className="cursor-pointer group">
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isViolated ? 3 : 1.8}
                    strokeDasharray={isViolated ? '6 4' : 'none'}
                    markerEnd={markerId}
                    opacity={isViolated ? 1 : 0.75}
                    className={isViolated ? 'animate-pulse' : 'transition-opacity group-hover:opacity-100'}
                  />
                  <rect
                    x={midX - 28}
                    y={midY - 9}
                    width="56"
                    height="18"
                    rx="6"
                    fill={isViolated ? '#450a0a' : '#18181b'}
                    stroke={isViolated ? '#dc2626' : '#27272a'}
                    strokeWidth="1"
                  />
                  <text
                    x={midX}
                    y={midY + 3.5}
                    textAnchor="middle"
                    fill={isViolated ? '#fca5a5' : '#a1a1aa'}
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {isViolated ? 'BREACH' : edge.protocol}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  {showSamMasks && (
                    <rect
                      x={node.x - 4}
                      y={node.y - 4}
                      width={node.width + 8}
                      height={node.height + 8}
                      rx="14"
                      fill="none"
                      stroke="#818CF8"
                      strokeWidth="1.2"
                      strokeDasharray="4 3"
                      opacity="0.6"
                    />
                  )}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    rx="12"
                    fill="#121215"
                    stroke={isSelected ? '#818CF8' : '#27272a'}
                    strokeWidth={isSelected ? 1.8 : 1}
                    className="filter drop-shadow-xl"
                  />
                  <rect
                    x={node.x}
                    y={node.y}
                    width={4}
                    height={node.height}
                    rx="2"
                    fill={node.color}
                  />
                  <text
                    x={node.x + 14}
                    y={node.y + 25}
                    fill="#F4F4F5"
                    fontSize="11.5"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x + 14}
                    y={node.y + 43}
                    fill="#71717A"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {node.type.toUpperCase()} · Egress: {node.allowedEgress.length}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Minimalist Bottom Badge */}
          <div className="absolute bottom-3 left-4 flex items-center space-x-2 text-[11px] text-zinc-500 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>Meta SAM 3.1 zero-shot perception active</span>
          </div>
        </div>
      ) : (
        /* Upload Mode */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className="relative flex-1 bg-gradient-to-b from-zinc-950/60 to-black/90 p-6 flex flex-col items-center justify-center min-h-[440px]"
        >
          {customImage ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <div className="relative max-w-full max-h-[300px] rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={customImage}
                  alt="Custom Architecture Diagram"
                  className="max-h-[300px] object-contain rounded-xl"
                />

                {showSamMasks && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-[35%] h-[40%] border-2 border-dashed border-indigo-400 bg-indigo-500/10 rounded-lg">
                      <span className="text-[9.5px] font-mono bg-indigo-950/90 border border-indigo-500/30 px-1.5 py-0.5 rounded text-indigo-300 absolute -top-3.5 left-2">
                        SAM-3.1: ServiceCluster_A (98%)
                      </span>
                    </div>
                    <div className="absolute top-[30%] right-[15%] w-[30%] h-[45%] border-2 border-dashed border-emerald-400 bg-emerald-500/10 rounded-lg">
                      <span className="text-[9.5px] font-mono bg-emerald-950/90 border border-emerald-500/30 px-1.5 py-0.5 rounded text-emerald-300 absolute -top-3.5 left-2">
                        SAM-3.1: DataSink_B (96%)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Meta SAM 3.1: 2 Clusters, 5 Ingress Nodes Segmented</span>
                </div>
                <button
                  onClick={() => setCustomImage(null)}
                  className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors border border-white/[0.06]"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full max-w-md p-10 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-950/20 shadow-2xl'
                  : 'border-white/[0.08] hover:border-zinc-700 bg-zinc-900/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-white/[0.06] flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-200">
                Upload Architecture Diagram
              </h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
                Drop your system diagram (PNG, JPEG, SVG) to extract component topology with Meta SAM 3.1
              </p>
              <div className="mt-4 text-[10px] font-mono px-3 py-1 rounded-lg bg-zinc-800/80 text-zinc-400 border border-white/[0.06]">
                PNG · JPEG · Excalidraw · Draw.io
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Node Drawer */}
      {selectedNode && activeTab === 'graph' && (
        <div className="px-4 py-2.5 border-t border-white/[0.06] bg-zinc-950 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedNode.color }}></span>
            <span className="font-semibold text-zinc-200">{selectedNode.label}</span>
            <span className="text-zinc-500 font-mono text-[11px]">({selectedNode.type})</span>
          </div>
          <div className="flex items-center space-x-2 text-zinc-400 text-xs">
            <span>Allowed Egress:</span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-white/[0.06] text-zinc-300 font-mono text-[11px]">
              {selectedNode.allowedEgress.length > 0 ? selectedNode.allowedEgress.join(', ') : 'None (Terminal)'}
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-zinc-500 hover:text-zinc-300 ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
