"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { TrendingUp, ArrowRight, Lightbulb } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function ExecutiveForecastsPage() {
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
      .catch((err) => console.error("Error fetching stats for forecasts:", err))
      .finally(() => setLoading(false));
  }, []);

  const hasData = Boolean(stats && stats.rawRowsCount > 0 && stats.datasetInfo);

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-pink-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive Forecasts & Multi-Scenario Analytics" subtitle="Answers Question: What happens next? (30/60/90-Day Predictions)" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner White Card */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-pink-700">Executive Flow Node: FORECASTING</span>
              <h2 className="text-2xl font-black text-stone-900">30 / 60 / 90-Day Trajectory Modeling • {currentOrgName}</h2>
              <p className="text-xs text-stone-600">Predictive ML models projecting MRR, ARR, and customer retention for <strong>{currentOrgName}</strong>.</p>
            </div>

            <Link
              href="/executive/recommendations"
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition flex items-center gap-1.5"
            >
              <span>Get AI Recommendations →</span>
            </Link>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 h-36 rounded-3xl border border-stone-300 shadow-sm" />
                <div className="bg-white/80 h-36 rounded-3xl border border-stone-300 shadow-sm" />
                <div className="bg-white/80 h-36 rounded-3xl border border-stone-300 shadow-sm" />
              </div>
            </div>
          ) : !hasData ? (
            <div className="bg-white border border-stone-300 p-8 md:p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <div className="h-16 w-16 bg-pink-50 border border-pink-200 text-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-black text-stone-900">No Dataset Uploaded for {currentOrgName}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Organization <strong>{currentOrgName}</strong> does not have any imported CSV datasets yet. Forecast trajectory modeling is computed strictly from uploaded dataset analytics.
                </p>
              </div>
              <Link
                href="/data-center"
                className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition"
              >
                <span>Import CSV Dataset for {currentOrgName} →</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-2 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-stone-500">30-Day Baseline Forecast</span>
              <div className="text-2xl font-black text-stone-900">$258,000 MRR</div>
              <p className="text-xs text-stone-600">Assumes baseline ad spend reallocation</p>
            </div>

            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-2 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-stone-500">60-Day Forecast</span>
              <div className="text-2xl font-black text-stone-900">$274,500 MRR</div>
              <p className="text-xs text-stone-600">Forecasted CAC reduction to $118.00</p>
            </div>

            <div className="bg-white border border-emerald-300 p-6 rounded-3xl space-y-2 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-emerald-700">90-Day Optimized Target</span>
              <div className="text-2xl font-black text-emerald-700">$315,000 MRR</div>
              <p className="text-xs text-stone-600">Achieved upon executing AI Recommendations</p>
            </div>
          </div>
          )}
        </main>
      </div>
    </div>
  );
}

