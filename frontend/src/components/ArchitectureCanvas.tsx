'use client';

import React, { useState } from 'react';
import { ArchitectureNode, ArchitectureEdge } from '../data/mockScenarios';
import { Layers, Scan, Info, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  isAudited: boolean;
}

export const ArchitectureCanvas: React.FC<Props> = ({ nodes, edges, isAudited }) => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [showSamMasks, setShowSamMasks] = useState<boolean>(true);

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      {/* Header toolbar */}
      <div className="p-3 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-zinc-200">Living Architecture Topology</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
            {nodes.length} nodes · {edges.length} edges
          </span>
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
            <span>SAM 3.1 Masks: {showSamMasks ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative flex-1 bg-zinc-950/90 overflow-hidden flex items-center justify-center min-h-[340px] p-4 select-none">
        {/* Subtle grid pattern */}
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

            // Curved path if illegal violation
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
                {/* Edge Protocol Tag */}
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
                {/* SAM 3.1 Segmentation Bounding Box Overlay */}
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

                {/* Node Box */}
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

                {/* Node Type Indicator Bar */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={4}
                  height={node.height}
                  rx="2"
                  fill={node.color}
                />

                {/* Node Label */}
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

                {/* Node Type Subtitle */}
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

        {/* SAM 3.1 Badge at bottom left of canvas */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400">
          <Scan className="w-3.5 h-3.5 text-indigo-400" />
          <span>Meta SAM 3.1 zero-shot topology extraction active</span>
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
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
