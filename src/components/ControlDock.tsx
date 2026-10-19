/**
 * @file ControlDock.tsx
 * Consolidated Collapsible Bottom Control Dock
 * Strict zero-occlusion layout complying with Three.js skill guidelines.
 */

import React, { useState } from 'react';
import { MaterialFinish, PlaybackStage, StateClassification, ViewportSettings, GallifreyanMatrixModel, CompersionTelemetry } from '../types/engine';
import { PlaybackBar } from './PlaybackBar';
import { TelemetryPanel } from './TelemetryPanel';
import { PhaseSpacePlot } from './PhaseSpacePlot';
import { CompersionFluxChart } from './CompersionFluxChart';
import { ScenarioSelector } from './ScenarioSelector';
import { ChevronDown, ChevronUp, Sliders, Activity, Disc, Layers, Download, Volume2, VolumeX, Eye } from 'lucide-react';
import { matrixAudio } from '../core/audio';

interface ControlDockProps {
  model: GallifreyanMatrixModel;
  currentStage: PlaybackStage;
  playbackProgress: number;
  isPlaying: boolean;
  speed: number;
  telemetry: CompersionTelemetry;
  classification: StateClassification;
  settings: ViewportSettings;
  currentScenarioId: string;
  onTogglePlay: () => void;
  onSeek: (val: number) => void;
  onSelectStage: (stage: PlaybackStage) => void;
  onReset: () => void;
  onCycleSpeed: () => void;
  onUpdateSettings: (patch: Partial<ViewportSettings>) => void;
  onSelectScenario: (scenarioId: string) => void;
  onParseCustomText: (text: string) => void;
  onExportSTL: () => void;
  onExportSVG: () => void;
  onOpenEquations: () => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  model,
  currentStage,
  playbackProgress,
  isPlaying,
  speed,
  telemetry,
  classification,
  settings,
  currentScenarioId,
  onTogglePlay,
  onSeek,
  onSelectStage,
  onReset,
  onCycleSpeed,
  onUpdateSettings,
  onSelectScenario,
  onParseCustomText,
  onExportSTL,
  onExportSVG,
  onOpenEquations,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'PLAYBACK' | 'TELEMETRY' | 'SCENARIO' | 'FINISHES' | 'EXPORT'>('PLAYBACK');

  const toggleSound = () => {
    const next = !settings.soundEnabled;
    matrixAudio.setMuted(!next);
    onUpdateSettings({ soundEnabled: next });
    if (next) matrixAudio.playCrystalChime(960);
  };

