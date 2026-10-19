/**
 * @file parser.ts
 * Gallifreyan Matrix Engine (Aeiloria.Core)
 * Circular Logic Parser & State-Space Equation Solver
 */

import { GallifreyanMatrixModel, StateClassification, CompersionTelemetry, SyntaxToken, StateVector } from '../types/engine';

export const STAGES = [
  {
    id: 'STAGE_A' as const,
    label: 'Stage A: Baseline Equilibrium',
    subLabel: 'Initial Ground State (x)',
    mathSymbol: 'x \\in \\mathbb{R}^n',
    description: 'Calibrated baseline state before external vector coupling. Harmonic nodes maintain independent circular geodesics.',
    phaseTime: 0.0,
  },
  {
    id: 'STAGE_B' as const,
    label: 'Stage B: Applied Influence',
    subLabel: 'Coupled Vector Force (V₁)',
    mathSymbol: 'x \\xrightarrow{V_1} z',
    description: 'Influence vector V₁ applied across nodal boundary. Astrolabe tracks coupling torque and resonance induction.',
    phaseTime: 0.33,
  },
  {
    id: 'STAGE_C' as const,
    label: 'Stage C: State Delta',
    subLabel: 'Active Perturbed Phase (Δz = z - x)',
    mathSymbol: '\\Delta z = z - x',
    description: 'Full excitation state. Telemetry assesses whether Node B gain triggers sympathetic resonance or parasitic strain.',
    phaseTime: 0.66,
  },
  {
    id: 'STAGE_D' as const,
    label: 'Stage D: Persistence Removal',
    subLabel: 'Relaxation & Freedom Test (z → z\')',
    mathSymbol: 'z \\xrightarrow{-V_1} z\'',
    description: 'External influence V₁ severed. Tests whether bond is self-sustaining (crystallizing) or forced (collapsing trace).',
    phaseTime: 1.0,
  },
];

export const PRESET_SCENARIOS: { id: string; name: string; tag: string; rawSyntax: string; description: string; baseClassification: StateClassification }[] = [
  {
    id: 'SCENARIO_01',
    name: 'Sovereign Freedom Bond (Compersion Invariant)',
    tag: 'AEILORIA.FREEDOM.01',
    rawSyntax: 'SOVEREIGN_RESONANCE // COMPERSION_INVARIANT_BOND // DUAL_AUTONOMY_CYCLE',
    description: 'Both nodes exhibit reciprocal expansion without structural capture. When influence vector is severed, the lattice self-sustains indefinitely.',
    baseClassification: 'SELF_SUSTAINING',
  },
  {
    id: 'SCENARIO_02',
    name: 'Coercive Capture Vector (Boundary Encroachment)',
    tag: 'AEILORIA.COERCION.02',
    rawSyntax: 'CAPTURE_TENSOR // ASYMMETRIC_EXTRACTION // COLLAPSING_GEODESIC',
    description: 'Node A forces boundary absorption on Node B. Nodal distinctness collapses; once driving force ceases, state violently collapses into a dashed grey trace.',
    baseClassification: 'FORCED',
  },
  {
    id: 'SCENARIO_03',
    name: 'Asymmetric Deprivation (Zero-Sum Siphon)',
    tag: 'AEILORIA.DEPRIVATION.03',
    rawSyntax: 'ZERO_SUM_DRAIN // DEPLETION_METRIC // ASYMMETRIC_ENTROPY',
    description: 'Node B gain directly extracts from Node A baseline, violating the non-deprivation observable. Phase orbital decay observed.',
    baseClassification: 'FORCED',
  },
  {
    id: 'SCENARIO_04',
    name: 'Harmonic Adaptation (Equilibrium Realignment)',
    tag: 'AEILORIA.ADAPTED.04',
    rawSyntax: 'RECONFIGURED_HARMONIC // STABLE_ORBIT // VOLUNTARY_TRANSITION',
    description: 'Mutual non-coercive adaptation into an expanded harmonic tier. Stable new equilibrium z\' maintained with moderate internal reorganization.',
    baseClassification: 'ADAPTED',
  },
];

/**
 * Procedural circular syntax parser: converts any semantic text string into
 * concentric Gallifreyan rings, radial token clusters, vowel divots, and interlocking chord rays.
 */
