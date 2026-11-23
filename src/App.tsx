/**
 * @file App.tsx
 * Gallifreyan Matrix Engine // Freedom Bond Visualizer
 * Aeiloria.Core Circular Logic Parser & 3D Extrusion Engine
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GallifreyanMatrixModel, MaterialFinish, PlaybackStage, StateClassification, SyntaxToken, ViewportSettings } from './types/engine';
import { parseGallifreyanSyntax, computeStageTelemetry, STAGES } from './core/parser';
import { latestCorpusSnapshot } from './data/corpus';
import { exportToSTL, exportToSVG } from './core/exporter';
import { matrixAudio } from './core/audio';
import { BondCanvas3D } from './components/BondCanvas3D';
import { ControlDock } from './components/ControlDock';
import { NodeInspector } from './components/NodeInspector';
import { EquationReference } from './components/EquationReference';
import { RotateCw, Compass } from 'lucide-react';

export default function App() {
  const [currentScenarioId, setCurrentScenarioId] = useState<string>('SCENARIO_01');
  const [model, setModel] = useState<GallifreyanMatrixModel>(() =>
    parseGallifreyanSyntax('SOVEREIGN_RESONANCE // COMPERSION_INVARIANT_BOND // DUAL_AUTONOMY_CYCLE', 'SCENARIO_01')
  );

  const [currentStage, setCurrentStage] = useState<PlaybackStage>('STAGE_A');
  const [playbackProgress, setPlaybackProgress] = useState<number>(0.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);

  const [inspectedToken, setInspectedToken] = useState<SyntaxToken | null>(null);
  const [showEquations, setShowEquations] = useState<boolean>(false);

  const [viewportSettings, setViewportSettings] = useState<ViewportSettings>({
    explodedView: 0,
    rotationSpeed: 0.8,
    isAutoRotate: true,
    materialFinish: 'POLISHED_BRASS',
    wireframe: false,
    showHangingLoop: true,
    showLatticeBeams: true,
    soundEnabled: true,
  });

  // Reference to 3D Three.js scene objects for STL export
  const threeSceneRef = useRef<{ group: THREE.Group | null; renderer: THREE.WebGLRenderer | null }>({
    group: null,
    renderer: null,
  });

  // Dynamically computed telemetry based on playback progress
  const activeTelemetry = computeStageTelemetry(model.telemetry, model.classification, playbackProgress);

  // Derive dynamic classification: Stage A is always BASELINE
  const effectiveClassification: StateClassification =
    playbackProgress <= 0.05
      ? 'BASELINE'
      : playbackProgress <= 0.33
      ? 'BASELINE'
      : model.classification;

  // 4-Stage Playback Animation Tick
  useEffect(() => {
    if (!isPlaying) return;

    let prevTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const deltaSec = (now - prevTime) / 1000;
      prevTime = now;

      setPlaybackProgress((prev) => {
        const next = prev + deltaSec * 0.12 * speed;
        if (next >= 1.0) {
          setIsPlaying(false);
          setCurrentStage('STAGE_D');
          if (model.classification === 'SELF_SUSTAINING') {
            matrixAudio.playCrystalChime(920);
          } else if (model.classification === 'FORCED') {
            matrixAudio.playForcedCollapse();
          }
          return 1.0;
        }

        // Map progress to current stage
        if (next < 0.33 && currentStage !== 'STAGE_A') {
          setCurrentStage('STAGE_A');
        } else if (next >= 0.33 && next < 0.66 && currentStage !== 'STAGE_B') {
          setCurrentStage('STAGE_B');
          matrixAudio.playAstrolabeTick();
        } else if (next >= 0.66 && next < 0.99 && currentStage !== 'STAGE_C') {
          setCurrentStage('STAGE_C');
          matrixAudio.playAstrolabeTick();
        }

        return next;
      });

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, speed, currentStage, model.classification]);

  // Keyboard shortcut: H for Cinema mode, Space for Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectScenario = (id: string) => {
    setCurrentScenarioId(id);
    const newModel = parseGallifreyanSyntax('', id);
    setModel(newModel);
    setPlaybackProgress(0.0);
    setCurrentStage('STAGE_A');
    setIsPlaying(false);
    matrixAudio.playCrystalChime(760);
  };

  const handleParseCustomText = (text: string) => {
    setCurrentScenarioId('CUSTOM');
    const newModel = parseGallifreyanSyntax(text);
    setModel(newModel);
    setPlaybackProgress(0.0);
    setCurrentStage('STAGE_A');
    setIsPlaying(false);
    matrixAudio.playCrystalChime(840);
  };

  const handleSeek = (val: number) => {
    setPlaybackProgress(val);
    if (val < 0.33) setCurrentStage('STAGE_A');
    else if (val < 0.66) setCurrentStage('STAGE_B');
    else if (val < 0.99) setCurrentStage('STAGE_C');
    else setCurrentStage('STAGE_D');
  };

  const handleSelectStage = (stage: PlaybackStage) => {
    setCurrentStage(stage);
    const def = STAGES.find((s) => s.id === stage);
    if (def) {
      setPlaybackProgress(def.phaseTime);
      matrixAudio.playAstrolabeTick();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPlaybackProgress(0.0);
    setCurrentStage('STAGE_A');
    matrixAudio.playAstrolabeTick();
  };

  const handleCycleSpeed = () => {
    setSpeed((s) => (s === 0.5 ? 1.0 : s === 1.0 ? 2.0 : 0.5));
  };

  const handleUpdateSettings = (patch: Partial<ViewportSettings>) => {
    setViewportSettings((prev) => ({ ...prev, ...patch }));
  };

  const handleCanvasReady = useCallback((group: THREE.Group, renderer: THREE.WebGLRenderer) => {
    threeSceneRef.current = { group, renderer };
  }, []);

  const handleExportSTL = () => {
    if (threeSceneRef.current.group) {
      const safeName = model.rawSyntax.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 24);
      exportToSTL(threeSceneRef.current.group, `Gallifreyan_${safeName}_Medallion.stl`);
      matrixAudio.playCrystalChime(1050);
    }
  };

  const handleExportSVG = () => {
    const safeName = model.rawSyntax.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 24);
    exportToSVG(model, `Gallifreyan_${safeName}_Blueprint.svg`);
    matrixAudio.playCrystalChime(1050);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050811] text-slate-100 font-mono select-none">
      {/* 3D WebGL Canvas Layer (Full-Bleed Viewport) */}
      <BondCanvas3D
        model={model}
        playbackProgress={playbackProgress}
        stage={currentStage}
        effectiveClassification={effectiveClassification}
        settings={viewportSettings}
        onSelectToken={setInspectedToken}
        onCanvasReady={handleCanvasReady}
      />

      {/* Top Left Minimal Spec HUD Badge (Zero Occlusion) */}
      <div className="absolute top-4 left-4 z-20 bg-slate-950/85 border border-slate-800 rounded-lg p-3 shadow-xl max-w-sm pointer-events-auto">
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h1 className="text-xs font-bold tracking-wider text-cyan-400 uppercase">
            GALLIFREYAN MATRIX ENGINE // v2.4.0
          </h1>
        </div>
        <div className="text-[10px] text-slate-400 leading-tight">
          Target: <span className="text-rose-400 font-semibold">Aeiloria.Core // Temporal Governance</span>
        </div>
        <div className="text-[10px] text-slate-400 leading-tight">
          Concentric Rings: <span className="text-emerald-400 font-semibold">{model.concentricRings} Active Layers</span>
        </div>
        <div className="text-[10px] text-slate-400 leading-tight">
          Syntax Nodes: <span className="text-slate-200 font-semibold">{model.tokens.length} Circular Glyphs</span>
        </div>
        <div className="text-[10px] text-slate-400 leading-tight">
          Field corpus:{' '}
          <span className="text-slate-200 font-semibold">{latestCorpusSnapshot().gatheredAt}</span>
        </div>
        <div className="text-[10px] text-slate-400 leading-tight">
          Status:{' '}
          <span
            className={`font-bold ${
              effectiveClassification === 'SELF_SUSTAINING'
                ? 'text-cyan-300'
                : effectiveClassification === 'FORCED'
                ? 'text-slate-400'
                : 'text-amber-300'
            }`}
          >
            {effectiveClassification}
          </span>
        </div>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setShowEquations(true)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-950/85 hover:bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-lg font-bold"
        >
          <span>EQUATIONS (x ⟶ z ⟶ z&apos;)</span>
        </button>

        <button
          onClick={() => {
            // Flip exploded view or trigger rotational snap
            setViewportSettings((s) => ({
              ...s,
              explodedView: s.explodedView > 0 ? 0 : 0.65,
            }));
            matrixAudio.playAstrolabeTick();
          }}
          title="Toggle Double-Sided Exploded Inspection"
          className="p-1.5 rounded-lg bg-slate-950/85 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg"
        >
          <RotateCw className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {/* Node Inspector Modal/Drawer (Top Right when active) */}
      {inspectedToken && (
        <div className="absolute top-16 right-4 z-25 pointer-events-auto">
          <NodeInspector token={inspectedToken} onClose={() => setInspectedToken(null)} />
        </div>
      )}

      {/* Mathematical Equations Reference Modal */}
      {showEquations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <EquationReference onClose={() => setShowEquations(false)} />
        </div>
      )}

      {/* Consolidated Ergonomic Bottom Control Dock */}
      <ControlDock
        model={model}
        currentStage={currentStage}
        playbackProgress={playbackProgress}
        isPlaying={isPlaying}
        speed={speed}
        telemetry={activeTelemetry}
        classification={effectiveClassification}
        settings={viewportSettings}
        currentScenarioId={currentScenarioId}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onSeek={handleSeek}
        onSelectStage={handleSelectStage}
        onReset={handleReset}
        onCycleSpeed={handleCycleSpeed}
        onUpdateSettings={handleUpdateSettings}
        onSelectScenario={handleSelectScenario}
        onParseCustomText={handleParseCustomText}
        onExportSTL={handleExportSTL}
        onExportSVG={handleExportSVG}
        onOpenEquations={() => setShowEquations(true)}
      />
    </div>
  );
}
