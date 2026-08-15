"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  Target,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Zap,
  Activity,
  Plus,
} from "lucide-react";

export default function GoalsAndActionsPage() {
  const [activeTab, setActiveTab] = useState<"goals" | "execution" | "outcomes">("goals");

  return (
    <div className="flex h-screen bg-[#e4dac9] text-stone-900 overflow-hidden selection:bg-emerald-500">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Goals, Execution & Outcome Tracking" subtitle="Intelligence Loop Final Stages: Goals ➔ Action Execution ➔ Outcome Tracking" />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <Target className="h-3.5 w-3.5" />
                <span>Execution Flywheel • Final Stage</span>
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                Goals, Action Execution & Outcome Tracking
              </h1>
              <p className="text-xs text-stone-600">
                Assign actions, set targets, monitor live execution, and measure post-action business outcomes.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300">
              <button
                onClick={() => setActiveTab("goals")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "goals"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Goals & Actions
              </button>
              <button
                onClick={() => setActiveTab("execution")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "execution"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Action Execution Hub
              </button>
              <button
                onClick={() => setActiveTab("outcomes")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "outcomes"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Outcome Tracking Flywheel
              </button>
            </div>
          </div>

          {/* Goals Tab */}
          {activeTab === "goals" && (
            <div className="space-y-4">
              <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase">
                    Active Goal • Marketing Optimization
                  </span>
                  <span className="text-xs font-mono text-stone-500 font-bold">Assigned to Marketing Team</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900">
                  Reduce CAC to $118.00 via Retargeting Campaign
                </h3>
                <p className="text-xs text-stone-600">
                  Target CAC reduction from $142.80 to $118.00 within 14 days by shifting Meta budget to search retargeting.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-stone-200 text-xs text-stone-600">
                  <span>Progress: 65% Completed</span>
                  <button
                    onClick={() => setActiveTab("outcomes")}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    View Business Outcome Impact →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Execution Hub Tab */}
          {activeTab === "execution" && (
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900">Live Action Task Execution</h3>
              <p className="text-xs text-stone-600">Real-time status of assigned team tasks.</p>
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <span>1. Reallocate $15,000 ad budget</span>
                  <span className="text-emerald-700">Completed</span>
                </div>
                <div className="flex items-center justify-between text-stone-700 font-medium">
                  <span>2. Deploy LinkedIn Retargeting Pixel</span>
                  <span className="text-amber-700">In Progress (80%)</span>
                </div>
              </div>
            </div>
          )}

          {/* Outcomes Tab */}
          {activeTab === "outcomes" && (
            <div className="bg-white border border-emerald-300 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Outcome Flywheel: Fed back into Business Health Scorecard!</span>
              </div>
              <p className="text-xs text-stone-600">
                Action execution lowered CAC to $119.50, driving +$37k MRR expansion and boosting Business Health to 94.8/100.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow"
              >
                <span>Return to Main Dashboard →</span>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
