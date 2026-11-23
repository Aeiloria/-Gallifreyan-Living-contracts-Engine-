/**
 * @file NodeInspector.tsx
 * Node Inspector Modal/Drawer for Gallifreyan Syntax Tokens
 * Displays mathematical parameters, polar coordinates, and scalar chord linkages.
 */

import React from 'react';
import { SyntaxToken } from '../types/engine';
import { X, Disc, Compass, Network, Activity } from 'lucide-react';

interface NodeInspectorProps {
  token: SyntaxToken | null;
  onClose: () => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({ token, onClose }) => {
  if (!token) return null;

  return (
    <div className="bg-slate-900/95 border border-cyan-500/60 rounded-xl p-3.5 shadow-2xl font-mono text-xs max-w-sm w-full select-none flex flex-col gap-2.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Disc className="w-4 h-4" />
          <span className="font-bold uppercase tracking-wider text-[11px]">
            SYNTAX CLUSTER INSPECTOR
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Token Identifier */}
      <div className="flex flex-col gap-0.5 bg-slate-950/80 p-2.5 rounded border border-slate-800">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider">SEMANTIC TOKEN STRING</div>
        <div className="text-sm font-bold text-white tracking-wide">{token.text}</div>
        <div className="text-[10px] text-cyan-400 font-semibold mt-0.5">ROLE: {token.role}</div>
      </div>

      {/* Polar Coordinates & Geometry Metrics */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex flex-col gap-1 p-2 bg-slate-950/60 rounded border border-slate-800/80">
          <div className="flex items-center gap-1 text-slate-400">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] uppercase">POLAR COORDS</span>
          </div>
          <div className="text-slate-200">Radius (r): <span className="font-bold text-white">{token.radius.toFixed(2)}</span></div>
          <div className="text-slate-200">Angle (θ): <span className="font-bold text-white">{(token.angle * (180 / Math.PI)).toFixed(1)}°</span></div>
        </div>

        <div className="flex flex-col gap-1 p-2 bg-slate-950/60 rounded border border-slate-800/80">
          <div className="flex items-center gap-1 text-slate-400">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] uppercase">ORNAMENTATION</span>
          </div>
          <div className="text-slate-200">Layer Cycle: <span className="font-bold text-white">#{token.layerIndex}</span></div>
          <div className="text-slate-200">Vowel Divots: <span className="font-bold text-white">{token.vowelMarkers}</span></div>
        </div>
      </div>

      <div className="flex flex-col gap-1 p-2 bg-slate-950/60 rounded border border-slate-800/80 text-[11px]">
        <div className="text-[10px] uppercase text-slate-400">SHERMAN GRID READING</div>
        <div className="text-slate-200 leading-snug break-words">{token.glyphSummary}</div>
      </div>

      {/* Interlocking Chord Connections */}
      <div className="flex flex-col gap-1 p-2 bg-slate-950/60 rounded border border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-1 text-slate-400">
          <Network className="w-3 h-3 text-cyan-400" />
          <span className="text-[10px] uppercase">CIRCULAR CHORD BRIDGES</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-0.5">
          {token.chordConnections.length > 0 ? (
            token.chordConnections.map((cid) => (
              <span key={cid} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 text-[10px]">
                {cid}
              </span>
            ))
          ) : (
            <span className="text-slate-500 text-[10px]">None (Autonomous Core Node)</span>
          )}
        </div>
      </div>

      {/* Extrusion & Depth */}
      <div className="flex items-center justify-between text-[11px] text-slate-300 px-1">
        <span>Extruded Thickness:</span>
        <span className="font-bold text-cyan-300">{(token.depthExtrusion * 4).toFixed(1)} mm</span>
      </div>
    </div>
  );
};
