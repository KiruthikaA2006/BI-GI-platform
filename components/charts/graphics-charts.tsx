"use client";

import React, { useState } from "react";

// 1. Vertical Column / Bar Chart (Matching Reference Image)
export interface BarChartData {
  label: string;
  value: number;
  value2?: number;
}

export function VerticalBarChart({
  data,
  height = 260,
  barColor = "#7c3aed",
  barColor2 = "#06b6d4",
  title = "Monthly Bar Chart",
}: {
  data: BarChartData[];
  height?: number;
  barColor?: string;
  barColor2?: string;
  title?: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-xs font-bold text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
        No dataset records available for bar chart.
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => Math.max(d.value || 0, d.value2 || 0)), 1);

  // Y-axis grid ticks
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(maxVal * ratio));

  return (
    <div className="bg-white border border-stone-200 p-6 rounded-3xl space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-stone-900 uppercase tracking-tight">{title}</h3>
        <div className="flex items-center gap-3 text-[11px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: barColor }} />
            <span className="text-stone-700">Primary Metric</span>
          </div>
          {data[0]?.value2 !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: barColor2 }} />
              <span className="text-stone-700">Secondary Metric</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative pt-4">
        {/* Y-Axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 text-[10px] font-mono font-bold text-stone-400">
          {ticks.slice().reverse().map((t, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-10 text-right">
                {t >= 1000000 ? `${(t / 1000000).toFixed(1)}M` : t >= 1000 ? `${(t / 1000).toFixed(0)}k` : t}
              </span>
              <div className="h-px bg-stone-200 flex-1 border-b border-dashed border-stone-200" />
            </div>
          ))}
        </div>

        {/* Bar Columns Grid */}
        <div className="ml-12 flex items-end justify-between gap-2 h-56 pt-4 pb-8 relative z-10">
          {data.map((d, idx) => {
            const heightPct1 = Math.max(Math.round(((d.value || 0) / maxVal) * 100), 4);
            const heightPct2 = d.value2 !== undefined ? Math.max(Math.round(((d.value2 || 0) / maxVal) * 100), 4) : null;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
              >
                {/* Tooltip Hover Callout */}
                {isHovered && (
                  <div className="absolute -top-10 bg-stone-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg shadow-xl z-30 whitespace-nowrap animate-in fade-in duration-150">
                    {d.label}: {d.value.toLocaleString()} {d.value2 !== undefined ? `| ${d.value2.toLocaleString()}` : ""}
                  </div>
                )}

                {/* Bars Container */}
                <div className="flex items-end justify-center gap-1 w-full h-full">
                  <div
                    className="w-full max-w-[18px] rounded-t-lg transition-all duration-300 shadow-sm group-hover:brightness-110"
                    style={{
                      height: `${heightPct1}%`,
                      backgroundColor: barColor,
                    }}
                  />
                  {heightPct2 !== null && (
                    <div
                      className="w-full max-w-[18px] rounded-t-lg transition-all duration-300 shadow-sm group-hover:brightness-110"
                      style={{
                        height: `${heightPct2}%`,
                        backgroundColor: barColor2,
                      }}
                    />
                  )}
                </div>

                {/* X-Axis Label */}
                <span className="absolute -bottom-6 text-[10px] font-bold text-stone-500 group-hover:text-stone-900 transition">
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 2. Smooth Curved SVG Line & Area Chart
export function CurvedLineAreaChart({
  data,
  height = 240,
  lineColor = "#ea580c",
  fillGradient = "rgba(234, 88, 12, 0.15)",
  title = "Growth Velocity Trajectory",
}: {
  data: { label: string; value: number }[];
  height?: number;
  lineColor?: string;
  fillGradient?: string;
  title?: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.value || 0), 1);
  const minVal = 0;
  const padding = 30;
  const chartWidth = 600;
  const chartHeight = height;

  // Build SVG path points
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - ((d.value - minVal) / (maxVal - minVal)) * (chartHeight - padding * 2);
    return { x, y, label: d.label, value: d.value };
  });

  // Generate smooth SVG cubic bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp1y = curr.y;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    const cp2y = next.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  // Area path for gradient background fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <div className="bg-white border border-stone-200 p-6 rounded-3xl space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-stone-900 uppercase tracking-tight">{title}</h3>
        <span className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
          Smooth Curve SVG
        </span>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Curved Line Stroke */}
          <path d={pathD} fill="none" stroke={lineColor} strokeWidth="3.5" strokeLinecap="round" />

          {/* Interactive Circle Data Nodes */}
          {points.map((pt, i) => (
            <g key={i} className="cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === i ? 7 : 4}
                fill="#ffffff"
                stroke={lineColor}
                strokeWidth="3"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="transition-all duration-200"
              />

              {/* Data Point Tooltip Callout */}
              {hoveredIdx === i && (
                <g transform={`translate(${pt.x}, ${pt.y - 25})`}>
                  <rect x="-35" y="-18" width="70" height="22" rx="6" fill="#18181b" />
                  <text x="0" y="-3" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                    ${(pt.value / 1000).toFixed(1)}k
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

// 3. Circular Donut Ring Pie Chart (Matching Reference Image Arc Rings)
export function CircularDonutChart({
  percentage = 45,
  title = "Overview Share",
  subtitle = "Total Target Progress",
  ringColor = "#0d9488",
}: {
  percentage: number;
  title?: string;
  subtitle?: string;
  ringColor?: string;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white border border-stone-200 p-6 rounded-3xl space-y-3 shadow-sm flex flex-col justify-between items-center text-center">
      <div className="w-full flex items-center justify-between text-left">
        <span className="text-[10px] font-bold text-stone-500 uppercase">{subtitle}</span>
      </div>

      <div className="relative flex items-center justify-center my-2">
        <svg className="w-32 h-32 transform -rotate-90">
          {/* Background Ring Track */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#e7e5e4"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Active Colored Arc Fill */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={ringColor}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-black text-stone-900">{percentage}%</span>
          <span className="text-[10px] font-bold text-stone-400 uppercase">Share</span>
        </div>
      </div>

      <span className="text-xs font-black text-stone-800 uppercase tracking-tight">{title}</span>
    </div>
  );
}

// 4. Horizontal Progress Bar List (Matching Left Bottom Panel of Reference Image)
export function HorizontalProgressBarList({
  items,
}: {
  items: { label: string; value: number; color: string; max?: number }[];
}) {
  return (
    <div className="bg-white border border-stone-200 p-6 rounded-3xl space-y-4 shadow-sm">
      <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">Metrics Performance Breakdown</h3>
      <div className="space-y-4">
        {items.map((item, idx) => {
          const maxVal = item.max || 100;
          const pct = Math.min(Math.round((item.value / maxVal) * 100), 100);

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-stone-700">{item.label}</span>
                <span className="text-stone-900 font-mono">{item.value.toLocaleString()}</span>
              </div>
              <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                <div
                  className="h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
