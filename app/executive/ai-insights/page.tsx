"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { Sparkles, BrainCircuit, ArrowRight, TrendingUp } from "lucide-react";

export default function ExecutiveAIInsightsPage() {
  const [activeTab, setActiveTab] = useState<"what" | "why" | "impact">("what");

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-purple-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive AI Insights" subtitle="Answers Question 2: Why did it happen? (WHAT? ➔ WHY? ➔ IMPACT?)" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-purple-400">Executive Architecture Node: AI INSIGHTS</span>
              <h2 className="text-xl font-black text-white">Diagnostic AI Engine (WHAT? ➔ WHY? ➔ IMPACT?)</h2>
              <p className="text-xs text-slate-400">Translating metric anomalies into financial driver trees and strategic impact calculations.</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab("what")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "what"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                WHAT? (Anomaly)
              </button>
              <button
                onClick={() => setActiveTab("why")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "why"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                WHY? (Root Cause)
              </button>
              <button
                onClick={() => setActiveTab("impact")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "impact"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                IMPACT? (Financial)
              </button>
            </div>
          </div>

          {/* Section WHAT */}
          {activeTab === "what" && (
            <div className="bg-slate-900 border border-purple-500/40 p-6 rounded-3xl space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">WHAT HAPPENED?</h3>
              <p className="text-xs text-slate-300">
                Customer Acquisition Cost (CAC) rose sharply to <strong>$142.00</strong> (+18.4% above baseline).
              </p>
              <button
                onClick={() => setActiveTab("why")}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5"
              >
                <span>Analyze WHY? →</span>
              </button>
            </div>
          )}

          {/* Section WHY */}
          {activeTab === "why" && (
            <div className="bg-slate-900 border border-purple-500/40 p-6 rounded-3xl space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">WHY DID IT HAPPEN?</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>• Meta ad CPC increased by 34% without proportional conversion lift.</li>
                <li>• Mobile landing page drop-off rate increased by 4.2%.</li>
              </ul>
              <button
                onClick={() => setActiveTab("impact")}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5"
              >
                <span>Calculate FINANCIAL IMPACT? →</span>
              </button>
            </div>
          )}

          {/* Section IMPACT */}
          {activeTab === "impact" && (
            <div className="bg-slate-900 border border-emerald-500/40 p-6 rounded-3xl space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-white uppercase tracking-wider text-emerald-400">FINANCIAL IMPACT?</h3>
              <p className="text-xs text-slate-300">
                Unchecked CAC inefficiency will reduce annual net margin by <strong>-$37,000 MRR</strong> over 90 days.
              </p>
              <Link
                href="/executive/forecasts"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5 w-fit"
              >
                <span>Proceed to Forecasting ("What's next?") →</span>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
