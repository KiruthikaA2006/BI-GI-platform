"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  Lightbulb,
  ArrowRight,
  Target,
  CheckCircle2,
  Clock,
  X,
  Zap,
  Check,
} from "lucide-react";

export default function AIRecommendationsPage() {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigned, setAssigned] = useState(false);
  const [targetOwner, setTargetOwner] = useState("Marketing Team Lead");
  const [deadlineDays, setDeadlineDays] = useState("14");

  const handleAssignAction = (e: React.FormEvent) => {
    e.preventDefault();
    setAssigned(true);
    setShowAssignModal(false);
  };

  return (
    <div className="flex h-screen bg-[#e4dac9] text-stone-900 overflow-hidden selection:bg-amber-500">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="AI Recommendation — Prescriptive Growth Engine" subtitle="Intelligence Loop Stage 2: 'What should we do?'" />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider">
                <Lightbulb className="h-3.5 w-3.5" />
                <span>Execution Loop Step 2 • Prescriptive AI Recommendations</span>
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">
                <span>AI RECOMMENDATION</span>
                <span className="text-xs font-normal text-stone-600 bg-stone-100 border border-stone-300 px-3 py-1 rounded-xl">
                  "What should we do?"
                </span>
              </h1>
              <p className="text-xs text-stone-600 max-w-xl">
                Translates root-cause findings and forecasting models into high-ROI actionable strategies.
              </p>
            </div>

            <Link
              href="/goals"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              <span>Convert to Goals & Assign Actions →</span>
            </Link>
          </div>

          {assigned && (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Action assigned to {targetOwner} with a {deadlineDays}-day deadline! Goal synchronized to Goals & Decisions workspace.</span>
            </div>
          )}

          {/* Active AI Recommendation Cards */}
          <div className="space-y-4">
            <div className="bg-white border border-amber-300 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 uppercase bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  Priority 1 • High Impact Proposal
                </span>
                <span className="text-xs font-mono text-stone-600 font-bold">Projected Value: +$37,000 MRR</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Reallocate Meta Ad Spend to High-Intent Search & Retargeting Channels
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Root Cause Analysis revealed CAC increased by 18% due to Meta ad inefficiency. Reallocating $15k monthly budget to LinkedIn search retargeting is forecasted to lower CAC back to $118.00 within 14 days.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-stone-200 text-xs">
                <span className="text-stone-600 font-semibold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-amber-600" /> Deadline: {deadlineDays} Days
                </span>
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1 shadow"
                >
                  <span>Assign Action to {targetOwner}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Assign Action Modal */}
          {showAssignModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white border border-stone-300 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="text-base font-black text-stone-900">Assign Action to Team</h3>
                  <button onClick={() => setShowAssignModal(false)} className="text-stone-400 hover:text-stone-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleAssignAction} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Assignee Lead</label>
                    <select
                      value={targetOwner}
                      onChange={(e) => setTargetOwner(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-medium"
                    >
                      <option>Marketing Team Lead</option>
                      <option>Sales Operations Manager</option>
                      <option>Growth Lead</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Execution Window (Days)</label>
                    <select
                      value={deadlineDays}
                      onChange={(e) => setDeadlineDays(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-medium"
                    >
                      <option value="7">7 Days Target</option>
                      <option value="14">14 Days Target</option>
                      <option value="30">30 Days Target</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAssignModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow"
                    >
                      Confirm Action Assignment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
