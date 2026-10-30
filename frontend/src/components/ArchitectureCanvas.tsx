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
        setShowSamMasks(true);
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
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-full shadow-2xl transition-all duration-300">
      {/* Sleek Toolbar */}
      <div className="px-5 py-3 border-b border-stone-800/80 flex items-center justify-between bg-stone-950/60 backdrop-blur-xl">
        <div className="flex items-center space-x-1.5 bg-stone-950/90 p-1 rounded-xl border border-stone-800/80 text-xs">
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              activeTab === 'graph'
                ? 'bg-stone-800/90 text-white font-medium shadow-md border border-stone-700/80'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-sans">Topology</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              activeTab === 'upload'
                ? 'bg-stone-800/90 text-white font-medium shadow-md border border-stone-700/80'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-sans">Upload Diagram</span>
            {customImage && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSamMasks(!showSamMasks)}
            className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all duration-200 ${
              showSamMasks
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold shadow-sm'
                : 'bg-stone-900/70 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Scan className={`w-3.5 h-3.5 ${showSamMasks ? 'text-emerald-400' : 'text-stone-400'}`} />
            <span className="font-sans">SAM 3.1 Masks: {showSamMasks ? 'ON' : 'OFF'}</span>
            {showSamMasks && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Area (Framed Studio Viewport) */}
      {activeTab === 'graph' ? (
        <div className="relative flex-1 glass-inner rounded-2xl m-3 flex items-center justify-center min-h-[420px] p-6 select-none overflow-hidden animate-fade-in shadow-inner">
          {/* Subtle warm amber/coral grid pattern */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(244, 63, 94, 0.5) 1.2px, transparent 1.2px)',
              backgroundSize: '24px 24px',
            }}
          />

          <svg viewBox="0 0 820 340" className="w-full h-full max-w-full drop-shadow-2xl">
            <defs>
              <marker id="arrow-rest" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
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
              const strokeColor = isViolated ? '#EF4444' : '#71717a';
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
                    opacity={isViolated ? 1 : 0.85}
                    className={isViolated ? 'animate-pulse' : 'transition-opacity duration-200 group-hover:opacity-100'}
                  />
                  <rect
                    x={midX - 28}
                    y={midY - 9}
                    width="56"
                    height="18"
                    rx="6"
                    fill={isViolated ? '#450a0a' : '#1c1917'}
                    stroke={isViolated ? '#dc2626' : '#44403c'}
                    strokeWidth="1"
                    className="transition-colors duration-200"
                  />
                  <text
                    x={midX}
                    y={midY + 3.5}
                    textAnchor="middle"
                    fill={isViolated ? '#fca5a5' : '#e7e5e4'}
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
                      stroke="#f43f5e"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      opacity="0.65"
                    />
                  )}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    rx="12"
                    fill="#181513"
                    stroke={isSelected ? '#f43f5e' : '#3f3a36'}
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
                    fill="#F5F5F4"
                    fontSize="11.5"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x + 14}
                    y={node.y + 43}
                    fill="#A8A29E"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {node.type.toUpperCase()} · Egress: {node.allowedEgress.length}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        /* Upload Mode */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className="relative flex-1 glass-inner rounded-2xl m-3 p-6 flex flex-col items-center justify-center min-h-[420px] animate-fade-in shadow-inner"
        >
          {customImage ? (
            <div className="relative w-full h-full flex flex-col items-center justify-between py-2 animate-fade-in">
              <div className="relative max-w-full max-h-[240px] rounded-2xl overflow-hidden border border-stone-700/80 shadow-2xl flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={customImage}
                  alt="Custom Architecture Diagram"
                  className="max-h-[240px] w-auto object-contain rounded-2xl"
                />

                {showSamMasks && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-[35%] h-[40%] border-2 border-dashed border-rose-400 bg-rose-500/10 rounded-lg">
                      <span className="text-[9.5px] font-mono bg-rose-950/90 border border-rose-500/40 px-1.5 py-0.5 rounded text-rose-200 absolute -top-3.5 left-2">
                        SAM-3.1: ServiceCluster_A (98%)
                      </span>
                    </div>
                    <div className="absolute top-[30%] right-[15%] w-[30%] h-[45%] border-2 border-dashed border-amber-400 bg-amber-500/10 rounded-lg">
                      <span className="text-[9.5px] font-mono bg-amber-950/90 border border-amber-500/40 px-1.5 py-0.5 rounded text-amber-200 absolute -top-3.5 left-2">
                        SAM-3.1: DataSink_B (96%)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 mb-2 flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-sans font-medium">Meta SAM 3.1: Segmented</span>
                </div>
                <button
                  onClick={() => setCustomImage(null)}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-xs text-stone-300 hover:text-white transition-all duration-200 border border-stone-700/80 shadow-sm"
                >
                  <X className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-sans">Remove</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full max-w-md p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-rose-500 bg-rose-950/20 shadow-2xl'
                  : 'border-stone-700/80 hover:border-stone-500 bg-stone-900/40'
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
              <div className="w-10 h-10 rounded-xl bg-stone-800/80 border border-stone-700 flex items-center justify-center text-rose-400 mb-2 shadow-inner">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-semibold text-stone-100 font-sans">
                Drop System Diagram
              </h4>
              <p className="text-[11px] text-stone-400 mt-1 max-w-xs leading-relaxed font-sans">
                PNG, JPEG, or SVG architecture diagram to parse with Meta SAM 3.1
              </p>
            </div>
          )}
        </div>
      )}

      {/* Selected Node Drawer */}
      {selectedNode && activeTab === 'graph' && (
        <div className="px-5 py-2.5 border-t border-stone-800/80 bg-stone-950/80 backdrop-blur-xl flex items-center justify-between text-xs animate-fade-in transition-all duration-200">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedNode.color }}></span>
            <span className="font-semibold text-stone-100">{selectedNode.label}</span>
            <span className="text-stone-400 font-mono text-[10px]">({selectedNode.type})</span>
          </div>
          <div className="flex items-center space-x-3 text-stone-300 text-xs">
            <span>Allowed Egress:</span>
            <span className="px-2 py-0.5 rounded-md bg-stone-800 border border-stone-700 text-stone-200 font-mono text-[11px]">
              {selectedNode.allowedEgress.length > 0 ? selectedNode.allowedEgress.join(', ') : 'None (Terminal)'}
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-stone-400 hover:text-stone-200 ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
