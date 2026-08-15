"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TrendingUp, Sparkles, AlertCircle, ArrowUpRight } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { mockForecastData } from "@/lib/mock-data";

export default function ForecastsPage() {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Predictive Growth Forecasting" subtitle="Statistical & ML-based revenue projection & trend modelling" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Revenue & Sales Predictive Telemetry</h2>
              <p className="text-xs text-slate-400">Comparing actual historical metrics against 6-month predictive projection</p>
            </div>
            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-xs text-indigo-300">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Model Confidence: 94.8% (Linear Exponential Smoothing)</span>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Actual vs Predicted Revenue Trajectory (Q3 2026 - Q1 2027)</h3>
                <p className="text-xs text-slate-400">Shaded area represents 95% statistical confidence interval</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-indigo-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
                  <span>Actual Revenue</span>
                </div>
                <div className="flex items-center gap-1.5 text-purple-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span>
                  <span>Predicted Value</span>
                </div>
              </div>
            </div>

            <div className="h-96 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockForecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                    formatter={(val: any) => [val ? `₹ ${Number(val).toLocaleString()}` : "Pending Data", ""]}
                  />
                  <Area type="monotone" dataKey="upperBound" stroke="transparent" fill="url(#colorConf)" />
                  <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Detailed Monthly Forecast Table</h3>
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Forecast Period</th>
                  <th className="p-3">Actual Value</th>
                  <th className="p-3">Predicted Value</th>
                  <th className="p-3">Lower Bound (95%)</th>
                  <th className="p-3">Upper Bound (95%)</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {mockForecastData.map((row) => (
                  <tr key={row.period} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">{row.period}</td>
                    <td className="p-3 font-bold text-indigo-400">
                      {row.actual ? formatCurrency(row.actual) : "—"}
                    </td>
                    <td className="p-3 font-bold text-purple-400">{formatCurrency(row.predicted)}</td>
                    <td className="p-3 text-slate-400">{formatCurrency(row.lowerBound)}</td>
                    <td className="p-3 text-slate-400">{formatCurrency(row.upperBound)}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          row.actual ? "bg-emerald-500/20 text-emerald-300" : "bg-purple-500/20 text-purple-300"
                        }`}
                      >
                        {row.actual ? "Historical" : "Projected"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
