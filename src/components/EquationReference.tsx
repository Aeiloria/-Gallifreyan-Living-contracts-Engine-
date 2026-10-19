/**
 * @file EquationReference.tsx
 * Rigorous Mathematical & Equations Reference for Freedom Bond Observables
 * Adheres strictly to laboratory-grade rigor and zero prose.
 */

import React from 'react';
import { BookMarked, X, Sigma } from 'lucide-react';

interface EquationReferenceProps {
  onClose: () => void;
}

export const EquationReference: React.FC<EquationReferenceProps> = ({ onClose }) => {
  return (
    <div className="bg-slate-900/95 border border-cyan-500/60 rounded-xl p-4 shadow-2xl font-mono text-xs max-w-lg w-full select-none flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-cyan-400">
          <Sigma className="w-4 h-4" />
          <span className="font-bold uppercase tracking-wider text-[11px]">
            AEILORIA.CORE // MATHEMATICAL EQUATIONS REFERENCE
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* State-Space Transition Pipeline */}
      <div className="p-3 bg-slate-950/80 rounded border border-slate-800 flex flex-col gap-1.5">
        <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">
          1. STATE-SPACE NODE &amp; VECTOR TRANSITION PIPELINE
        </div>
        <div className="text-white font-bold text-sm bg-slate-900 px-2 py-1 rounded border border-slate-800 text-center">
          x ⟶(V₁) z ⟶(-V₁) z&apos;
        </div>
        <div className="text-[11px] text-slate-300 leading-relaxed">
          Where <span className="text-cyan-300 font-semibold">x ∈ ℝⁿ</span> is the initial baseline ground state,{' '}
          <span className="text-emerald-300 font-semibold">V₁</span> is the applied external or coupling influence vector,{' '}
          <span className="text-amber-300 font-semibold">z</span> is the perturbed excitation state, and{' '}
          <span className="text-purple-300 font-semibold">z&apos;</span> is the relaxation state upon influence vector removal.
        </div>
      </div>

      {/* 5 Compersion Observables */}
      <div className="flex flex-col gap-2">
        <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-1">
          <BookMarked className="w-3.5 h-3.5" />
          <span>2. COMPERSION TELEMETRY OBSERVABLES FORMULATION</span>
        </div>

        <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800/80 flex flex-col gap-1">
          <div className="flex items-center justify-between text-white font-semibold">
            <span>b_gain_verified</span>
            <span className="text-cyan-400 font-bold">Δ𝒢_B = 𝒢(z_B) - 𝒢(x_B) ≥ ε</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Target autonomy expansion verification. Node B experiences autogenous expansion without coercion.
          </div>
        </div>

        <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800/80 flex flex-col gap-1">
          <div className="flex items-center justify-between text-white font-semibold">
            <span>a_response_positive</span>
            <span className="text-cyan-400 font-bold">ℛ_A = ⟨∂𝒢_A, Δ𝒢_B⟩ &gt; 0</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Source resonance amplification. Node A experiences positive sympathetic gain from B&apos;s expansion.
          </div>
        </div>

        <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800/80 flex flex-col gap-1">
          <div className="flex items-center justify-between text-white font-semibold">
            <span>non_deprivation</span>
            <span className="text-cyan-400 font-bold">𝒟_AB = max(0, ℰ(x_A) - ℰ(z_A)) = 0</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Zero-sum depletion index. Verifies that Node B gain does not extract or cannibalize Node A baseline coherence.
          </div>
        </div>

        <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800/80 flex flex-col gap-1">
          <div className="flex items-center justify-between text-white font-semibold">
            <span>non_capture</span>
            <span className="text-cyan-400 font-bold">𝒞_BA = ‖∇_B V₁‖ / ‖∇_total V₁‖ ≤ τ_crit</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Boundary sovereignty invariance. Verifies zero boundary absorption, coercion, or topological capture.
          </div>
        </div>

        <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800/80 flex flex-col gap-1">
          <div className="flex items-center justify-between text-white font-semibold">
            <span>distinctness_maintained</span>
            <span className="text-cyan-400 font-bold">𝒮_overlap = ∫_Ω ψ*_A(r) ψ_B(r) dr ≤ σ_max</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Topological phase separation. Nodes A and B retain invariant separate boundary manifolds.
          </div>
        </div>
      </div>

      {/* State Classification Criteria */}
      <div className="p-3 bg-slate-950/80 rounded border border-slate-800 flex flex-col gap-1.5">
        <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">
          3. CLASSIFICATION MANIFOLD BOUNDS
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="p-1.5 rounded bg-cyan-950/40 border border-cyan-800/60 text-cyan-200">
            <span className="font-bold">SELF_SUSTAINING:</span> z&apos; ≈ z with Δ𝒢_B &gt; 0, 𝒟_AB = 0. Iridescent crystal lattice.
          </div>
          <div className="p-1.5 rounded bg-slate-950/40 border border-slate-700 text-slate-300">
            <span className="font-bold">FORCED:</span> ‖z&apos;‖ ⟶ 0 or collapses. Dashed grey trace upon removal.
          </div>
        </div>
      </div>
    </div>
  );
};
