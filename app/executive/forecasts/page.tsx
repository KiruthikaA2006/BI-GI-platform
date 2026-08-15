"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { TrendingUp, ArrowRight, Lightbulb } from "lucide-react";

export default function ExecutiveForecastsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-pink-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive Forecasts" subtitle="Answers Question 3: What's next? (30/60/90-Day Predictions)" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-pink-400">Executive Flow Node: FORECASTING</span>
              <h2 className="text-xl font-black text-white">What's Next? (30/60/90-Day Trajectory Modeling)</h2>
              <p className="text-xs text-slate-400">Predictive ML models projecting MRR, ARR, and customer retention under baseline vs optimized scenarios.</p>
            </div>

            <Link
              href="/executive/recommendations"
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-600/30 transition flex items-center gap-1.5"
            >
              <span>Get AI Recommendations →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">30-Day Forecast</span>
              <div className="text-2xl font-black text-white">$258,000 MRR</div>
              <p className="text-xs text-slate-400">Assumes baseline ad spend reallocation</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">60-Day Forecast</span>
              <div className="text-2xl font-black text-white">$274,500 MRR</div>
              <p className="text-xs text-slate-400">Forecasted CAC reduction to $118.00</p>
            </div>

            <div className="bg-slate-900 border border-emerald-500/40 p-5 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-emerald-400">90-Day Optimized Target</span>
              <div className="text-2xl font-black text-emerald-400">$315,000 MRR</div>
              <p className="text-xs text-slate-400">Achieved upon executing AI Recommendations</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
