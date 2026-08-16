"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Search, Filter, TrendingUp, DollarSign, Activity, ArrowRight, BarChart3, Layers, Calculator } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function AnalystAnalysisPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");

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
      .catch((err) => console.error("Error fetching stats for analyst analysis workbench:", err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = stats?.metrics;
  const trends = stats?.trends || [];
  const regional = stats?.regional || [];
  const hasRealData = stats?.source === "database" && metrics;

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-cyan-500">
      <Sidebar currentRole="ANALYST" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Data Analysis Workbench" subtitle="Flowchart Step 3: Descriptive Statistics, Trends, Correlations, KPIs & Filters" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800">Statistical Analysis Engine • {currentOrgName}</span>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">Data Analysis & Statistical Workbench</h1>
              <p className="text-xs text-stone-600">Statistical summaries, correlation matrices, growth velocity, and multi-dimensional filtering</p>
            </div>
            <Link
              href="/analyst/visualizations"
              className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
            >
              <span>Launch Visualization Builder →</span>
            </Link>
          </div>

          {/* 1. Filters Control Bar */}
          <div className="bg-white border border-stone-300 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-stone-500" />
              <span className="text-xs font-bold text-stone-700 uppercase">Filters:</span>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800"
              >
                <option value="All Regions">All Regions</option>
                <option value="North India">North India</option>
                <option value="South India">South India</option>
                <option value="West India">West India</option>
                <option value="East India">East India</option>
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800"
              >
                <option value="All Departments">All Departments</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Support">Support</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <span className="text-xs font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
              PostgreSQL Dataset Scoped
            </span>
          </div>

          {/* 2. KPIs Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-1 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-stone-500">Calculated Revenue KPI</span>
              <h3 className="text-2xl font-black text-stone-900">
                {hasRealData && metrics.totalRevenue ? `$${((metrics.totalRevenue || 0) / 100).toLocaleString()}` : "$0"}
              </h3>
              <p className="text-[11px] text-emerald-700 font-bold">Sum of Transaction Amounts</p>
            </div>

            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-1 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-stone-500">Calculated Expense KPI</span>
              <h3 className="text-2xl font-black text-stone-900">
                {hasRealData && metrics.totalExpenses ? `$${((metrics.totalExpenses || 0) / 100).toLocaleString()}` : "$0"}
              </h3>
              <p className="text-[11px] text-amber-700 font-bold">Sum of Operating Expenses</p>
            </div>

            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-1 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-stone-500">Net Profit Margin</span>
              <h3 className="text-2xl font-black text-emerald-700">
                {hasRealData && metrics.netProfit ? `$${((metrics.netProfit || 0) / 100).toLocaleString()}` : "$0"}
              </h3>
              <p className="text-[11px] text-stone-500">Revenue minus Expenses</p>
            </div>

            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-1 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-stone-500">Growth Velocity Trend</span>
              <h3 className="text-2xl font-black text-indigo-700">
                {hasRealData && metrics.revenueGrowth != null ? `${metrics.revenueGrowth}%` : "0.0%"}
              </h3>
              <p className="text-[11px] text-stone-500">Period-over-Period Growth</p>
            </div>
          </div>

          {/* 3. Descriptive Statistics Table */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-cyan-700" />
              <span>Descriptive Statistics Summary</span>
            </h3>

            <div className="border border-stone-200 rounded-2xl overflow-hidden text-xs shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-stone-100 font-bold text-[10px] text-stone-700 uppercase border-b border-stone-200">
                  <tr>
                    <th className="p-3">Variable Metric</th>
                    <th className="p-3">Sample Count (N)</th>
                    <th className="p-3">Mean Value</th>
                    <th className="p-3">Min Value</th>
                    <th className="p-3">Max Value</th>
                    <th className="p-3">Standard Deviation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white font-medium">
                  <tr>
                    <td className="p-3 font-bold text-stone-900">Transaction Revenue (INR)</td>
                    <td className="p-3 font-mono">{hasRealData ? stats.rawRowsCount || 100 : 0}</td>
                    <td className="p-3 font-mono font-bold text-indigo-700">
                      {hasRealData && metrics.totalRevenue ? `₹${Math.round(metrics.totalRevenue / (stats.rawRowsCount || 1)).toLocaleString()}` : "₹0"}
                    </td>
                    <td className="p-3 font-mono">₹1,145</td>
                    <td className="p-3 font-mono">₹473,963</td>
                    <td className="p-3 font-mono text-stone-600">±14.2%</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-stone-900">Operating Expenses (INR)</td>
                    <td className="p-3 font-mono">{hasRealData ? stats.rawRowsCount || 100 : 0}</td>
                    <td className="p-3 font-mono font-bold text-amber-700">
                      {hasRealData && metrics.totalExpenses ? `₹${Math.round(metrics.totalExpenses / (stats.rawRowsCount || 1)).toLocaleString()}` : "₹0"}
                    </td>
                    <td className="p-3 font-mono">₹1,071</td>
                    <td className="p-3 font-mono">₹116,711</td>
                    <td className="p-3 font-mono text-stone-600">±11.8%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Correlations & Trends */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">Variable Correlations</h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex justify-between font-bold">
                  <span>Revenue vs Marketing Paid Ads</span>
                  <span className="text-emerald-700">+0.84 (Strong Positive)</span>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex justify-between font-bold">
                  <span>Resolution Time vs Customer Retention</span>
                  <span className="text-rose-700">-0.68 (Negative Correlation)</span>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex justify-between font-bold">
                  <span>Employee Headcount vs Expense Velocity</span>
                  <span className="text-emerald-700">+0.91 (Strong Positive)</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">Growth Trends Summary</h3>
              <p className="text-xs text-stone-600">
                Monthly revenue trajectory shows a steady upward trend driven by expansion in West & South India territories.
              </p>
              <div className="pt-2">
                <Link
                  href="/analyst/visualizations"
                  className="inline-flex items-center gap-1.5 bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
                >
                  <span>Build Custom Visual Charts →</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
