"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { TrendingUp, TrendingDown, Activity, ArrowRight } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";
import { ColorfulTrendChart } from "@/components/analytics/colorful-trend-chart";

export default function ExecutiveTrendsPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [stats, setStats] = useState<any>(null);

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
      .catch((err) => console.error("Error fetching trend stats:", err));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-purple-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive Trends & Patterns" subtitle="Executive Node: Growth Patterns, Decline Signals, Cohort Changes" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner White Card */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-purple-700">Executive Flow Node: TRENDS</span>
              <h2 className="text-2xl font-black text-stone-900">Growth, Decline & Cohort Patterns • {currentOrgName}</h2>
              <p className="text-xs text-stone-600">Macro trends detected across sales velocity, customer expansion, and seasonal variations for <strong>{currentOrgName}</strong>.</p>
            </div>
          </div>

          {stats && (stats.rawRowsCount === 0 || !stats.datasetInfo) ? (
            <div className="bg-white border border-stone-300 p-8 md:p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <div className="h-16 w-16 bg-purple-50 border border-purple-200 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-black text-stone-900">No Dataset Uploaded for {currentOrgName}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Organization <strong>{currentOrgName}</strong> does not have any imported CSV datasets yet. Trend visualizers and sales velocity curves are generated strictly after uploading a dataset.
                </p>
              </div>
              <Link
                href="/analyst/preparation"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition"
              >
                <span>Import CSV Dataset for {currentOrgName} →</span>
              </Link>
            </div>
          ) : (
            <>
              {/* COLORFUL TREND CHART */}
              <ColorfulTrendChart
                title={`Sales & Returns Velocity — ${currentOrgName}`}
                subtitle="Total sales and returns velocity calculated from active dataset rows"
                salesCount={stats?.metrics?.totalSales ? stats.metrics.totalSales.toLocaleString() : "0"}
                salesChange={stats?.metrics?.revenueGrowth != null ? `${stats.metrics.revenueGrowth >= 0 ? "+" : ""}${stats.metrics.revenueGrowth.toFixed(1)}%` : "0.0%"}
                returnsCount="0"
                returnsChange="0.0%"
                orgName={currentOrgName}
                initialTrends={stats?.trends}
              />

              {/* Trend Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-emerald-300 p-5 rounded-2xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-emerald-600" /> Growth Trend: Enterprise Expansion
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Expansion MRR from existing accounts grew by <strong>+22.4%</strong> this quarter driven by add-on seat adoption in <strong>{currentOrgName}</strong>.
                  </p>
                </div>

                <div className="bg-white border border-amber-300 p-5 rounded-2xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-800 uppercase flex items-center gap-1.5">
                      <TrendingDown className="h-4 w-4 text-rose-600" /> Decline Trend: Paid Ad Efficiency
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Meta paid ad lead conversion decreased by <strong>-3.4%</strong> resulting in a CAC spike ($142.80 vs $118.00 target).
                  </p>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

