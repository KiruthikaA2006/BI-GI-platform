"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { Target, ArrowUpRight, ArrowRight, DollarSign, Users, ShoppingBag, TrendingUp } from "lucide-react";

export default function ExecutiveKPIsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-indigo-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive KPIs" subtitle="High-Level Financial & Growth Metrics: Revenue, Profit, Sales, Customers" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-400">Executive Flow Node: KPIs</span>
              <h2 className="text-xl font-black text-white">Revenue, Profit, Sales & Customers</h2>
              <p className="text-xs text-slate-400">Core financial metrics feeding directly into AI Insights ("Why?").</p>
            </div>

            <Link
              href="/executive/ai-insights"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <span>Analyze in AI Insights →</span>
            </Link>
          </div>

          {/* 4 Core Executive Metric Cards matching Screenshot 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">Monthly Recurring Revenue</span>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white">$248,500</div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> +14.2% YoY
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">Net Profit Margin</span>
                <TrendingUp className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-black text-white">$74,200</div>
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> 29.8% Margin
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">Gross Sales Vol.</span>
                <ShoppingBag className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white">1,420 Deals</div>
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> +8.4% QoQ
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">Active Paid Customers</span>
                <Users className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white">4,850 Accounts</div>
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> 98.2% Retention
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
