"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { TrendingUp, TrendingDown, Activity, ArrowRight } from "lucide-react";

export default function ExecutiveTrendsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-purple-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive Trends & Patterns" subtitle="Executive Node: Growth Patterns, Decline Signals, Cohort Changes" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-purple-400">Executive Flow Node: TRENDS</span>
              <h2 className="text-xl font-black text-white">Growth, Decline & Cohort Patterns</h2>
              <p className="text-xs text-slate-400">Macro trends detected across sales velocity, customer expansion, and seasonal variations.</p>
            </div>
          </div>

          {/* Trend Breakdown Grid matching Screenshot 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-emerald-500/40 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase">Growth Trend: Enterprise Expansion</span>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-300">
                Expansion MRR from existing accounts grew by <strong>+22.4%</strong> this quarter driven by add-on seat adoption.
              </p>
            </div>

            <div className="bg-slate-900 border border-rose-500/40 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase">Decline Trend: Paid Ad Efficiency</span>
                <TrendingDown className="h-4 w-4 text-rose-400" />
              </div>
              <p className="text-xs text-slate-300">
                Meta paid ad conversion decreased by <strong>-6.2%</strong> resulting in a CAC spike ($142.00 vs $120.00 target).
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
