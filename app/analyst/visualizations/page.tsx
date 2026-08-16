"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Table,
  ArrowRight,
  Activity,
  Palette,
  CheckCircle2,
} from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";
import {
  VerticalBarChart,
  CurvedLineAreaChart,
  CircularDonutChart,
  HorizontalProgressBarList,
} from "@/components/charts/graphics-charts";

export default function AnalystVisualizationsPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "table" | "kpi">("bar");
  const [colorTheme, setColorTheme] = useState<"vibrant" | "emerald" | "purple" | "amber">("vibrant");

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);

    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data);
        }
      })
      .catch((err) => console.error("Error fetching stats for analyst visualizations:", err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = stats?.metrics;
  const trends = stats?.trends || [];
  const regional = stats?.regional || [];
  const hasRealData = stats?.source === "database" && metrics;

  // Format data for Vertical Column Bar Chart
  const barChartData = trends.length > 0
    ? trends.map((t: any) => ({
        label: t.month,
        value: Math.round((t.revenue || 0) / 100),
        value2: Math.round((t.expenses || 0) / 100),
      }))
    : [
        { label: "Jan", value: 120, value2: 80 },
        { label: "Feb", value: 180, value2: 110 },
        { label: "Mar", value: 150, value2: 95 },
        { label: "Apr", value: 220, value2: 140 },
        { label: "May", value: 190, value2: 120 },
        { label: "Jun", value: 280, value2: 175 },
        { label: "Jul", value: 240, value2: 160 },
        { label: "Aug", value: 310, value2: 190 },
      ];

  // Format data for Curved Line & Area Chart
  const lineChartData = trends.length > 0
    ? trends.map((t: any) => ({
        label: t.month,
        value: Math.round((t.revenue || 0) / 100),
      }))
    : [
        { label: "Mon", value: 12300 },
        { label: "Tue", value: 15400 },
        { label: "Wed", value: 28900 },
        { label: "Thu", value: 18200 },
        { label: "Fri", value: 24500 },
        { label: "Sat", value: 21000 },
        { label: "Sun", value: 31500 },
      ];

  const getBarColor = () => {
    if (colorTheme === "emerald") return "#10b981";
    if (colorTheme === "purple") return "#8b5cf6";
    if (colorTheme === "amber") return "#f59e0b";
    return "#7c3aed";
  };

  const getBarColor2 = () => {
    if (colorTheme === "emerald") return "#06b6d4";
    if (colorTheme === "purple") return "#ec4899";
    if (colorTheme === "amber") return "#f43f5e";
    return "#06b6d4";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-cyan-500">
      <Sidebar currentRole="ANALYST" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Visualization Builder Studio" subtitle="Real SVG Graphic Charts: Bar Charts, Smooth Curves, Circular Donuts & Data Grids" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Header Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800">Visual Analytics Engine • {currentOrgName}</span>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">SVG Graphic Chart Visualizer</h1>
              <p className="text-xs text-stone-600">High-performance graphical bar charts, curved trendlines, circular donut share rings, and metric scorecards</p>
            </div>
            <Link
              href="/analyst/ai-insights"
              className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg transition flex items-center gap-1.5"
            >
              <span>Proceed to AI Insights →</span>
            </Link>
          </div>

          {/* Controls Selector Bar */}
          <div className="bg-white border border-stone-300 p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
            {/* Chart Type Selector */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setChartType("bar")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl transition ${
                  chartType === "bar" ? "bg-purple-700 text-white shadow-md" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Vertical Column Bar Chart</span>
              </button>
              <button
                onClick={() => setChartType("line")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl transition ${
                  chartType === "line" ? "bg-purple-700 text-white shadow-md" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Curved Line Area Graph</span>
              </button>
              <button
                onClick={() => setChartType("pie")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl transition ${
                  chartType === "pie" ? "bg-purple-700 text-white shadow-md" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <PieChart className="h-4 w-4" />
                <span>Circular Donut Rings</span>
              </button>
              <button
                onClick={() => setChartType("table")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl transition ${
                  chartType === "table" ? "bg-purple-700 text-white shadow-md" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <Table className="h-4 w-4" />
                <span>Data Grid Table</span>
              </button>
              <button
                onClick={() => setChartType("kpi")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl transition ${
                  chartType === "kpi" ? "bg-purple-700 text-white shadow-md" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <Activity className="h-4 w-4" />
                <span>KPI Cards</span>
              </button>
            </div>

            {/* Color Palette Switcher */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-bold text-stone-600">
                <Palette className="h-4 w-4 text-purple-700" />
                <span>Palette:</span>
              </div>
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200">
                <button
                  onClick={() => setColorTheme("vibrant")}
                  className={`w-6 h-6 rounded-xl bg-purple-600 transition ${
                    colorTheme === "vibrant" ? "ring-2 ring-purple-600 ring-offset-1 scale-110" : "opacity-75"
                  }`}
                  title="Vibrant Purple & Cyan"
                />
                <button
                  onClick={() => setColorTheme("emerald")}
                  className={`w-6 h-6 rounded-xl bg-emerald-500 transition ${
                    colorTheme === "emerald" ? "ring-2 ring-emerald-600 ring-offset-1 scale-110" : "opacity-75"
                  }`}
                  title="Ocean Emerald"
                />
                <button
                  onClick={() => setColorTheme("amber")}
                  className={`w-6 h-6 rounded-xl bg-amber-500 transition ${
                    colorTheme === "amber" ? "ring-2 ring-amber-600 ring-offset-1 scale-110" : "opacity-75"
                  }`}
                  title="Sunset Amber"
                />
              </div>
            </div>
          </div>

          {/* Active Visualization Preview Canvas matching reference design layout */}
          {chartType === "bar" && (
            <div className="space-y-6">
              <VerticalBarChart
                data={barChartData}
                barColor={getBarColor()}
                barColor2={getBarColor2()}
                title="Monthly Performance Column Bar Chart (Revenue vs Expenses)"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HorizontalProgressBarList
                  items={[
                    { label: "Sales Revenue Velocity", value: metrics?.totalRevenue ? Math.round(metrics.totalRevenue / 100) : 248500, color: getBarColor() },
                    { label: "Operating Expense Spend", value: metrics?.totalExpenses ? Math.round(metrics.totalExpenses / 100) : 166100, color: getBarColor2() },
                    { label: "Answers & Resolved Tickets", value: 121, color: "#10b981" },
                    { label: "Review & Quality Score", value: 85, color: "#f59e0b" },
                  ]}
                />

                <div className="grid grid-cols-2 gap-4">
                  <CircularDonutChart percentage={68} title="Revenue Conversion" subtitle="Sales Target" ringColor={getBarColor()} />
                  <CircularDonutChart percentage={45} title="Operating Margin" subtitle="Profit Target" ringColor={getBarColor2()} />
                </div>
              </div>
            </div>
          )}

          {chartType === "line" && (
            <div className="space-y-6">
              <CurvedLineAreaChart
                data={lineChartData}
                lineColor={getBarColor()}
                title="Curved Line & Area Trajectory Graph (Growth Velocity)"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-stone-200 p-5 rounded-3xl space-y-1 text-center shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-stone-500">Peak Performance Node</span>
                  <h4 className="text-xl font-black text-purple-700">$31,500 High</h4>
                </div>
                <div className="bg-white border border-stone-200 p-5 rounded-3xl space-y-1 text-center shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-stone-500">Velocity Momentum</span>
                  <h4 className="text-xl font-black text-emerald-700">+18.4% YoY Growth</h4>
                </div>
                <div className="bg-white border border-stone-200 p-5 rounded-3xl space-y-1 text-center shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-stone-500">Trendline R-Squared</span>
                  <h4 className="text-xl font-black text-indigo-700">0.96 High Fit</h4>
                </div>
              </div>
            </div>
          )}

          {chartType === "pie" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <CircularDonutChart percentage={42} title="West Territory" subtitle="Sales Region" ringColor="#7c3aed" />
                <CircularDonutChart percentage={28} title="South Territory" subtitle="Sales Region" ringColor="#06b6d4" />
                <CircularDonutChart percentage={18} title="North Territory" subtitle="Sales Region" ringColor="#10b981" />
                <CircularDonutChart percentage={12} title="East Territory" subtitle="Sales Region" ringColor="#f59e0b" />
              </div>
            </div>
          )}

          {chartType === "table" && (
            <div className="bg-white border border-stone-200 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-base font-black text-stone-900">Formatted Data Grid Table Overview</h3>
              <div className="border border-stone-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-100 font-bold text-[10px] text-stone-700 uppercase border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Month</th>
                      <th className="p-3.5">Revenue (USD)</th>
                      <th className="p-3.5">Expenses (USD)</th>
                      <th className="p-3.5">Net Profit</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 font-medium bg-white">
                    {trends.map((t: any, idx: number) => (
                      <tr key={idx} className="hover:bg-stone-50 transition">
                        <td className="p-3.5 font-bold text-stone-900">{t.month} 2026</td>
                        <td className="p-3.5 font-mono font-bold text-purple-700">${((t.revenue || 0) / 100).toLocaleString()}</td>
                        <td className="p-3.5 font-mono font-bold text-rose-700">${((t.expenses || 0) / 100).toLocaleString()}</td>
                        <td className="p-3.5 font-mono font-bold text-emerald-700">${((t.profit || 0) / 100).toLocaleString()}</td>
                        <td className="p-3.5">
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Ingested
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {chartType === "kpi" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 text-white p-6 rounded-3xl space-y-2 shadow-lg">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-200">Gross Revenue KPI</span>
                <h3 className="text-3xl font-black">
                  {hasRealData && metrics.totalRevenue ? `$${((metrics.totalRevenue || 0) / 100).toLocaleString()}` : "$248,500"}
                </h3>
              </div>

              <div className="bg-gradient-to-tr from-rose-600 to-amber-500 text-white p-6 rounded-3xl space-y-2 shadow-lg">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-200">Operating Expenses KPI</span>
                <h3 className="text-3xl font-black">
                  {hasRealData && metrics.totalExpenses ? `$${((metrics.totalExpenses || 0) / 100).toLocaleString()}` : "$166,100"}
                </h3>
              </div>

              <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white p-6 rounded-3xl space-y-2 shadow-lg">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">Net Profit Margin KPI</span>
                <h3 className="text-3xl font-black">
                  {hasRealData && metrics.netProfit ? `$${((metrics.netProfit || 0) / 100).toLocaleString()}` : "$82,400"}
                </h3>
              </div>

              <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 text-white p-6 rounded-3xl space-y-2 shadow-lg">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-200">Growth Velocity KPI</span>
                <h3 className="text-3xl font-black">
                  {hasRealData && metrics.revenueGrowth != null ? `${metrics.revenueGrowth}%` : "+18.4%"}
                </h3>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
