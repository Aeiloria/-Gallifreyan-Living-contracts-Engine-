/**
 * @file CompersionFluxChart.tsx
 * D3-based real-time telemetry line chart visualizing 'Compersion' flux
 * over the 4-stage playback progress timeline (x -> z -> z').
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { GallifreyanMatrixModel, StateClassification } from '../types/engine';
import { computeStageTelemetry } from '../core/parser';
import { Activity, Eye, Zap, Layers } from 'lucide-react';

interface CompersionFluxChartProps {
  model: GallifreyanMatrixModel;
  playbackProgress: number; // 0.0 to 1.0
  classification: StateClassification;
  onSeek?: (progress: number) => void;
}

interface DataPoint {
  t: number;
  compositeFlux: number;
  b_gain_verified: number;
  a_response_positive: number;
  non_deprivation: number;
  non_capture: number;
  distinctness_maintained: number;
}

export const CompersionFluxChart: React.FC<CompersionFluxChartProps> = ({
  model,
  playbackProgress,
  classification,
  onSeek,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [showMultiTraces, setShowMultiTraces] = useState<boolean>(true);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 480, height: 180 });

  // Precompute 101 sample points across the playback progression timeline [0.0, 1.0]
  const timelineData: DataPoint[] = useMemo(() => {
    const points: DataPoint[] = [];
    const steps = 100;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const telem = computeStageTelemetry(model.telemetry, model.classification, t);
      const composite =
        (telem.b_gain_verified +
          telem.a_response_positive +
          telem.non_deprivation +
          telem.non_capture +
          telem.distinctness_maintained) /
        5.0;

      points.push({
        t,
        compositeFlux: composite,
        b_gain_verified: telem.b_gain_verified,
        a_response_positive: telem.a_response_positive,
        non_deprivation: telem.non_deprivation,
        non_capture: telem.non_capture,
        distinctness_maintained: telem.distinctness_maintained,
      });
    }
    return points;
  }, [model.telemetry, model.classification]);

  // Current real-time value at playback progress
  const currentTelemetry = useMemo(() => {
    return computeStageTelemetry(model.telemetry, model.classification, playbackProgress);
  }, [model.telemetry, model.classification, playbackProgress]);

  const currentCompositeFlux =
    (currentTelemetry.b_gain_verified +
      currentTelemetry.a_response_positive +
      currentTelemetry.non_deprivation +
      currentTelemetry.non_capture +
      currentTelemetry.distinctness_maintained) /
    5.0;

  // Handle container resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          setDimensions({ width: Math.max(300, width), height: 180 });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Primary D3 Chart Render (Base curves, grid, background bands, axes)
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 22, right: 28, bottom: 28, left: 38 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // D3 Scales
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([0, 1.1]).range([innerHeight, 0]);

    // Defs: Gradients and filters
    const defs = svg.append('defs');

    // Gradient for composite flux area
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'compersionAreaGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    const areaColor =
      classification === 'SELF_SUSTAINING'
        ? '#38bdf8'
        : classification === 'FORCED'
        ? '#64748b'
        : '#f59e0b';

    areaGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', areaColor)
      .attr('stop-opacity', 0.35);

    areaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', areaColor)
      .attr('stop-opacity', 0.0);

    // 1. Stage Background Zones (A, B, C, D)
    const stages = [
      { start: 0.0, end: 0.33, label: 'STAGE A (x)', color: '#0369a1', opacity: 0.08 },
      { start: 0.33, end: 0.66, label: 'STAGE B (V₁)', color: '#0284c7', opacity: 0.12 },
      { start: 0.66, end: 0.99, label: 'STAGE C (Δz)', color: '#0ea5e9', opacity: 0.16 },
      {
        start: 0.99,
        end: 1.0,
        label: 'STAGE D (z\')',
        color: classification === 'FORCED' ? '#ef4444' : '#10b981',
        opacity: 0.22,
      },
    ];

    stages.forEach((st) => {
      g.append('rect')
        .attr('x', xScale(st.start))
        .attr('y', 0)
        .attr('width', Math.max(2, xScale(st.end) - xScale(st.start)))
        .attr('height', innerHeight)
        .attr('fill', st.color)
        .attr('opacity', st.opacity);

      g.append('text')
        .attr('x', xScale((st.start + st.end) / 2))
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#94a3b8')
        .attr('font-size', '8px')
        .attr('font-family', 'monospace')
        .attr('letter-spacing', '0.05em')
        .text(st.label);
    });

    // 2. Horizontal Reference Gridlines
    const yTicks = [0.25, 0.5, 0.7, 1.0];
    yTicks.forEach((tick) => {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(tick))
        .attr('y2', yScale(tick))
        .attr('stroke', tick === 0.7 ? '#f43f5e' : '#1e293b')
        .attr('stroke-width', tick === 0.7 ? 1.2 : 0.8)
        .attr('stroke-dasharray', tick === 0.7 ? '3 3' : '2 2')
        .attr('opacity', tick === 0.7 ? 0.75 : 0.4);
    });

    // Label for 0.70 Critical Autonomy Threshold
    g.append('text')
      .attr('x', innerWidth - 4)
      .attr('y', yScale(0.7) - 3)
      .attr('text-anchor', 'end')
      .attr('fill', '#f43f5e')
      .attr('font-size', '8px')
      .attr('font-family', 'monospace')
      .text('THRESHOLD ε = 0.70');

    // 3. Axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickFormat((d) => `${Math.round((d as number) * 100)}%`);

    const yAxis = d3.axisLeft(yScale).ticks(4).tickFormat((d) => (d as number).toFixed(1));

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .call((axis) => {
        axis.select('.domain').attr('stroke', '#334155');
        axis.selectAll('.tick line').attr('stroke', '#334155');
        axis.selectAll('.tick text').attr('fill', '#64748b').attr('font-size', '9px');
      });

    g.append('g')
      .call(yAxis)
      .call((axis) => {
        axis.select('.domain').attr('stroke', '#334155');
        axis.selectAll('.tick line').attr('stroke', '#334155');
        axis.selectAll('.tick text').attr('fill', '#64748b').attr('font-size', '9px');
      });

    // 4. Secondary Individual Observable Traces (Optional Multi-lines)
    if (showMultiTraces) {
      const traces: { key: keyof DataPoint; color: string; label: string }[] = [
        { key: 'b_gain_verified', color: '#34d399', label: 'b_gain' },
        { key: 'a_response_positive', color: '#38bdf8', label: 'a_resp' },
        { key: 'non_deprivation', color: '#0284c7', label: 'non_depriv' },
        { key: 'non_capture', color: '#c084fc', label: 'non_capture' },
        { key: 'distinctness_maintained', color: '#f59e0b', label: 'distinct' },
      ];

      traces.forEach((tr) => {
        const lineGen = d3
          .line<DataPoint>()
          .x((d) => xScale(d.t))
          .y((d) => yScale(d[tr.key] as number))
          .curve(d3.curveMonotoneX);

        g.append('path')
          .datum(timelineData)
          .attr('fill', 'none')
          .attr('stroke', tr.color)
          .attr('stroke-width', 1.0)
          .attr('stroke-dasharray', classification === 'FORCED' ? '3 2' : null)
          .attr('opacity', 0.45)
          .attr('d', lineGen);
      });
    }

    // 5. Area Fill under Composite Compersion Flux Line
    const areaGen = d3
      .area<DataPoint>()
      .x((d) => xScale(d.t))
      .y0(innerHeight)
      .y1((d) => yScale(d.compositeFlux))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(timelineData)
      .attr('fill', 'url(#compersionAreaGradient)')
      .attr('d', areaGen);

    // 6. Master Composite Compersion Flux Line
    const mainLineGen = d3
      .line<DataPoint>()
      .x((d) => xScale(d.t))
      .y((d) => yScale(d.compositeFlux))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(timelineData)
      .attr('fill', 'none')
      .attr('stroke', areaColor)
      .attr('stroke-width', 2.4)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', mainLineGen);

    // 7. Dynamic Real-time Playhead Group
    const playheadGroup = g.append('g').attr('id', 'd3-playhead-group');

    // Vertical scanline
    playheadGroup
      .append('line')
      .attr('id', 'd3-playhead-line')
      .attr('x1', xScale(playbackProgress))
      .attr('x2', xScale(playbackProgress))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#f8fafc')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '2 2')
      .attr('opacity', 0.9);

    // Glowing Cursor Dot at active value
    playheadGroup
      .append('circle')
      .attr('id', 'd3-playhead-dot')
      .attr('cx', xScale(playbackProgress))
      .attr('cy', yScale(currentCompositeFlux))
      .attr('r', 5)
      .attr('fill', areaColor)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    // 8. Interactive Scrub Click & Drag Overlay
    const overlay = g
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair');

    let isSeeking = false;

    const handlePointerAction = (event: MouseEvent | TouchEvent) => {
      const coords = d3.pointer(event, overlay.node());
      const normalizedX = Math.max(0, Math.min(1, xScale.invert(coords[0])));
      if (onSeek) onSeek(normalizedX);
    };

    overlay
      .on('mousedown', (event) => {
        isSeeking = true;
        handlePointerAction(event);
      })
      .on('mousemove', (event) => {
        if (isSeeking) handlePointerAction(event);
      })
      .on('mouseup', () => {
        isSeeking = false;
      })
      .on('mouseleave', () => {
        isSeeking = false;
      });
  }, [timelineData, dimensions, classification, showMultiTraces]);

  // Fast-Path Playhead Update on playback progress tick without recreating whole SVG
  useEffect(() => {
    if (!svgRef.current) return;
    const { width, height } = dimensions;
    const margin = { top: 22, right: 28, bottom: 28, left: 38 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([0, 1.1]).range([innerHeight, 0]);

    const curX = xScale(playbackProgress);
    const curY = yScale(currentCompositeFlux);

    d3.select('#d3-playhead-line').attr('x1', curX).attr('x2', curX);
    d3.select('#d3-playhead-dot').attr('cx', curX).attr('cy', curY);
  }, [playbackProgress, currentCompositeFlux, dimensions]);

  return (
    <div
      ref={containerRef}
      className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex flex-col gap-2 font-mono text-xs select-none w-full"
    >
      {/* Telemetry Header with Dynamic Metric Callout */}
      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-slate-800/80 pb-1.5">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] uppercase font-bold text-slate-200 tracking-wider">
            D3 COMPERSION FLUX STREAM [Φ(t)]
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
            REAL-TIME TELEMETRY
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Live Readout */}
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] text-slate-400">Φ:</span>
            <span className="text-xs font-bold text-cyan-300">
              {currentCompositeFlux.toFixed(3)}
            </span>
            <span
              className={`text-[9px] font-bold ml-1 ${
                currentCompositeFlux >= 0.70 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {currentCompositeFlux >= 0.70 ? 'COHESIVE' : 'DEGRADED'}
            </span>
          </div>

          {/* Toggle Multi-Observable Sub-Traces */}
          <button
            onClick={() => setShowMultiTraces(!showMultiTraces)}
            title="Toggle individual observable traces"
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
              showMultiTraces
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-2.5 h-2.5" />
            <span>{showMultiTraces ? '5 TRACES' : 'COMPOSITE'}</span>
          </button>
        </div>
      </div>

      {/* D3 SVG Canvas */}
      <div className="relative w-full overflow-hidden bg-slate-950/90 rounded border border-slate-800/80">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full block"
        />
      </div>

      {/* Trace Color Legend & Instructions */}
      <div className="flex flex-wrap items-center justify-between text-[9px] text-slate-400 px-1">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-cyan-400 rounded" />
            <span className="text-slate-300 font-semibold">Master Compersion Flux [Φ]</span>
          </span>
          {showMultiTraces && (
            <>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-0.5 bg-emerald-400" /> b_gain
              </span>
              <span className="flex items-center gap-1 text-sky-400">
                <span className="w-2 h-0.5 bg-sky-400" /> a_resp
              </span>
              <span className="flex items-center gap-1 text-blue-500">
                <span className="w-2 h-0.5 bg-blue-500" /> non_depriv
              </span>
              <span className="flex items-center gap-1 text-purple-400">
                <span className="w-2 h-0.5 bg-purple-400" /> non_capture
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-0.5 bg-amber-400" /> distinct
              </span>
            </>
          )}
        </div>
        <span className="text-slate-500 italic hidden sm:inline">
          Drag on chart to scrub timeline
        </span>
      </div>
    </div>
  );
};
