/**
 * @file engine.ts
 * Core types for Gallifreyan Matrix Engine (Aeiloria.Core // Freedom Bond Visualizer)
 */

export type PlaybackStage = 'STAGE_A' | 'STAGE_B' | 'STAGE_C' | 'STAGE_D';

export interface StageDefinition {
  id: PlaybackStage;
  label: string;
  subLabel: string;
  mathSymbol: string;
  description: string;
  phaseTime: number; // 0 to 1
}

export type StateClassification = 
  | 'SELF_SUSTAINING' 
  | 'FORCED' 
  | 'ADAPTED' 
  | 'BASELINE';

export interface CompersionTelemetry {
  b_gain_verified: number;       // [0, 1] Target autonomy expansion >= 0.85
  a_response_positive: number;   // [0, 1] Source resonance amplification > 0
  non_deprivation: number;       // [0, 1] 1.0 = zero deprivation, 0.0 = total depletion
  non_capture: number;           // [0, 1] 1.0 = zero capture/coercion, 0.0 = severe capture
  distinctness_maintained: number; // [0, 1] 1.0 = sovereign identity preserved, 0.0 = fused/eroded
}

export interface StateVector {
  x: number;      // Baseline state scalar
  z: number;      // Perturbed state scalar under V1
  zPrime: number; // Post-removal relaxation state scalar
  influenceV1: number; // Magnitude of applied influence vector
  harmonicCoupling: number; // Coupling factor between node A and B
  phaseAngle: number; // Radians [0, 2π]
}

export interface SyntaxToken {
  id: string;
  text: string;
  radius: number;
  angle: number;
  size: number;
  layerIndex: number;
  vowelMarkers: number;
  chordConnections: string[]; // token ids connected to
  depthExtrusion: number;
  role: 'PRIMARY_CORE' | 'TEMPORAL_RING' | 'RESONANCE_CLUSTER' | 'COUPLED_NODE' | 'SATELLITE_GLYPH';
  compersionWeight: number;
}

export interface GallifreyanMatrixModel {
  title: string;
  rawSyntax: string;
  concentricRings: number;
  outerRadius: number;
  tokens: SyntaxToken[];
  stateVectorA: StateVector;
  stateVectorB: StateVector;
  telemetry: CompersionTelemetry;
  classification: StateClassification;
  notes: string[];
}

export type MaterialFinish = 'POLISHED_BRASS' | 'ASTRAL_TITANIUM' | 'VOID_OBSIDIAN' | 'KEYLONTIC_IRIDESCENT';

export interface ViewportSettings {
  explodedView: number; // 0 to 1
  rotationSpeed: number; // 0 to 2
  isAutoRotate: boolean;
  materialFinish: MaterialFinish;
  wireframe: boolean;
  showHangingLoop: boolean;
  showLatticeBeams: boolean;
  soundEnabled: boolean;
}
