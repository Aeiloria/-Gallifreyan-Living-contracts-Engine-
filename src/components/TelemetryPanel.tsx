/**
 * @file TelemetryPanel.tsx
 * Laboratory-Grade Telemetry Panel for Compersion Observables
 * Strict zero-prose, zero-mythology mathematical rigor.
 */

import React from 'react';
import { CompersionTelemetry, StateClassification, StateVector } from '../types/engine';
import { ShieldCheck, Activity, Scale, LockOpen, Layers } from 'lucide-react';

interface TelemetryPanelProps {
  telemetry: CompersionTelemetry;
  classification: StateClassification;
  stateA: StateVector;
  stateB: StateVector;
  stageName: string;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({
  telemetry,
  classification,
  stateA,
  stateB,
  stageName,
}) => {
  // Classification badge styling
  const getBadgeStyle = () => {
    switch (classification) {
      case 'SELF_SUSTAINING':
        return {
          bg: 'bg-cyan-950/80',
          border: 'border-cyan-400',
          text: 'text-cyan-200',
          glow: 'ring-1 ring-cyan-400/40',
          label: 'SELF_SUSTAINING // COHESIVE LATTICE',
          desc: 'Compersion invariant preserved. Post-removal delta stable.',
        };
      case 'FORCED':
        return {
          bg: 'bg-slate-900/90',
          border: 'border-slate-500',
          text: 'text-slate-300',
          glow: 'ring-1 ring-slate-500/30',
          label: 'FORCED // COLLAPSING TRACE',
          desc: 'Coercive boundary absorption. Dissipates upon vector severance.',
        };
      case 'ADAPTED':
        return {
          bg: 'bg-amber-950/80',
          border: 'border-amber-400',
          text: 'text-amber-200',
          glow: 'ring-1 ring-amber-400/40',
          label: 'ADAPTED // HARMONIC SHIFT',
          desc: 'Re-equilibrated topological state with non-zero phase rotation.',
        };
      case 'BASELINE':
      default:
        return {
          bg: 'bg-sky-950/80',
          border: 'border-sky-500',
          text: 'text-sky-300',
          glow: 'ring-1 ring-sky-500/30',
          label: 'BASELINE // GROUND EQUILIBRIUM',
          desc: 'Calibrated reference state x before external vector coupling.',
        };
    }
  };

  const badge = getBadgeStyle();

  const observables = [
    {
      id: 'b_gain_verified',
      name: 'b_gain_verified',
      symbol: 'Δ𝒢_B ≥ ε',
      label: 'Target Autonomy Expansion',
      value: telemetry.b_gain_verified,
      threshold: 0.70,
      icon: Activity,
      pass: telemetry.b_gain_verified >= 0.70,
    },
    {
      id: 'a_response_positive',
      name: 'a_response_positive',
      symbol: 'ℛ_A > 0',
      label: 'Source Resonance Amplification',
      value: telemetry.a_response_positive,
      threshold: 0.65,
      icon: ShieldCheck,
      pass: telemetry.a_response_positive >= 0.65,
    },
    {
      id: 'non_deprivation',
      name: 'non_deprivation',
      symbol: '𝒟_AB = 0',
      label: 'Zero-Sum Resource Depletion Index',
      value: telemetry.non_deprivation,
      threshold: 0.75,
      icon: Scale,
      pass: telemetry.non_deprivation >= 0.75,
    },
    {
      id: 'non_capture',
      name: 'non_capture',
      symbol: '𝒞_BA ≤ τ_crit',
      label: 'Boundary Sovereignty Invariance',
      value: telemetry.non_capture,
      threshold: 0.75,
      icon: LockOpen,
      pass: telemetry.non_capture >= 0.75,
    },
    {
      id: 'distinctness_maintained',
      name: 'distinctness_maintained',
      symbol: '𝒮_overlap ≤ σ_max',
      label: 'Topological Phase Separation',
      value: telemetry.distinctness_maintained,
      threshold: 0.70,
      icon: Layers,
      pass: telemetry.distinctness_maintained >= 0.70,
    },
  ];

  return (
    <div className="flex flex-col gap-3 font-mono text-xs select-none">
      {/* State Classification Header */}
      <div className={`p-3 rounded-lg border ${badge.border} ${badge.bg} ${badge.glow} flex flex-col gap-1 transition-all`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">STATE CLASSIFICATION</span>
          <span className="text-[10px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700">
            {stageName}
          </span>
        </div>
        <div className={`text-xs font-bold tracking-wider ${badge.text}`}>
          {badge.label}
        </div>
        <div className="text-[11px] text-slate-300 leading-tight">
          {badge.desc}
        </div>
      </div>

      {/* 5 Compersion Observables */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            COMPERSION OBSERVABLES (5/5)
          </span>
          <span className="text-[10px] text-cyan-400 font-semibold">
            METRIC TENSOR ℳ
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {observables.map((obs) => {
            const Icon = obs.icon;
            const pct = Math.round(obs.value * 100);
            return (
              <div key={obs.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-200">{obs.name}</span>
                    <span className="text-[10px] text-slate-500">({obs.symbol})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={obs.pass ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {(obs.value).toFixed(2)}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border ${obs.pass ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60' : 'bg-rose-950/60 text-rose-300 border-rose-700/60'}`}>
                      {obs.pass ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>

                {/* Progress bar gauge */}
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      obs.pass ? 'bg-cyan-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* State-Space Coordinate Vector Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex flex-col gap-1 p-2 bg-slate-950/60 rounded border border-slate-800">
          <span className="text-[10px] text-cyan-400 font-bold uppercase">NODE α (SOURCE)</span>
          <div className="text-slate-300">x₀ = <span className="text-white font-semibold">{stateA.x.toFixed(2)}</span></div>
          <div className="text-slate-300">z  = <span className="text-white font-semibold">{stateA.z.toFixed(2)}</span></div>
          <div className="text-slate-300">z&apos; = <span className="text-white font-semibold">{stateA.zPrime.toFixed(2)}</span></div>
        </div>
        <div className="flex flex-col gap-1 p-2 bg-slate-950/60 rounded border border-slate-800">
          <span className="text-[10px] text-emerald-400 font-bold uppercase">NODE β (TARGET)</span>
          <div className="text-slate-300">x₀ = <span className="text-white font-semibold">{stateB.x.toFixed(2)}</span></div>
          <div className="text-slate-300">z  = <span className="text-white font-semibold">{stateB.z.toFixed(2)}</span></div>
          <div className="text-slate-300">z&apos; = <span className="text-white font-semibold">{stateB.zPrime.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
};
