"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { Activity, ShieldCheck, ArrowUpRight, CheckCircle2, ArrowRight } from "lucide-react";

export default function ExecutiveBusinessHealthPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-indigo-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive Business Health Scorecard" subtitle="Overall company health, risk index, and growth velocity telemetry" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-emerald-400">Executive Architecture Node: BUSINESS HEALTH</span>
              <h2 className="text-xl font-black text-white">Company Overall Health Index</h2>
              <p className="text-xs text-slate-400">Composite index aggregating financial solvency, customer retention, operational velocity, and AI risk telemetry.</p>
            </div>

            <div className="bg-slate-950 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Current Health Index</span>
                <span className="text-2xl font-black text-emerald-400">94.8 / 100</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                Optimal
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Financial Solvency & Runway</span>
              <div className="text-2xl font-black text-white">28.4 Months</div>
              <p className="text-xs text-slate-400">Positive net cash flow with 18.4% gross margins</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Customer Retention Index</span>
              <div className="text-2xl font-black text-emerald-400">98.18%</div>
              <p className="text-xs text-slate-400">Monthly churn suppressed below 1.82% target</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">AI Risk & Anomaly Score</span>
              <div className="text-2xl font-black text-indigo-400">Low Risk (0.12)</div>
              <p className="text-xs text-slate-400">Automated monitoring active on 48 business KPIs</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
