"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { Lightbulb, ArrowRight, Trophy } from "lucide-react";

export default function ExecutiveRecommendationsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-amber-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive Recommendations" subtitle="Answers Question 4: What should we do? (Prescriptive AI Action Items)" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-400">Executive Flow Node: RECOMMENDATIONS</span>
              <h2 className="text-xl font-black text-white">What Should We Do? (Prescriptive Strategy)</h2>
              <p className="text-xs text-slate-400">Turn forecasts and root causes into high-ROI executive decisions and goal assignments.</p>
            </div>

            <Link
              href="/executive/goals"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
            >
              <Trophy className="h-4 w-4" />
              <span>Convert to Goals & Decisions →</span>
            </Link>
          </div>

          <div className="bg-slate-900 border border-amber-500/40 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                High Impact Proposal
              </span>
              <span className="text-xs font-mono text-slate-400">Projected MRR Lift: +$37,000</span>
            </div>
            <h3 className="text-lg font-bold text-white">Reallocate $15,000 Monthly Meta Budget to High-Intent Search Channels</h3>
            <p className="text-xs text-slate-300">
              Lower CAC back to $118.00 within 14 days and recover -$37k projected margin loss.
            </p>
            <Link
              href="/executive/goals"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-2"
            >
              <span>Set Goal & Assign Action →</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
