"use client";

import React from "react";
import Link from "next/link";
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
} from "lucide-react";

export default function ForecastsPage() {
  return (
    <div className="flex h-screen bg-[#e4dac9] text-stone-900 overflow-hidden selection:bg-pink-500">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Forecasting — Predictive ML Models" subtitle="Intelligence Loop Stage 1: 'What happens next?'" />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-800 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Execution Loop Step 1 • Predictive Analytics</span>
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">
                <span>FORECASTING</span>
                <span className="text-xs font-normal text-stone-600 bg-stone-100 border border-stone-300 px-3 py-1 rounded-xl">
                  "What happens next?"
                </span>
              </h1>
              <p className="text-xs text-stone-600 max-w-xl">
                Combines KPI Engine convergence metrics & AI Root Cause Analysis drivers to project 30/60/90-day growth revenue & churn trajectories.
              </p>
            </div>

            <Link
              href="/ai-insights/recommendations"
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              <span>Proceed to AI Recommendation →</span>
            </Link>
          </div>

          {/* Forecasting Scenarios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-3 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase text-stone-500">Baseline Scenario (Expected)</span>
              <div className="text-2xl font-black text-stone-900">$278,000 <span className="text-xs text-stone-500">MRR by Q4</span></div>
              <p className="text-xs text-stone-600">Maintains current marketing efficiency and 1.8% monthly churn</p>
            </div>

            <div className="bg-white border border-emerald-300 p-5 rounded-2xl space-y-3 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase text-emerald-800">Optimized Growth Scenario</span>
              <div className="text-2xl font-black text-emerald-700">$315,000 <span className="text-xs text-stone-500">MRR by Q4</span></div>
              <p className="text-xs text-stone-600">Assumes AI Recommendations are executed to reduce CAC by 15%</p>
            </div>

            <div className="bg-white border border-amber-300 p-5 rounded-2xl space-y-3 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase text-amber-800">Stress Test Scenario</span>
              <div className="text-2xl font-black text-amber-700">$240,000 <span className="text-xs text-stone-500">MRR by Q4</span></div>
              <p className="text-xs text-stone-600">Simulates 10% increase in ad channel competition</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
