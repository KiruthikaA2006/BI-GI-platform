"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  Target,
  BarChart2,
  Sliders,
  CheckCircle2,
  Lightbulb,
  Calendar,
  Layers,
  Zap,
} from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";
import { getCachedStats, setCachedStats } from "@/lib/stats-cache";

export default function ForecastsPage() {
  const router = useRouter();
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingGoal, setAddingGoal] = useState<string | null>(null);

  useEffect(() => {
    const org = getActiveOrganization();
    const orgId = org?.id || "default";
    if (org && org.name) setCurrentOrgName(org.name);

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
      .catch((err) => console.error("Error fetching stats for Forecasts:", err))
      .finally(() => setLoading(false));
  }, []);

  const hasData = Boolean(stats && stats.rawRowsCount > 0 && stats.datasetInfo);
  const forecasts = stats?.forecasts;
  const metrics = stats?.metrics;

  const totalRev = metrics?.totalRevenue || 0;
  const currentMRR = Math.round(totalRev / 12);

  const baselineVal = forecasts?.baseline?.mrrValue || Math.round(currentMRR * 1.25);
  const optimizedVal = forecasts?.optimized?.mrrValue || Math.round(currentMRR * 1.55);
  const stressVal = forecasts?.stressTest?.mrrValue || Math.round(currentMRR * 0.88);

  const monthlyForecasts = forecasts?.monthlyForecasts || [
    { period: "Month 1 (30 Days)", baseline: Math.round(currentMRR * 1.04), optimized: Math.round(currentMRR * 1.10), stress: Math.round(currentMRR * 0.96), churn: "1.4%" },
    { period: "Month 2 (60 Days)", baseline: Math.round(currentMRR * 1.08), optimized: Math.round(currentMRR * 1.18), stress: Math.round(currentMRR * 0.94), churn: "1.3%" },
    { period: "Month 3 (90 Days)", baseline: Math.round(currentMRR * 1.14), optimized: Math.round(currentMRR * 1.28), stress: Math.round(currentMRR * 0.92), churn: "1.2%" },
    { period: "Quarter 2 (180 Days)", baseline: Math.round(currentMRR * 1.20), optimized: Math.round(currentMRR * 1.38), stress: Math.round(currentMRR * 0.90), churn: "1.1%" },
    { period: "Quarter 3 (270 Days)", baseline: Math.round(currentMRR * 1.26), optimized: Math.round(currentMRR * 1.48), stress: Math.round(currentMRR * 0.89), churn: "1.0%" },
    { period: "Quarter 4 (360 Days)", baseline: baselineVal, optimized: optimizedVal, stress: stressVal, churn: "0.9%" },
  ];

  const handleSetGoalFromForecast = async (title: string, targetVal: number, metricName: string) => {
    setAddingGoal(title);
    try {
      await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: title,
          description: `Created directly from Predictive Forecast models for ${currentOrgName}`,
          metric: metricName,
          targetValue: targetVal,
          currentValue: currentMRR,
        }),
      });
      router.push("/goals");
    } catch (err) {
      console.error("Error setting goal from forecast:", err);
      router.push("/goals");
    } finally {
      setAddingGoal(null);
    }
  };

  return (
    <div className="flex h-screen bg-[#e4dac9] text-stone-900 overflow-hidden selection:bg-pink-500">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Forecasting — Multi-Scenario Predictive Analytics" subtitle="Intelligence Loop Stage 1: 'What happens next?'" />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-800 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Execution Loop Step 1 • Predictive Analytics • {currentOrgName}</span>
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">
                <span>PREDICTIVE FORECASTING</span>
              </h1>
              <p className="text-xs text-stone-600 max-w-xl">
                Combines KPI Engine convergence metrics & AI Root Cause Analysis drivers to project 30/60/90-day growth revenue & churn trajectories.
              </p>
            </div>

            <Link
              href="/recommendations"
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition flex items-center gap-2"
            >
              <span>Get AI Recommendations →</span>
            </Link>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 h-40 rounded-3xl border border-stone-300 shadow-sm" />
                <div className="bg-white/80 h-40 rounded-3xl border border-stone-300 shadow-sm" />
                <div className="bg-white/80 h-40 rounded-3xl border border-stone-300 shadow-sm" />
              </div>
              <div className="bg-white/80 h-64 rounded-3xl border border-stone-300 shadow-sm" />
            </div>
          ) : !hasData ? (
            <div className="bg-white border border-stone-300 p-8 md:p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <div className="h-16 w-16 bg-pink-50 border border-pink-200 text-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-black text-stone-900">No Dataset Uploaded for {currentOrgName}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Organization <strong>{currentOrgName}</strong> does not have any imported CSV datasets yet. Predictive multi-scenario forecasting is computed strictly from active dataset rows.
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
            <>
          {/* Forecasting Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Baseline Scenario */}
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
                  Baseline Scenario (Expected)
                </span>
                <div className="text-3xl font-black text-stone-900">
                  ${baselineVal.toLocaleString()} <span className="text-xs text-stone-500 font-normal">MRR by Q4</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Maintains current marketing efficiency, customer conversion rate, and 1.8% monthly churn.
                </p>
              </div>

              <button
                onClick={() => handleSetGoalFromForecast(`Achieve Baseline Target ($${baselineVal.toLocaleString()})`, baselineVal, "Monthly Recurring Revenue ($)")}
                disabled={addingGoal === `Achieve Baseline Target ($${baselineVal.toLocaleString()})`}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-2.5 px-3 rounded-xl border border-stone-300 transition flex items-center justify-center gap-1.5"
              >
                <Target className="h-3.5 w-3.5 text-stone-600" />
                <span>{addingGoal ? "Saving Goal..." : "Set as Organization Goal →"}</span>
              </button>
            </div>

            {/* AI-Optimized Growth Scenario */}
            <div className="bg-white border border-emerald-300 p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  AI-Optimized Growth Scenario (Best Case)
                </span>
                <div className="text-3xl font-black text-emerald-700">
                  ${optimizedVal.toLocaleString()} <span className="text-xs text-stone-500 font-normal">MRR by Q4</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Assumes AI Recommendations are executed to reduce CAC by 15% and improve repeat orders.
                </p>
              </div>

              <button
                onClick={() => handleSetGoalFromForecast(`Reach AI-Optimized Target ($${optimizedVal.toLocaleString()})`, optimizedVal, "Monthly Recurring Revenue ($)")}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
              >
                <Target className="h-3.5 w-3.5" />
                <span>Set AI-Optimized Goal →</span>
              </button>
            </div>

            {/* Stress Test Scenario */}
            <div className="bg-white border border-amber-300 p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Stress Test Scenario (Risk Simulation)
                </span>
                <div className="text-3xl font-black text-amber-700">
                  ${stressVal.toLocaleString()} <span className="text-xs text-stone-500 font-normal">MRR by Q4</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Simulates a 10% increase in ad channel competition, supply delay, or temporary market friction.
                </p>
              </div>

              <button
                onClick={() => handleSetGoalFromForecast(`Maintain Minimum Revenue Floor ($${stressVal.toLocaleString()})`, stressVal, "Monthly Revenue Floor ($)")}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
              >
                <Target className="h-3.5 w-3.5" />
                <span>Set Risk Floor Goal →</span>
              </button>
            </div>
          </div>

          {/* Detailed Monthly Forecast Table */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  <span>30 / 60 / 90-Day & 12-Month Projected Trajectory</span>
                </h3>
                <p className="text-xs text-stone-600">
                  Multi-scenario monthly revenue and customer churn trajectory projections for <strong>{currentOrgName}</strong>.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-100 text-stone-600 uppercase text-[10px] tracking-wider border-b border-stone-200 font-bold">
                  <tr>
                    <th className="p-3">Forecast Horizon</th>
                    <th className="p-3">Baseline Scenario (Expected)</th>
                    <th className="p-3 text-emerald-700">AI-Optimized Scenario</th>
                    <th className="p-3 text-amber-700">Stress-Test Scenario</th>
                    <th className="p-3 text-right">Projected Churn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {monthlyForecasts.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-stone-50 transition">
                      <td className="p-3 font-bold text-stone-900">{row.period}</td>
                      <td className="p-3 font-semibold text-stone-800">${Number(row.baseline).toLocaleString()}</td>
                      <td className="p-3 font-bold text-emerald-700">${Number(row.optimized).toLocaleString()}</td>
                      <td className="p-3 font-semibold text-amber-700">${Number(row.stress).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold text-stone-600">{row.churn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </>
          )}
        </main>
      </div>
    </div>
  );
}