  const finishes: { id: MaterialFinish; label: string; color: string }[] = [
    { id: 'POLISHED_BRASS', label: 'Chronos Brass', color: '#d97706' },
    { id: 'ASTRAL_TITANIUM', label: 'Astral Titanium', color: '#94a3b8' },
    { id: 'VOID_OBSIDIAN', label: 'Void Obsidian', color: '#334155' },
    { id: 'KEYLONTIC_IRIDESCENT', label: 'Keylontic Pearl', color: '#38bdf8' },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[95vw] max-w-4xl z-30 font-mono select-none transition-all duration-300">
      {/* Drawer Toggle Header Tab */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-4 py-1 rounded-t-lg bg-slate-900 border-t border-x border-slate-700/80 text-[11px] text-cyan-400 hover:text-cyan-200 transition-all flex items-center gap-1.5 shadow-lg cursor-pointer font-bold"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>EXPAND LABORATORY CONTROLS (H)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>CINEMA VIEW (COLLAPSE HUD)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container */}
      {!isCollapsed && (
        <div className="bg-[#0b1120] border border-slate-700/90 rounded-xl shadow-2xl p-3 flex flex-col gap-2.5">
          {/* Top Bar: Tabs & Quick Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('PLAYBACK')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'PLAYBACK'
                    ? 'bg-cyan-950 border border-cyan-400 text-cyan-200'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>STAGE TRANSITIONS</span>
              </button>

              <button
                onClick={() => setActiveTab('TELEMETRY')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'TELEMETRY'
                    ? 'bg-cyan-950 border border-cyan-400 text-cyan-200'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3 h-3" />
                <span>COMPERSION TELEMETRY</span>
              </button>

              <button
                onClick={() => setActiveTab('SCENARIO')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'SCENARIO'
                    ? 'bg-cyan-950 border border-cyan-400 text-cyan-200'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Disc className="w-3 h-3" />
                <span>SYNTAX &amp; SCENARIOS</span>
              </button>

              <button
                onClick={() => setActiveTab('FINISHES')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'FINISHES'
                    ? 'bg-cyan-950 border border-cyan-400 text-cyan-200'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>MEDALLION &amp; EXPLODED</span>
              </button>

              <button
                onClick={() => setActiveTab('EXPORT')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'EXPORT'
                    ? 'bg-cyan-950 border border-cyan-400 text-cyan-200'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Download className="w-3 h-3" />
                <span>FABRICATION / STL</span>
              </button>
            </div>

            {/* Quick Aux Toggles (Audio, Math Docs) */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={onOpenEquations}
                title="View Mathematical Equations Reference"
                className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 rounded text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">MATH REF</span>
              </button>
              <button
                onClick={toggleSound}
                title={settings.soundEnabled ? 'Mute Audio Synthesizer' : 'Enable Audio Synthesizer'}
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-all"
              >
                {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              </button>
            </div>
          </div>

          {/* Active Tab View Body */}
          <div className="min-h-[140px] max-h-[45vh] overflow-y-auto pr-1">
            {activeTab === 'PLAYBACK' && (
              <div className="flex flex-col gap-3">
                <PlaybackBar
                  currentStage={currentStage}
                  progress={playbackProgress}
                  isPlaying={isPlaying}
                  speed={speed}
                  onTogglePlay={onTogglePlay}
                  onSeek={onSeek}
                  onSelectStage={onSelectStage}
                  onReset={onReset}
                  onCycleSpeed={onCycleSpeed}
                />
                <CompersionFluxChart
                  model={model}
                  playbackProgress={playbackProgress}
                  classification={classification}
                  onSeek={onSeek}
                />
              </div>
            )}

            {activeTab === 'TELEMETRY' && (
              <div className="flex flex-col gap-3">
                <CompersionFluxChart
                  model={model}
                  playbackProgress={playbackProgress}
                  classification={classification}
                  onSeek={onSeek}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <TelemetryPanel
                    telemetry={telemetry}
                    classification={classification}
                    stateA={model.stateVectorA}
                    stateB={model.stateVectorB}
                    stageName={currentStage}
                  />
                  <PhaseSpacePlot
                    stateA={model.stateVectorA}
                    stateB={model.stateVectorB}
                    classification={classification}
                    progress={playbackProgress}
                  />
                </div>
              </div>
            )}

            {activeTab === 'SCENARIO' && (
              <ScenarioSelector
                currentScenarioId={currentScenarioId}
                onSelectScenario={onSelectScenario}
                onParseCustomText={onParseCustomText}
              />
            )}

            {activeTab === 'FINISHES' && (
              <div className="flex flex-col gap-3 text-xs">
                {/* Exploded View Slider */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      EXPLODED VIEW SEPARATION (DOUBLE-SIDED EMBOSSING &amp; ASTROLABE GIMBAL)
                    </span>
                    <span className="text-cyan-400 font-bold">
                      {Math.round(settings.explodedView * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={settings.explodedView}
                    onChange={(e) => onUpdateSettings({ explodedView: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-950 rounded border border-slate-800"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Tactile Assembly (0%)</span>
                    <span>Deconstructed Layers (100%)</span>
                  </div>
                </div>

                {/* Material Finish Swatches */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                    PBR METALLURGICAL FINISH
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {finishes.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => onUpdateSettings({ materialFinish: f.id })}
                        className={`p-2 rounded border flex items-center gap-2 cursor-pointer transition-all ${
                          settings.materialFinish === f.id
                            ? 'bg-cyan-950/80 border-cyan-400 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: f.color }}
                        />
                        <span className="text-[11px] font-bold truncate">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auxiliary 3D Toggles */}
                <div className="flex flex-wrap items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-[11px]">
                    <input
                      type="checkbox"
                      checked={settings.isAutoRotate}
                      onChange={(e) => onUpdateSettings({ isAutoRotate: e.target.checked })}
                      className="accent-cyan-400"
                    />
                    <span>Astrolabe Orbital Gyro</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-[11px]">
                    <input
                      type="checkbox"
                      checked={settings.showHangingLoop}
                      onChange={(e) => onUpdateSettings({ showHangingLoop: e.target.checked })}
                      className="accent-cyan-400"
                    />
                    <span>Zenith Hanging Loop</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'EXPORT' && (
              <div className="flex flex-col gap-3 text-xs bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                    PHYSICAL FABRICATION &amp; VECTOR EXPORT SUITE
                  </span>
                  <span className="text-[10px] text-cyan-400">DOUBLE-SIDED EMBOSSED SPEC</span>
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  Export double-sided embossed structural medallions and functional mechanical astrolabes embedded with hanging loops for 3D printing or tactical display.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={onExportSTL}
                    className="p-3 bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-100 rounded-lg font-bold flex flex-col gap-1 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-white">
                      <Download className="w-4 h-4 text-cyan-400" />
                      <span>EXPORT 3D STL (.stl)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      For tactile 3D printing with Zenith loop &amp; double-sided relief
                    </span>
                  </button>

                  <button
                    onClick={onExportSVG}
                    className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-700 text-slate-200 rounded-lg font-bold flex flex-col gap-1 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-white">
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>EXPORT VECTOR BLUEPRINT (.svg)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      High-resolution Gallifreyan circular logic schematic
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
