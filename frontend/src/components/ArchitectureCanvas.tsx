'use client';

import React, { useState, useRef } from 'react';
import { ArchitectureNode, ArchitectureEdge } from '../data/mockScenarios';
import { Layers, Scan, UploadCloud, Image as ImageIcon, X, Sparkles } from 'lucide-react';

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
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      {/* Header toolbar */}
      <div className="p-3 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Tab Selector */}
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveTab('graph')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'graph'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Topology Graph</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'upload'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
              <span>Upload Custom Diagram</span>
              {customImage && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSamMasks(!showSamMasks)}
            className={`flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors ${
              showSamMasks
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>SAM 3.1: {showSamMasks ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'graph' ? (
        <div className="relative flex-1 bg-zinc-950/90 overflow-hidden flex items-center justify-center min-h-[340px] p-4 select-none">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <svg viewBox="0 0 820 340" className="w-full h-full max-w-full drop-shadow-md">
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
              const strokeColor = isViolated ? '#EF4444' : '#4F46E5';
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
              const midY = (y1 + y2) / 2 + (isViolated ? 60 : 0);

              const pathD = isViolated
                ? `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`
                : `M ${x1} ${y1} L ${x2} ${y2}`;

              return (
                <g key={edge.id} className="cursor-pointer">
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isViolated ? 3 : 2}
                    strokeDasharray={isViolated ? '6 4' : 'none'}
                    markerEnd={markerId}
                    className={isViolated ? 'animate-pulse' : ''}
                  />
                  <rect
                    x={midX - 32}
                    y={midY - 10}
                    width="64"
                    height="18"
                    rx="4"
                    fill={isViolated ? '#450a0a' : '#18181b'}
                    stroke={isViolated ? '#dc2626' : '#27272a'}
                    strokeWidth="1"
                  />
                  <text
                    x={midX}
                    y={midY + 3}
                    textAnchor="middle"
                    fill={isViolated ? '#fca5a5' : '#a1a1aa'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {isViolated ? '⚡ BREACH' : edge.protocol}
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
                      rx="10"
                      fill="none"
                      stroke="#818CF8"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      opacity="0.8"
                    />
                  )}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    rx="8"
                    fill="#18181b"
                    stroke={isSelected ? '#6366F1' : '#27272a'}
                    strokeWidth={isSelected ? 2 : 1}
                    className="filter drop-shadow-lg"
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
                    x={node.x + 12}
                    y={node.y + 26}
                    fill="#F4F4F5"
                    fontSize="12"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x + 12}
                    y={node.y + 44}
                    fill="#71717A"
                    fontSize="9.5"
                    fontFamily="monospace"
                  >
                    {node.type.toUpperCase()} · Egress: {node.allowedEgress.length}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400">
            <Scan className="w-3.5 h-3.5 text-indigo-400" />
            <span>Meta SAM 3.1 zero-shot topology extraction active</span>
          </div>
        </div>
      ) : (
        /* Upload Mode */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className="relative flex-1 bg-zinc-950 p-6 flex flex-col items-center justify-center min-h-[340px]"
        >
          {customImage ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <div className="relative max-w-full max-h-[260px] rounded-lg overflow-hidden border border-zinc-800 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={customImage}
                  alt="Custom Architecture Diagram"
                  className="max-h-[260px] object-contain"
                />

                {/* SAM 3.1 Simulated Vision Overlay Boxes */}
                {showSamMasks && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-[35%] h-[40%] border-2 border-dashed border-indigo-400 bg-indigo-500/10 rounded-md">
                      <span className="text-[10px] font-mono bg-indigo-950 px-1 py-0.5 rounded text-indigo-300 absolute -top-4 left-0">
                        SAM-3.1: ServiceCluster_A (98%)
                      </span>
                    </div>
                    <div className="absolute top-[30%] right-[15%] w-[30%] h-[45%] border-2 border-dashed border-emerald-400 bg-emerald-500/10 rounded-md">
                      <span className="text-[10px] font-mono bg-emerald-950 px-1 py-0.5 rounded text-emerald-300 absolute -top-4 left-0">
                        SAM-3.1: DataSink_B (96%)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/40 text-xs text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Meta SAM 3.1: Custom Topology Extracted (2 Clusters, 5 Ingress Nodes)</span>
                </div>
                <button
                  onClick={() => setCustomImage(null)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full max-w-md p-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-950/20'
                  : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40'
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
              <div className="w-12 h-12 rounded-xl bg-zinc-800/80 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-200">
                Upload Custom Architecture Diagram
              </h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                Drag and drop your Excalidraw, Draw.io, or PNG architecture diagram here to segment with Meta SAM 3.1
              </p>
              <div className="mt-4 text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                Supports PNG, JPEG, SVG up to 15MB
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Node Details Drawer */}
      {selectedNode && activeTab === 'graph' && (
        <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedNode.color }}></span>
            <span className="font-semibold text-zinc-200">{selectedNode.label}</span>
            <span className="text-zinc-500 font-mono">({selectedNode.type})</span>
          </div>
          <div className="flex items-center space-x-2 text-zinc-400">
            <span>Allowed Egress Boundaries:</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">
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
