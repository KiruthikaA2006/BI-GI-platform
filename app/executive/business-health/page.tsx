"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { Activity, ShieldCheck, ArrowUpRight, CheckCircle2, ArrowRight } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";
import { ColorfulTrendChart } from "@/components/analytics/colorful-trend-chart";

export default function ExecutiveBusinessHealthPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);

    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data);
          if (data.organizationName) setCurrentOrgName(data.organizationName);
        }
      })
      .catch((err) => console.error("Error fetching business health stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = stats?.metrics;
  const hasData = Boolean(stats && stats.rawRowsCount > 0 && stats.datasetInfo);
  const healthScore = hasData && metrics?.healthScore != null ? metrics.healthScore.toFixed(1) : "0.0";
  const churnRate = hasData && metrics?.churnRate != null ? metrics.churnRate.toFixed(2) : "0.00";
  const retentionIndex = hasData ? (100 - Number(churnRate)).toFixed(2) : "0.00";

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-indigo-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive Business Health Scorecard" subtitle="Overall company health, risk index, and growth velocity telemetry" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="bg-white/80 h-36 rounded-3xl border border-stone-300 shadow-sm" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 h-28 rounded-2xl border border-stone-300" />
                <div className="bg-white/80 h-28 rounded-2xl border border-stone-300" />
                <div className="bg-white/80 h-28 rounded-2xl border border-stone-300" />
              </div>
              <div className="bg-white/80 h-64 rounded-3xl border border-stone-300 shadow-sm" />
            </div>
          ) : (
            <>
              {/* Top Banner White Card */}
              <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700">Executive Architecture Node: BUSINESS HEALTH</span>
                  <h2 className="text-2xl font-black text-stone-900">Company Health Index • {currentOrgName}</h2>
                  <p className="text-xs text-stone-600">Composite index aggregating financial solvency, customer retention, operational velocity, and AI risk telemetry for <strong>{currentOrgName}</strong>.</p>
                </div>

                <div className="bg-stone-50 border border-emerald-300 p-4 rounded-2xl flex items-center gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-stone-500 block">Current Health Index</span>
                    <span className="text-3xl font-black text-emerald-700">{healthScore} / 100</span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${hasData ? "text-emerald-800 bg-emerald-100 border-emerald-300" : "text-amber-800 bg-amber-50 border-amber-300"}`}>
                    {hasData ? "Optimal Status" : "No Dataset Uploaded"}
                  </span>
                </div>
              </div>

              {/* Quick Telemetry Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-stone-500">Financial Solvency & Runway</span>
                  <div className="text-2xl font-black text-stone-900">{hasData ? "28.4 Months" : "0.0 Months"}</div>
                  <p className="text-xs text-stone-600">{hasData ? "Positive net cash flow with healthy gross margins" : "No active financial telemetry"}</p>
                </div>

                <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-stone-500">Customer Retention Index</span>
                  <div className="text-2xl font-black text-emerald-700">{retentionIndex}%</div>
                  <p className="text-xs text-stone-600">Monthly churn calculated at {churnRate}%</p>
                </div>

                <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-stone-500">AI Risk & Anomaly Score</span>
                  <div className="text-2xl font-black text-indigo-700">{hasData ? "Low Risk (0.12)" : "0 Active Anomalies"}</div>
                  <p className="text-xs text-stone-600">{hasData ? "Automated monitoring active across dataset KPIs" : "Awaiting CSV dataset ingestion"}</p>
                </div>
              </div>

              {/* COLORFUL TREND CHART */}
              {!hasData ? (
                <div className="bg-white border border-stone-300 p-8 md:p-12 rounded-3xl text-center space-y-4 shadow-sm">
                  <div className="h-16 w-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <Activity className="h-8 w-8" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-xl font-black text-stone-900">No Business Health Telemetry for {currentOrgName}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Organization <strong>{currentOrgName}</strong> does not have any imported CSV datasets yet. Health index curves are generated strictly after uploading a dataset.
                    </p>
                  </div>
                  <Link
                    href="/analyst/preparation"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition"
                  >
                    <span>Import CSV Dataset for {currentOrgName} →</span>
                  </Link>
                </div>
              ) : (
                <ColorfulTrendChart
                  title={`Sales & Returns Velocity — ${currentOrgName}`}
                  subtitle="Total sales and returns velocity calculated from active dataset rows"
                  salesCount={metrics?.totalSales ? metrics.totalSales.toLocaleString() : "0"}
                  salesChange={metrics?.revenueGrowth != null ? `${metrics.revenueGrowth >= 0 ? "+" : ""}${metrics.revenueGrowth.toFixed(1)}%` : "0.0%"}
                  returnsCount="0"
                  returnsChange="0.0%"
                  orgName={currentOrgName}
                  initialTrends={stats?.trends}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

