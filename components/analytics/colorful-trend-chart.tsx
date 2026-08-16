"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, ArrowDownRight, ArrowUpRight, Calendar, Info, RefreshCw } from "lucide-react";

interface TrendPoint {
  label: string;
  sales: number;
  returns: number;
  revenue: number;
  time: string;
}

interface TrendChartProps {
  title?: string;
  subtitle?: string;
  salesCount?: string;
  salesChange?: string;
  returnsCount?: string;
  returnsChange?: string;
  orgName?: string;
  initialTrends?: any[];
}

export function ColorfulTrendChart({
  title = "Sales & Returns Velocity",
  subtitle = "Real-time sales and returns velocity calculated from active dataset",
  salesCount = "0",
  salesChange = "0.0%",
  returnsCount = "0",
  returnsChange = "0.0%",
  orgName,
  initialTrends,
}: TrendChartProps) {
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");
  const [selectedIndex, setSelectedIndex] = useState<number>(4); // Default to Friday (index 4)
  const [liveData, setLiveData] = useState<TrendPoint[]>([]);

  // Default Weekly Dataset
  const weeklyData: TrendPoint[] = [
    { label: "Mon", sales: 1200, returns: 140, revenue: 14400, time: "10 March (Mon)" },
    { label: "Tue", sales: 1850, returns: 120, revenue: 22200, time: "11 March (Tue)" },
    { label: "Wed", sales: 3200, returns: 210, revenue: 38400, time: "12 March (Wed)" },
    { label: "Thu", sales: 2600, returns: 190, revenue: 31200, time: "13 March (Thu)" },
    { label: "Fri", sales: 4782, returns: 150, revenue: 57384, time: "14 March (Fri)" },
    { label: "Sat", sales: 4100, returns: 180, revenue: 49200, time: "15 March (Sat)" },
    { label: "Sun", sales: 3900, returns: 160, revenue: 46800, time: "16 March (Sun)" },
  ];

  // Default Monthly Dataset (Jan - Dec)
  const monthlyData: TrendPoint[] = [
    { label: "Jan", sales: 2400, returns: 280, revenue: 28800, time: "January 2026" },
    { label: "Feb", sales: 3100, returns: 260, revenue: 37200, time: "February 2026" },
    { label: "Mar", sales: 4782, returns: 150, revenue: 57384, time: "March 2026" },
    { label: "Apr", sales: 4200, returns: 220, revenue: 50400, time: "April 2026" },
    { label: "May", sales: 4900, returns: 190, revenue: 58800, time: "May 2026" },
    { label: "Jun", sales: 5300, returns: 210, revenue: 63600, time: "June 2026" },
    { label: "Jul", sales: 5800, returns: 230, revenue: 69600, time: "July 2026" },
    { label: "Aug", sales: 6100, returns: 240, revenue: 73200, time: "August 2026" },
    { label: "Sep", sales: 5900, returns: 210, revenue: 70800, time: "September 2026" },
    { label: "Oct", sales: 6400, returns: 200, revenue: 76800, time: "October 2026" },
    { label: "Nov", sales: 7200, returns: 250, revenue: 86400, time: "November 2026" },
    { label: "Dec", sales: 8500, returns: 290, revenue: 102000, time: "December 2026" },
  ];

  useEffect(() => {
    if (initialTrends && Array.isArray(initialTrends) && initialTrends.length > 0) {
      const parsed = initialTrends.map((t) => ({
        label: t.month || t.label || "P",
        sales: t.sales || Math.round((t.revenue || 0) / 50) || 100,
        returns: t.expenses ? Math.round((t.expenses || 0) / 100) : 50,
        revenue: t.revenue || 0,
        time: `Period: ${t.month || "Current"}`,
      }));
      setLiveData(parsed);
    } else {
      setLiveData(viewMode === "weekly" ? weeklyData : monthlyData);
    }
  }, [initialTrends, viewMode]);

  const activePoints = liveData.length > 0 ? liveData : (viewMode === "weekly" ? weeklyData : monthlyData);
  const safeIndex = Math.min(selectedIndex, activePoints.length - 1);
  const selectedPoint = activePoints[safeIndex] || activePoints[0];

  // SVG dimensions
  const viewBoxWidth = 700;
  const viewBoxHeight = 160;
  const marginTop = 25;
  const marginBottom = 25;
  const chartHeight = viewBoxHeight - marginTop - marginBottom;

  const maxSales = Math.max(...activePoints.map((p) => p.sales || 1), 1);
  const maxReturns = Math.max(...activePoints.map((p) => p.returns || 1), 1);

  // Compute dynamic (x, y) coordinates for each point
  const coords = activePoints.map((p, i) => {
    const x = (i / Math.max(activePoints.length - 1, 1)) * (viewBoxWidth - 40) + 20;
    const ySales = viewBoxHeight - marginBottom - ((p.sales / maxSales) * chartHeight);
    const yReturns = viewBoxHeight - marginBottom - ((p.returns / maxReturns) * (chartHeight * 0.5));
    return { x, ySales, yReturns, ...p };
  });

  // Generate smooth SVG curve path strings dynamically
  const generateSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${p1.x},${p1.y}`;
    }
    return path;
  };

  const salesPoints = coords.map((c) => ({ x: c.x, y: c.ySales }));
  const returnsPoints = coords.map((c) => ({ x: c.x, y: c.yReturns }));

  const salesLineD = generateSmoothPath(salesPoints);
  const returnsLineD = generateSmoothPath(returnsPoints);

  const salesAreaD = `${salesLineD} L ${coords[coords.length - 1].x},${viewBoxHeight - marginBottom} L ${coords[0].x},${viewBoxHeight - marginBottom} Z`;
  const returnsAreaD = `${returnsLineD} L ${coords[coords.length - 1].x},${viewBoxHeight - marginBottom} L ${coords[0].x},${viewBoxHeight - marginBottom} Z`;

  const selectedCoord = coords[safeIndex] || coords[0];
  const tooltipXPercent = (selectedCoord.x / viewBoxWidth) * 100;

  return (
    <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-6 shadow-sm">
      {/* Top Header & Stat Badges (Matching Screenshot 5) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">
              LIVE TREND ANALYTICS {orgName ? `• ${orgName}` : ""}
            </span>
            <span className="text-[10px] font-bold text-stone-400">| Interactive Viz</span>
          </div>
          <h3 className="text-xl font-black text-stone-900 tracking-tight">{title}</h3>
          <p className="text-xs text-stone-500 font-medium">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Toggle View Pills */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-bold">
            <button
              onClick={() => {
                setViewMode("weekly");
                setSelectedIndex(4);
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === "weekly" ? "bg-white text-stone-900 shadow-sm font-extrabold" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Weekly (7 Days)
            </button>
            <button
              onClick={() => {
                setViewMode("monthly");
                setSelectedIndex(2);
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === "monthly" ? "bg-white text-stone-900 shadow-sm font-extrabold" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Monthly (Jan-Dec)
            </button>
          </div>

          {/* Dynamic Stat Badges */}
          <div className="flex items-center gap-5 bg-stone-50 border border-stone-200 px-5 py-2.5 rounded-2xl">
            {/* Sales Stat Badge */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 uppercase">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Selected Sales</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-stone-900">
                  {selectedPoint.sales.toLocaleString()}
                </span>
                <span className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black px-2 py-0.5 rounded-md flex items-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3" />
                  {salesChange}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-stone-300" />

            {/* Returns Stat Badge */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 uppercase">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span>Returns / Costs</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-stone-900">
                  {selectedPoint.returns.toLocaleString()}
                </span>
                <span className="bg-rose-100 border border-rose-300 text-rose-800 text-xs font-black px-2 py-0.5 rounded-md flex items-center gap-0.5">
                  <ArrowDownRight className="h-3 w-3" />
                  {returnsChange}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic SVG Smooth Curve Area Chart */}
      <div className="relative pt-6 pb-2">
        <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-48 overflow-visible">
          <defs>
            <linearGradient id="salesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="retGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Reference Grid lines */}
          <line x1="0" y1="25" x2={viewBoxWidth} y2="25" stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1="0" y1="65" x2={viewBoxWidth} y2="65" stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1="0" y1="105" x2={viewBoxWidth} y2="105" stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1="0" y1="135" x2={viewBoxWidth} y2="135" stroke="#e2e8f0" />

          {/* Vertical Guide Line for Selected Point */}
          {selectedCoord && (
            <line
              x1={selectedCoord.x}
              y1="10"
              x2={selectedCoord.x}
              y2="135"
              stroke="#10b981"
              strokeDasharray="3 3"
              strokeWidth="1.5"
              className="transition-all duration-300"
            />
          )}

          {/* Returns Area & Line */}
          <path d={returnsAreaD} fill="url(#retGrad)" />
          <path d={returnsLineD} fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Sales Area & Smooth Green Curve */}
          <path d={salesAreaD} fill="url(#salesGrad)" />
          <path d={salesLineD} fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />

          {/* Interactive Highlight Dots (Dynamically moving to selectedCoord) */}
          {selectedCoord && (
            <g className="transition-all duration-300">
              <circle
                cx={selectedCoord.x}
                cy={selectedCoord.ySales}
                r="7"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="3"
                className="shadow-xl"
              />
              <circle
                cx={selectedCoord.x}
                cy={selectedCoord.yReturns}
                r="4.5"
                fill="#94a3b8"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Invisible Click Targets across points */}
          {coords.map((c, i) => (
            <rect
              key={i}
              x={c.x - 20}
              y={0}
              width={40}
              height={viewBoxHeight}
              fill="transparent"
              className="cursor-pointer"
              onClick={() => setSelectedIndex(i)}
              onMouseEnter={() => setSelectedIndex(i)}
            />
          ))}
        </svg>

        {/* Dynamic Tooltip Box following selected position */}
        {selectedPoint && (
          <div
            style={{ left: `${tooltipXPercent}%` }}
            className="absolute top-0 -translate-x-1/2 bg-white border border-stone-300 shadow-2xl rounded-2xl p-3 text-stone-900 pointer-events-none z-20 transition-all duration-300 min-w-[150px]"
          >
            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">
              {selectedPoint.time}
            </span>
            <div className="text-sm font-black text-stone-900 flex items-baseline gap-1 mt-0.5">
              <span>{selectedPoint.sales.toLocaleString()}</span>
              <span className="text-[11px] font-bold text-emerald-700">sales</span>
            </div>
            {selectedPoint.revenue > 0 && (
              <div className="text-[11px] font-bold text-stone-500">
                Revenue: ${selectedPoint.revenue.toLocaleString()}
              </div>
            )}
            <div className="text-[10px] font-bold text-rose-600 mt-0.5">
              Returns / Costs: {selectedPoint.returns.toLocaleString()}
            </div>
          </div>
        )}

        {/* X-Axis Days / Months Labels */}
        <div className="flex justify-between items-center px-2 pt-3 border-t border-stone-200 overflow-x-auto gap-1">
          {activePoints.map((d, idx) => (
            <button
              key={d.label + idx}
              onClick={() => setSelectedIndex(idx)}
              onMouseEnter={() => setSelectedIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-1 text-center ${
                safeIndex === idx
                  ? "bg-stone-900 text-white shadow-md font-black scale-105"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

