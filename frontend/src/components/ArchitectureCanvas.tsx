'use client';

import React, { useState, useRef } from 'react';
import { ArchitectureNode, ArchitectureEdge } from '../data/mockScenarios';
import { Layers, Scan, UploadCloud, X, Sparkles } from 'lucide-react';

interface Props {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  isAudited: boolean;
}

export const ArchitectureCanvas: React.FC<Props> = ({ nodes, edges, isAudited }) => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [showSamMasks, setShowSamMasks] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'graph' | 'upload'>('graph');
  const [customImage, setCustomImage] = useState<string | null>(null);
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
    <div className="bg-zinc-900/90 border border-zinc-700/70 rounded-2xl overflow-hidden flex flex-col h-full shadow-2xl shadow-black/70 backdrop-blur-xl transition-all duration-300">
      {/* Sleek Toolbar */}
      <div className="px-5 py-3.5 border-b border-zinc-700/60 flex items-center justify-between bg-zinc-900/95">
        <div className="flex items-center space-x-1.5 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
              activeTab === 'graph'
                ? 'bg-zinc-800 text-white font-medium shadow-md border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Living Topology</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
              activeTab === 'upload'
                ? 'bg-zinc-800 text-white font-medium shadow-md border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
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
            className={`flex items-center space-x-1.5 text-xs px-3.5 py-1.5 rounded-xl border transition-all duration-200 ${
              showSamMasks
                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 font-medium shadow-sm'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>SAM 3.1 Masks: {showSamMasks ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area (Framed Studio Viewport) */}
      {activeTab === 'graph' ? (
        <div className="relative flex-1 bg-[#0a0b10] border border-zinc-800/80 rounded-xl m-3 flex items-center justify-center min-h-[420px] p-6 select-none overflow-hidden animate-fade-in shadow-inner">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#6366f1 1.2px, transparent 1.2px)',
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
                    strokeWidth={isViolated ? 3.2 : 2}
                    strokeDasharray={isViolated ? '6 4' : 'none'}
                    markerEnd={markerId}
                    opacity={isViolated ? 1 : 0.8}
                    className={isViolated ? 'animate-pulse' : 'transition-opacity duration-200 group-hover:opacity-100'}
                  />
                  <rect
                    x={midX - 28}
                    y={midY - 9}
                    width="56"
                    height="18"
                    rx="6"
                    fill={isViolated ? '#450a0a' : '#18181b'}
                    stroke={isViolated ? '#dc2626' : '#3f3f46'}
                    strokeWidth="1"
                    className="transition-colors duration-200"
                  />
                  <text
                    x={midX}
                    y={midY + 3.5}
                    textAnchor="middle"
                    fill={isViolated ? '#fca5a5' : '#e4e4e7'}
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
                  className="cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
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
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      opacity="0.7"
                    />
                  )}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    rx="12"
                    fill="#18181b"
                    stroke={isSelected ? '#818CF8' : '#3f3f46'}
                    strokeWidth={isSelected ? 2 : 1.2}
                    className="filter drop-shadow-2xl transition-colors duration-200"
                  />
                  <rect
                    x={node.x}
                    y={node.y}
                    width={5}
                    height={node.height}
                    rx="2"
                    fill={node.color}
                  />
                  <text
                    x={node.x + 14}
                    y={node.y + 25}
                    fill="#FFFFFF"
                    fontSize="11.5"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x + 14}
                    y={node.y + 43}
                    fill="#A1A1AA"
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
          <div className="absolute bottom-3 left-4 flex items-center space-x-2 text-[11px] text-zinc-400 font-mono bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800">
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
          className="relative flex-1 bg-[#0a0b10] border border-zinc-800/80 rounded-xl m-3 p-6 flex flex-col items-center justify-center min-h-[420px] animate-fade-in shadow-inner"
        >
          {customImage ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center animate-fade-in">
              <div className="relative max-w-full max-h-[300px] rounded-xl overflow-hidden border border-zinc-700 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={customImage}
                  alt="Custom Architecture Diagram"
                  className="max-h-[300px] object-contain rounded-xl"
                />

                {showSamMasks && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-[35%] h-[40%] border-2 border-dashed border-indigo-400 bg-indigo-500/10 rounded-lg">
                      <span className="text-[9.5px] font-mono bg-indigo-950/90 border border-indigo-500/40 px-1.5 py-0.5 rounded text-indigo-200 absolute -top-3.5 left-2">
                        SAM-3.1: ServiceCluster_A (98%)
                      </span>
                    </div>
                    <div className="absolute top-[30%] right-[15%] w-[30%] h-[45%] border-2 border-dashed border-emerald-400 bg-emerald-500/10 rounded-lg">
                      <span className="text-[9.5px] font-mono bg-emerald-950/90 border border-emerald-500/40 px-1.5 py-0.5 rounded text-emerald-200 absolute -top-3.5 left-2">
                        SAM-3.1: DataSink_B (96%)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-xs text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Meta SAM 3.1: 2 Clusters, 5 Ingress Nodes Segmented</span>
                </div>
                <button
                  onClick={() => setCustomImage(null)}
                  className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors duration-200 border border-zinc-700"
                >
                  <X className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Remove Image</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full max-w-md p-10 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-950/30 shadow-2xl'
                  : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/60'
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
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-100">
                Upload Architecture Diagram
              </h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
                Drop your system diagram (PNG, JPEG, SVG) to extract component topology with Meta SAM 3.1
              </p>
              <div className="mt-4 text-[10px] font-mono px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700">
                PNG · JPEG · Excalidraw · Draw.io
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Node Drawer */}
      {selectedNode && activeTab === 'graph' && (
        <div className="px-5 py-3 border-t border-zinc-700/60 bg-zinc-900/95 flex items-center justify-between text-xs animate-fade-in transition-all duration-200">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedNode.color }}></span>
            <span className="font-semibold text-zinc-100">{selectedNode.label}</span>
            <span className="text-zinc-400 font-mono text-[11px]">({selectedNode.type})</span>
          </div>
          <div className="flex items-center space-x-3 text-zinc-300 text-xs">
            <span>Allowed Egress:</span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-[11px]">
              {selectedNode.allowedEgress.length > 0 ? selectedNode.allowedEgress.join(', ') : 'None (Terminal)'}
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-zinc-400 hover:text-zinc-200 ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
