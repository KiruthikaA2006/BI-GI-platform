"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import {
  Activity,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Lightbulb,
  Target,
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle2,
  DollarSign,
  Users,
  PieChart,
} from "lucide-react";

export default function ExecutiveCommandCenterPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-indigo-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive Command Center" subtitle="Overall Business Health Cockpit • Answers: What is happening? → Why? → What happens next? → What should we do?" />

        <main className="p-6 space-y-8 max-w-[1600px] mx-auto w-full">
          {/* Executive Philosophy Header Banner Card */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl relative overflow-hidden shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold uppercase tracking-wider">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Executive Command Center • Active Telemetry</span>
                </div>
                <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                  Executive Growth & Health Cockpit
                </h1>
                <p className="text-xs text-stone-600 max-w-xl">
                  Streamlined executive overview — free of raw data-processing noise. Answering: <strong>What is happening? ➔ Why? ➔ What happens next? ➔ What should we do?</strong>
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex items-center gap-6 min-w-[300px]">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-stone-500 block">Overall Business Health</span>
                  <span className="text-3xl font-black text-emerald-700">94.8<span className="text-xs text-stone-500">/100</span></span>
                </div>
                <div className="h-10 w-px bg-stone-300" />
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-stone-500 block">Executive Velocity</span>
                  <span className="text-sm font-bold text-indigo-700 flex items-center gap-1">
                    <ArrowUpRight className="h-4 w-4" /> +14.2% YoY
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Entry Pillars: KPIs, TRENDS, ALERTS Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600" />
                <span>1. What is Happening? (High-Level Telemetry)</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Executive KPIs Card */}
              <Link
                href="/executive/kpis"
                className="bg-white border border-stone-300 p-6 rounded-3xl hover:border-indigo-400 transition group space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-full border border-indigo-200">
                    High-Level KPIs
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-indigo-700 transition">Executive KPIs</h3>
                  <p className="text-xs text-stone-600 mt-1">
                    $2.45M Revenue • 64.2% Gross Margin • 1.82% Churn Rate
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-indigo-700">
                  <span>Explore High-Level Metrics</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>

              {/* Business Health Card */}
              <Link
                href="/executive/business-health"
                className="bg-white border border-stone-300 p-6 rounded-3xl hover:border-indigo-400 transition group space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                    <Activity className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                    Solvency & Health
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition">Overall Business Health</h3>
                  <p className="text-xs text-stone-600 mt-1">
                    94.8/100 Health Score • Low Risk Profile • +14.2% YoY Growth
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <span>View Solvency Scorecard</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>

              {/* Trends Card */}
              <Link
                href="/executive/trends"
                className="bg-white border border-stone-300 p-6 rounded-3xl hover:border-indigo-400 transition group space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 font-bold">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-purple-50 text-purple-800 px-2.5 py-1 rounded-full border border-purple-200">
                    Trends & Patterns
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-purple-700 transition">Trends & Growth Patterns</h3>
                  <p className="text-xs text-stone-600 mt-1">
                    South Region Lead Surge (+22.4%) vs Ad Spend CAC Spike (+18%)
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-purple-700">
                  <span>Analyze Macro Trends</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
