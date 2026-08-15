"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Search,
  ArrowRight,
  GitBranch,
  Lightbulb,
  CheckCircle2,
  BrainCircuit,
  Zap,
} from "lucide-react";

export default function AIInsightsPage() {
  const [activeTab, setActiveTab] = useState<"anomalies" | "root_cause">("anomalies");

  return (
    <div className="flex h-screen bg-[#e4dac9] text-stone-900 overflow-hidden selection:bg-purple-500">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="AI Insights — Anomaly & Root Cause Analysis" subtitle="Pillar 3 in BI-GI Architecture: 'What happened? Why?'" />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Pillar 3 • Diagnostic AI Intelligence</span>
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">
                <span>AI Insights</span>
                <span className="text-xs font-normal text-stone-600 bg-stone-100 border border-stone-300 px-3 py-1 rounded-xl">
                  "What happened? Why?"
                </span>
              </h1>
              <p className="text-xs text-stone-600">
                Automated statistical anomaly detection coupled with LLM root-cause driver trees.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300">
              <button
                onClick={() => setActiveTab("anomalies")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "anomalies"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Trend & Anomaly Detection
              </button>
              <button
                onClick={() => setActiveTab("root_cause")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "root_cause"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Root Cause Driver Tree
              </button>
            </div>
          </div>

          {/* Anomalies Content */}
          {activeTab === "anomalies" && (
            <div className="space-y-4">
              <div className="bg-white border border-amber-300 p-6 rounded-3xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase">
                    Anomaly Detected • Marketing CAC Spike
                  </span>
                  <span className="text-xs font-mono text-stone-500 font-bold">Severity: Medium</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  Customer Acquisition Cost Rose +18% Above 90-Day Baseline
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Data Center KPI Engine registered CAC increase to $142.80 (target $118.00). ML anomaly model confirmed statistical deviation across paid search channels.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-stone-200">
                  <span className="text-xs text-stone-500">Root Cause Engine: Identified 2 contributing factors</span>
                  <Link
                    href="/ai-insights/recommendations"
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1 shadow"
                  >
                    <span>View Prescriptive Recommendation ("What to do?") →</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Root Cause Tree Content */}
          {activeTab === "root_cause" && (
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900">Root Cause Driver Analysis Tree</h3>
              <p className="text-xs text-stone-600">Trace KPI variance back to specific operational drivers.</p>
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs space-y-2 font-mono">
                <p className="text-stone-900 font-bold">Root Cause Driver Breakdown:</p>
                <p className="text-rose-600">├── Meta Search Ad Keyword Bidding Inflation (+62% CAC Contribution)</p>
                <p className="text-amber-600">└── Landing Page Mobile Lead Conversion Drop (-3.4% Conversion Rate)</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
