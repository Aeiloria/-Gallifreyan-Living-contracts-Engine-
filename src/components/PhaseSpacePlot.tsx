/**
 * @file PhaseSpacePlot.tsx
 * Phase Space Vector Orbit Plot (State x vs State z)
 * Visualizes stability basins and perturbation trajectories.
 */

import React from 'react';
import { StateClassification, StateVector } from '../types/engine';

interface PhaseSpacePlotProps {
  stateA: StateVector;
  stateB: StateVector;
  classification: StateClassification;
  progress: number;
}

export const PhaseSpacePlot: React.FC<PhaseSpacePlotProps> = ({
  stateA,
  stateB,
  classification,
  progress,
}) => {
  const width = 240;
  const height = 140;
  const padding = 24;

  // Coordinate mapping
  // X axis: Node A coordinate [0, 2.0]
  // Y axis: Node B coordinate [0, 2.0]
  const mapX = (val: number) => padding + (val / 2.0) * (width - padding * 2);
  const mapY = (val: number) => height - padding - (val / 2.0) * (height - padding * 2);

  // Generate Trajectory Points across 4 stages
  // Stage A: (x_A, x_B)
  const pA = { x: mapX(stateA.x), y: mapY(stateB.x) };
  // Stage B: Applied V1 midpoint
  const pB = { x: mapX((stateA.x + stateA.z) / 2), y: mapY((stateB.x + stateB.z) / 2) };
  // Stage C: (z_A, z_B)
  const pC = { x: mapX(stateA.z), y: mapY(stateB.z) };
  // Stage D: (z'_A, z'_B)
  const pD = { x: mapX(stateA.zPrime), y: mapY(stateB.zPrime) };

  // Current active cursor based on playback progress
  let curX = pA.x;
  let curY = pA.y;
  if (progress <= 0.33) {
    const t = progress / 0.33;
    curX = pA.x + (pB.x - pA.x) * t;
    curY = pA.y + (pB.y - pA.y) * t;
  } else if (progress <= 0.66) {
    const t = (progress - 0.33) / 0.33;
    curX = pB.x + (pC.x - pB.x) * t;
    curY = pB.y + (pC.y - pB.y) * t;
  } else {
    const t = (progress - 0.66) / 0.34;
    curX = pC.x + (pD.x - pC.x) * t;
    curY = pC.y + (pD.y - pC.y) * t;
  }

  const strokeColor =
    classification === 'SELF_SUSTAINING'
      ? '#38bdf8'
      : classification === 'FORCED'
      ? '#64748b'
      : '#f59e0b';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex flex-col gap-1.5 font-mono text-[10px]">
      <div className="flex items-center justify-between text-slate-400">
        <span className="font-bold tracking-wider uppercase">PHASE SPACE [x vs z]</span>
        <span className="text-cyan-400">STATE TRAJECTORY</span>
      </div>

      <svg width={width} height={height} className="w-full bg-slate-950/80 rounded border border-slate-800/80">
        {/* Grid lines */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#334155" strokeWidth="1" />
        <line x1={padding} y1={padding + (height - padding * 2) / 2} x2={width - padding} y2={padding + (height - padding * 2) / 2} stroke="#1e293b" strokeDasharray="2 2" />
        <line x1={padding + (width - padding * 2) / 2} y1={padding} x2={padding + (width - padding * 2) / 2} y2={height - padding} stroke="#1e293b" strokeDasharray="2 2" />

        {/* Diagonal sovereign balance line (x = y) */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={padding} stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

        {/* Trajectory curve */}
        <path
          d={`M ${pA.x} ${pA.y} Q ${pB.x} ${pB.y} ${pC.x} ${pC.y} T ${pD.x} ${pD.y}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeDasharray={classification === 'FORCED' ? '4 2' : undefined}
        />

        {/* Key Stage Keypoints */}
        <circle cx={pA.x} cy={pA.y} r="3" fill="#38bdf8" />
        <text x={pA.x + 4} y={pA.y - 4} fill="#94a3b8" fontSize="8">x₀</text>

        <circle cx={pC.x} cy={pC.y} r="3" fill="#10b981" />
        <text x={pC.x + 4} y={pC.y - 4} fill="#94a3b8" fontSize="8">z</text>

        <circle cx={pD.x} cy={pD.y} r="3" fill={classification === 'FORCED' ? '#f43f5e' : '#a855f7'} />
        <text x={pD.x + 4} y={pD.y + 10} fill="#94a3b8" fontSize="8">z&apos;</text>

        {/* Current State Cursor */}
        <circle cx={curX} cy={curY} r="5" fill="none" stroke="#f43f5e" strokeWidth="2" />
        <circle cx={curX} cy={curY} r="2" fill="#f43f5e" />

        {/* Axis Labels */}
        <text x={width - padding} y={height - 8} fill="#64748b" fontSize="8" textAnchor="end">Node α (Source)</text>
        <text x={8} y={padding} fill="#64748b" fontSize="8" transform={`rotate(-90 8 ${padding})`} textAnchor="end">Node β</text>
      </svg>
    </div>
  );
};
