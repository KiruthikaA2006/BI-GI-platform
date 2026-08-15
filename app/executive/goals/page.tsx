"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { Trophy, CheckCircle2, Clock, User, ArrowRight, Award, Zap } from "lucide-react";

export default function ExecutiveGoalsPage() {
  const [activeTab, setActiveTab] = useState<"goals" | "tracking" | "impact">("goals");

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-emerald-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive Goals & Decisions" subtitle="Set Goal ➔ Assign Action ➔ Deadline ➔ Outcome Tracking ➔ Business Impact" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-emerald-400">Executive Architecture Node: GOALS & DECISIONS</span>
              <h2 className="text-xl font-black text-white">Goals, Action Assignment & Business Impact</h2>
              <p className="text-xs text-slate-400">Set strategic goals, assign team actions, enforce deadlines, and measure Business Impact.</p>
            </div>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab("goals")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeTab === "goals"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Set Goal & Action
              </button>
              <button
                onClick={() => setActiveTab("tracking")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeTab === "tracking"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Outcome Tracking
              </button>
              <button
                onClick={() => setActiveTab("impact")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeTab === "impact"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Business Impact
              </button>
            </div>
          </div>

          {/* Section 1: Set Goal, Assign Action, Deadline matching Screenshot 4 */}
          {activeTab === "goals" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-white uppercase tracking-wider text-slate-300">
                Active Strategic Decisions & Assigned Actions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-400">SET GOAL</span>
                  <h4 className="text-sm font-bold text-white">Reduce CAC to $118.00</h4>
                  <p className="text-xs text-slate-400">Target 18% CAC reduction within 14 days</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <span className="text-[10px] font-extrabold uppercase text-blue-400">ASSIGN ACTION</span>
                  <h4 className="text-sm font-bold text-white">Reallocate Meta Budget</h4>
                  <p className="text-xs text-slate-400">Assigned to: <strong>Marketing Lead</strong></p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <span className="text-[10px] font-extrabold uppercase text-purple-400">DEADLINE</span>
                  <h4 className="text-sm font-bold text-white">Aug 28, 2026</h4>
                  <p className="text-xs text-slate-400">14 Days execution window</p>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Outcome Tracking */}
          {activeTab === "tracking" && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Outcome Tracking Engine
              </h3>
              <p className="text-xs text-slate-300">
                Measuring real-time post-action metric recovery against pre-action baseline ($142.00 ➔ $116.50).
              </p>
            </div>
          )}

          {/* Section 3: Business Impact */}
          {activeTab === "impact" && (
            <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/50 p-6 rounded-3xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-emerald-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">BUSINESS IMPACT CONFIRMED</h3>
                  <p className="text-xs text-slate-300">
                    Calculated Net Business Impact: <strong>+$24,500 MRR Gain</strong>. Overall Business Health score updated to <strong>94.8 / 100</strong>.
                  </p>
                </div>
              </div>
              <Link
                href="/executive/command-center"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 w-fit"
              >
                <span>Return to Command Center →</span>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
