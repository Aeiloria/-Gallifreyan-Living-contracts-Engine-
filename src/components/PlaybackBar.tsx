/**
 * @file PlaybackBar.tsx
 * 4-Stage Interactive Playback Bar for State-Space Transitions
 * Adheres strictly to the state-space pipeline: x -> z -> z'
 */

import React from 'react';
import { PlaybackStage, StageDefinition } from '../types/engine';
import { STAGES } from '../core/parser';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, FastForward } from 'lucide-react';

interface PlaybackBarProps {
  currentStage: PlaybackStage;
  progress: number; // 0 to 1
  isPlaying: boolean;
  speed: number;
  onTogglePlay: () => void;
  onSeek: (value: number) => void;
  onSelectStage: (stage: PlaybackStage) => void;
  onReset: () => void;
  onCycleSpeed: () => void;
}

export const PlaybackBar: React.FC<PlaybackBarProps> = ({
  currentStage,
  progress,
  isPlaying,
  speed,
  onTogglePlay,
  onSeek,
  onSelectStage,
  onReset,
  onCycleSpeed,
}) => {
  const currentStageDef = STAGES.find((s) => s.id === currentStage) || STAGES[0];

  const handleStepStage = (direction: -1 | 1) => {
    const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
    const nextIndex = Math.max(0, Math.min(STAGES.length - 1, currentIndex + direction));
    onSelectStage(STAGES[nextIndex].id);
    onSeek(STAGES[nextIndex].phaseTime);
  };

  return (
    <div className="flex flex-col gap-2.5 font-mono text-xs w-full select-none">
      {/* 4-Stage Discrete Stepper Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 w-full">
        {STAGES.map((s: StageDefinition) => {
          const isActive = currentStage === s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                onSelectStage(s.id);
                onSeek(s.phaseTime);
              }}
              className={`p-2 rounded border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                isActive
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/30'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase">{s.label.split(':')[0]}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800/80 text-slate-300 font-mono">
                  {s.mathSymbol.replace(/\\mathbb\{R\}\^n/g, 'ℝⁿ').replace(/\\xrightarrow\{V_1\}/g, '→(V₁)').replace(/\\Delta/g, 'Δ').replace(/\\in/g, '∈')}
                </span>
              </div>
              <div className="text-[11px] font-semibold truncate text-slate-200">{s.subLabel}</div>
            </button>
          );
        })}
      </div>

      {/* Scrub Slider & Controls Row */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onReset}
            title="Reset to Baseline"
            className="p-1.5 rounded border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleStepStage(-1)}
            title="Previous Stage"
            className="p-1.5 rounded border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'Pause Playback' : 'Play Transition'}
            className="px-3 py-1.5 rounded border border-cyan-500 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 hover:text-cyan-100 transition-all cursor-pointer flex items-center gap-1 font-bold"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>EXECUTE</span>
              </>
            )}
          </button>
          <button
            onClick={() => handleStepStage(1)}
            title="Next Stage"
            className="p-1.5 rounded border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onCycleSpeed}
            title="Cycle Playback Speed"
            className="px-2 py-1.5 rounded border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
          >
            <FastForward className="w-3 h-3" />
            <span>{speed}x</span>
          </button>
        </div>

        {/* Timeline Scrub Slider */}
        <div className="flex-1 w-full flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono w-10 text-right">
            {Math.round(progress * 100)}%
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.005}
            value={progress}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="flex-1 accent-cyan-400 cursor-pointer h-1.5 bg-slate-950 rounded border border-slate-800"
          />
          <div className="text-[10px] text-cyan-300 truncate max-w-[200px] hidden sm:block">
            {currentStageDef.subLabel}
          </div>
        </div>
      </div>
    </div>
  );
};
