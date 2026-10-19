/**
 * @file ScenarioSelector.tsx
 * Scenario Selector & Gallifreyan Circular Syntax Parser Input
 * Allows switching between laboratory benchmarks or entering custom conceptual strings.
 */

import React, { useState } from 'react';
import { PRESET_SCENARIOS } from '../core/parser';
import { Sparkles, Terminal, BookOpen } from 'lucide-react';

interface ScenarioSelectorProps {
  currentScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  onParseCustomText: (text: string) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  currentScenarioId,
  onSelectScenario,
  onParseCustomText,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onParseCustomText(customInput.trim());
    }
  };

  return (
    <div className="flex flex-col gap-3 font-mono text-xs select-none">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
            SYNTAX &amp; SCENARIO BENCHMARKS
          </span>
        </div>
        <button
          onClick={() => setIsCustomMode(!isCustomMode)}
          className="text-[10px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
        >
          {isCustomMode ? '← Benchmark Vectors' : '+ Custom Semantic Parser'}
        </button>
      </div>

      {!isCustomMode ? (
        /* Preset Scenarios Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {PRESET_SCENARIOS.map((sc) => {
            const isSelected = currentScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc.id)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-100 ring-1 ring-cyan-400/30'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                    {sc.tag}
                  </span>
                  <span
                    className={`text-[9px] font-bold ${
                      sc.baseClassification === 'SELF_SUSTAINING'
                        ? 'text-cyan-400'
                        : sc.baseClassification === 'FORCED'
                        ? 'text-slate-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {sc.baseClassification}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-200 leading-snug">{sc.name}</div>
                <div className="text-[10px] text-slate-400 line-clamp-2 leading-tight">{sc.description}</div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Custom Circular Logic String Parser Input */
        <form onSubmit={handleCustomSubmit} className="flex flex-col gap-2 bg-slate-900/90 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-200">
              NATURAL LANGUAGE &amp; CONCEPTUAL LOGIC TREE INPUT
            </span>
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            Maps semantic tokens to concentric boundary rings, varying line widths, interlocking circular ornamentation markers, and double-sided extruded medallions.
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. NON_COERCIVE_TEMPORAL_EQUILIBRIUM // FREEDOM_BOND"
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono text-xs"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 rounded font-bold cursor-pointer transition-all flex items-center gap-1 text-xs"
            >
              <Sparkles className="w-3 h-3" />
              <span>PARSE SIGIL</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
