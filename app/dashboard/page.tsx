"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  Database,
  BarChart3,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  ShieldAlert,
  Activity,
  Layers,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Building2,
  AlertCircle,
} from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";
import { getCachedStats, setCachedStats } from "@/lib/stats-cache";

export default function DashboardPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const active = getActiveOrganization();
    const activeRole = typeof window !== "undefined" ? localStorage.getItem("active_role") : null;
    if (!active || !activeRole) {
      window.location.replace("/onboarding/organization");
      return;
    }

    const orgId = active.id || "default";
    if (active.name) setCurrentOrgName(active.name);

    const cached = getCachedStats(orgId);
    if (cached) {
      setStats(cached);
      setLoading(false);
    }

    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data);
          setCachedStats(orgId, data);
          if (data.organizationName) setCurrentOrgName(data.organizationName);
        }
      })
      .catch((err) => console.error("Error fetching dashboard stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = stats?.metrics;
  const hasRealData = Boolean(metrics && (stats?.rawRowsCount > 0 || (metrics.totalRevenue || 0) > 0));

  const rev = Number(metrics?.totalRevenue || 0);
  const displayRevenue = rev > 500000 && rev % 100 === 0 ? rev / 100 : rev;

  const formattedMRR = hasRealData && displayRevenue > 0
    ? `$${displayRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : "$0";

  const formattedRevenueGrowth = hasRealData && metrics?.revenueGrowth != null
    ? `${metrics.revenueGrowth >= 0 ? "+" : ""}${metrics.revenueGrowth.toFixed(1)}%`
    : "0.0%";

  const formattedChurn = hasRealData && metrics?.churnRate != null
    ? `${metrics.churnRate.toFixed(2)}%`
    : "0.00%";

  const formattedAlerts = hasRealData && metrics?.activeAlertsCount != null
    ? `${metrics.activeAlertsCount} Active`
    : "0 Active";

  const formattedGoalsRate = hasRealData && metrics?.goalCompletionRate != null
    ? `${metrics.goalCompletionRate.toFixed(1)}%`
    : "0.0%";

  return (
    <div className="flex h-screen bg-[#e4dac9] text-stone-900 overflow-hidden selection:bg-indigo-500">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Main Dashboard — Business Health" subtitle="Central hub connecting Data Center, Dashboards, and AI Insights" />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="bg-white/80 h-36 rounded-3xl border border-stone-300 shadow-sm" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/80 h-28 rounded-2xl border border-stone-300" />
                <div className="bg-white/80 h-28 rounded-2xl border border-stone-300" />
                <div className="bg-white/80 h-28 rounded-2xl border border-stone-300" />
                <div className="bg-white/80 h-28 rounded-2xl border border-stone-300" />
              </div>
              <div className="bg-white/80 h-64 rounded-3xl border border-stone-300" />
            </div>
          ) : (
            <>
              {/* Business Health Top Banner Card */}
              <div className="bg-white border border-stone-300 p-6 rounded-3xl relative overflow-hidden shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                      <Activity className="h-3.5 w-3.5" />
                      <span>Business Health Scorecard • {currentOrgName}</span>
                    </div>
                    <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                      Enterprise Growth Cockpit
                    </h1>
                    <p className="text-xs text-stone-600 max-w-xl">
                      Real-time telemetry aggregating Data Pipeline metrics, KPI Engine outputs, AI Anomaly Diagnosis, and Goal Velocity for <strong>{currentOrgName}</strong>.
                    </p>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex items-center gap-6 min-w-[280px]">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-stone-500 block">Overall Business Health</span>
                      <span className="text-3xl font-black text-emerald-700">
                        {hasRealData && metrics?.healthScore != null ? metrics.healthScore.toFixed(1) : "0.0"}
                        <span className="text-xs text-stone-500">/100</span>
                      </span>
                    </div>
                    <div className="h-10 w-px bg-stone-300" />
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-stone-500 block">Growth Index</span>
                      <span className="text-sm font-bold text-indigo-700 flex items-center gap-1">
                        <ArrowUpRight className="h-4 w-4" /> {hasRealData && metrics?.growthIndex ? metrics.growthIndex : "0.0% YoY"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {!hasRealData && (
                <div className="bg-amber-50 border border-amber-300 p-5 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-amber-700 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-black text-stone-900">No Custom CSV Uploaded Yet for {currentOrgName}</h4>
                      <p className="text-xs text-stone-600">
                        Upload your company's real CSV dataset in <strong>Data Center</strong> to compute custom telemetry for <strong>{currentOrgName}</strong>.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/data-center"
                    className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow flex-shrink-0"
                  >
                    Import Dataset Now →
                  </Link>
                </div>
              )}

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-2 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-stone-500">Monthly Recurring Revenue</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-stone-900">{formattedMRR}</span>
                <span className="text-xs font-bold text-emerald-700">{formattedRevenueGrowth}</span>
              </div>
              <p className="text-[11px] text-stone-500">Calculated via Data Center KPI Engine</p>
            </div>

            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-2 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-stone-500">Customer Churn Rate</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-rose-600">{formattedChurn}</span>
                <span className="text-xs font-bold text-rose-700">Calculated</span>
              </div>
              <p className="text-[11px] text-stone-500">Calculated from purchase frequency & interval</p>
            </div>

            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-2 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-stone-500">AI Anomaly Alerts</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-amber-600">{formattedAlerts}</span>
                <span className="text-xs font-bold text-amber-700 font-mono">Live</span>
              </div>
              <p className="text-[11px] text-stone-500">Root Cause Analysis in AI Insights</p>
            </div>

            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-2 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-stone-500">Goal Completion Rate</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-indigo-700">{formattedGoalsRate}</span>
                <span className="text-xs font-bold text-indigo-700 font-mono">Tracked</span>
              </div>
              <p className="text-[11px] text-stone-500">Outcome tracking active on goals</p>
            </div>
          </div>

          {/* Flowchart 3 Main Pillars Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">The 3 Architecture Pillars</h2>
                <p className="text-xs text-stone-600">Access data ingestion, metric views, and AI diagnosis</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Data Center Card */}
              <Link
                href="/data-center"
                className="bg-white border border-stone-300 p-6 rounded-3xl hover:border-indigo-400 transition group space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold">
                    <Database className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-cyan-50 text-cyan-800 px-2.5 py-1 rounded-full border border-cyan-200">
                    Pillar 1
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-cyan-700 transition">Data Center</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    6-stage processing pipeline connecting sources, cleaning data, and defining KPI models.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-cyan-700">
                  <span>Open Pipeline & KPI Engine</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>

              {/* Dashboards Card */}
              <Link
                href="/dashboards"
                className="bg-white border border-stone-300 p-6 rounded-3xl hover:border-indigo-400 transition group space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full border border-blue-200">
                    Pillar 2
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-blue-700 transition">Dashboards & Reports</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Visual KPI cockpits, department performance metrics, and scheduled report exports.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-blue-700">
                  <span>View KPI Cockpits & Reports</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>

              {/* AI Insights Card */}
              <Link
                href="/ai-insights"
                className="bg-white border border-stone-300 p-6 rounded-3xl hover:border-indigo-400 transition group space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 font-bold">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-purple-50 text-purple-800 px-2.5 py-1 rounded-full border border-purple-200">
                    Pillar 3
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-purple-700 transition">AI Insights</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Automated anomaly detection, statistical root cause analysis, and diagnostic answers.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-purple-700">
                  <span>Explore AI Diagnosis ("Why?")</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            </div>
          </div>
          </>
          )}
        </main>
      </div>
    </div>
  );
}