export function parseGallifreyanSyntax(rawText: string, scenarioId?: string): GallifreyanMatrixModel {
  const sanitized = rawText.toUpperCase().trim() || 'AEILORIA_CORE_TEMPORAL_SIGIL';
  const words = sanitized.split(/[\s\/\_\-]+/).filter(Boolean);

  // Derive deterministic parameters from hash
  let hash = 0;
  for (let i = 0; i < sanitized.length; i++) {
    hash = (hash << 5) - hash + sanitized.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  const ringCount = Math.max(3, Math.min(6, 3 + (words.length % 4)));
  const outerRadius = 11.5;

  // Generate circular syntax clusters (non-linear circular array)
  const tokens: SyntaxToken[] = [];
  const tokenCount = Math.max(4, Math.min(10, words.length + 2));

  for (let i = 0; i < tokenCount; i++) {
    const textLabel = words[i % words.length] || `GLYPH_${i + 1}`;
    const layer = (i % (ringCount - 1)) + 1;
    const layerRadius = (outerRadius * 0.28) + (layer / ringCount) * (outerRadius * 0.65);
    
    // Non-linear circular arrangement: angles mapped around the concentric perimeter
    const goldenAngle = 2.39996323; // Golden angle for non-linear distribution
    const angle = (i * goldenAngle + (positiveHash * 0.01)) % (Math.PI * 2);
    
    const size = 1.2 + (textLabel.length % 5) * 0.35;
    const vowelMarkers = (textLabel.match(/[AEIOU]/g) || []).length || (i % 3);
    const depthExtrusion = 0.4 + (i % 3) * 0.25;

    // Connect chords to previous and alternating nodes for interlocking circular syntax
    const chords: string[] = [];
    if (i > 0) chords.push(`token_${i - 1}`);
    if (i > 2 && (i + positiveHash) % 2 === 0) chords.push(`token_${(i + 2) % tokenCount}`);

    let role: SyntaxToken['role'] = 'RESONANCE_CLUSTER';
    if (i === 0) role = 'PRIMARY_CORE';
    else if (i === 1) role = 'COUPLED_NODE';
    else if (layer === ringCount - 1) role = 'TEMPORAL_RING';
    else if (i % 3 === 0) role = 'SATELLITE_GLYPH';

    tokens.push({
      id: `token_${i}`,
      text: textLabel,
      radius: layerRadius,
      angle,
      size,
      layerIndex: layer,
      vowelMarkers,
      chordConnections: chords,
      depthExtrusion,
      role,
      compersionWeight: Math.min(1, Math.max(0.2, (size / 2.5) * (1 - (layer / (ringCount * 1.5))))),
    });
  }

  // Calculate State Vectors based on Scenario or Custom Text
  let stateVectorA: StateVector;
  let stateVectorB: StateVector;
  let telemetry: CompersionTelemetry;
  let classification: StateClassification;

  if (scenarioId === 'SCENARIO_02') {
    // Coercive capture: B gain is fake/forced, non_capture is very low, collapses
    stateVectorA = { x: 1.0, z: 1.25, zPrime: 0.85, influenceV1: 0.95, harmonicCoupling: 0.3, phaseAngle: 0.4 };
    stateVectorB = { x: 0.6, z: 0.35, zPrime: 0.15, influenceV1: 0.95, harmonicCoupling: 0.15, phaseAngle: 2.8 };
    telemetry = {
      b_gain_verified: 0.12,
      a_response_positive: 0.25,
      non_deprivation: 0.38,
      non_capture: 0.08,
      distinctness_maintained: 0.18,
    };
    classification = 'FORCED';
  } else if (scenarioId === 'SCENARIO_03') {
    // Deprivation: Node B gain directly extracts from Node A
    stateVectorA = { x: 1.2, z: 0.4, zPrime: 0.35, influenceV1: 0.8, harmonicCoupling: 0.25, phaseAngle: 0.8 };
    stateVectorB = { x: 0.5, z: 1.3, zPrime: 0.5, influenceV1: 0.8, harmonicCoupling: 0.2, phaseAngle: 3.1 };
    telemetry = {
      b_gain_verified: 0.65,
      a_response_positive: 0.15,
      non_deprivation: 0.14,
      non_capture: 0.42,
      distinctness_maintained: 0.52,
    };
    classification = 'FORCED';
  } else if (scenarioId === 'SCENARIO_04') {
    // Adapted harmonic transition
    stateVectorA = { x: 1.0, z: 1.35, zPrime: 1.28, influenceV1: 0.65, harmonicCoupling: 0.78, phaseAngle: 1.2 };
    stateVectorB = { x: 0.8, z: 1.22, zPrime: 1.18, influenceV1: 0.65, harmonicCoupling: 0.75, phaseAngle: 1.5 };
    telemetry = {
      b_gain_verified: 0.79,
      a_response_positive: 0.82,
      non_deprivation: 0.88,
      non_capture: 0.84,
      distinctness_maintained: 0.81,
    };
    classification = 'ADAPTED';
  } else {
    // Default or SCENARIO_01: Sovereign Freedom Bond (Self-sustaining)
    // Positive gain, zero capture, zero deprivation, persistent crystal lattice
    stateVectorA = { x: 1.0, z: 1.52, zPrime: 1.50, influenceV1: 0.75, harmonicCoupling: 0.94, phaseAngle: 1.05 };
    stateVectorB = { x: 0.85, z: 1.48, zPrime: 1.46, influenceV1: 0.75, harmonicCoupling: 0.92, phaseAngle: 1.08 };
    telemetry = {
      b_gain_verified: 0.94,
      a_response_positive: 0.91,
      non_deprivation: 0.98,
      non_capture: 0.96,
      distinctness_maintained: 0.93,
    };
    classification = 'SELF_SUSTAINING';
  }

  return {
    title: `GALLIFREYAN MATRIX // ${sanitized.slice(0, 32)}`,
    rawSyntax: sanitized,
    concentricRings: ringCount,
    outerRadius,
    tokens,
    stateVectorA,
    stateVectorB,
    telemetry,
    classification,
    notes: [
      `Dimensional time layers: ${ringCount} concentric circular tracks`,
      `Interlocking syntax nodes: ${tokens.length} polar coordinates`,
      `Structural hanging loop: Embedded at Zenith (Y = +12.4)`,
      `Embossing: Double-sided front relief & reverse scalar keylontic grid`,
    ],
  };
}

/**
 * Computes dynamic stage-dependent telemetry values
 */
export function computeStageTelemetry(base: CompersionTelemetry, classification: StateClassification, progress: number): CompersionTelemetry {
  // progress: 0 (Stage A), 0.33 (Stage B), 0.66 (Stage C), 1.0 (Stage D)
  if (progress <= 0.05) {
    // Baseline state: neutral calibrated values
    return {
      b_gain_verified: 0.50,
      a_response_positive: 0.50,
      non_deprivation: 1.00,
      non_capture: 1.00,
      distinctness_maintained: 1.00,
    };
  } else if (progress <= 0.33) {
    // Influence applying: ramp up excitation
    const t = progress / 0.33;
    return {
      b_gain_verified: 0.5 + (base.b_gain_verified - 0.5) * t * 0.7,
      a_response_positive: 0.5 + (base.a_response_positive - 0.5) * t * 0.7,
      non_deprivation: 1.0 - (1.0 - base.non_deprivation) * t * 0.5,
      non_capture: 1.0 - (1.0 - base.non_capture) * t * 0.5,
      distinctness_maintained: 1.0 - (1.0 - base.distinctness_maintained) * t * 0.5,
    };
  } else if (progress <= 0.66) {
    // State delta: full perturbation
    return base;
  } else {
    // Stage D: Persistence removal
    const t = (progress - 0.66) / 0.34;
    if (classification === 'FORCED') {
      // Coercive forced state collapses when V1 removed!
      return {
        b_gain_verified: Math.max(0.02, base.b_gain_verified * (1 - t * 0.85)),
        a_response_positive: Math.max(0.04, base.a_response_positive * (1 - t * 0.75)),
        non_deprivation: Math.max(0.08, base.non_deprivation * (1 - t * 0.6)),
        non_capture: Math.max(0.05, base.non_capture * (1 - t * 0.8)),
        distinctness_maintained: Math.max(0.1, base.distinctness_maintained * (1 - t * 0.7)),
      };
    } else if (classification === 'ADAPTED') {
      // Settles into steady adapted equilibrium
      return {
        b_gain_verified: base.b_gain_verified * (1 - t * 0.08),
        a_response_positive: base.a_response_positive * (1 - t * 0.05),
        non_deprivation: base.non_deprivation,
        non_capture: base.non_capture,
        distinctness_maintained: base.distinctness_maintained,
      };
    } else {
      // Self-sustaining: retains or solidifies high compersion metrics
      return {
        b_gain_verified: Math.min(1.0, base.b_gain_verified + t * 0.04),
        a_response_positive: Math.min(1.0, base.a_response_positive + t * 0.05),
        non_deprivation: base.non_deprivation,
        non_capture: base.non_capture,
        distinctness_maintained: base.distinctness_maintained,
      };
    }
  }
}
