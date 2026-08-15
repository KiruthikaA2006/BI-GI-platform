"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Target, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function ManagerKPIsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-blue-500">
      <Sidebar currentRole="DEPARTMENT_MANAGER" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Department KPIs" subtitle="Manager Login Scope: Dedicated Sales & Department Metrics" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-blue-600">Manager Scope: Department KPIs</span>
              <h1 className="text-2xl font-black text-stone-900">Sales & Marketing Performance Metrics</h1>
              <p className="text-xs text-stone-500">Strictly isolated within your Department Manager login workspace.</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Department Level
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white border border-stone-200 p-5 rounded-2xl space-y-2 shadow-sm">
              <span className="text-xs font-bold text-stone-500 uppercase">Sales Qualified Leads (SQLs)</span>
              <div className="text-2xl font-black text-stone-900">420 Leads</div>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> +12.4% vs Last Month
              </span>
            </div>

            <div className="bg-white border border-stone-200 p-5 rounded-2xl space-y-2 shadow-sm">
              <span className="text-xs font-bold text-stone-500 uppercase">Average Deal Size</span>
              <div className="text-2xl font-black text-stone-900">$18,400</div>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> +5.2% vs Target
              </span>
            </div>

            <div className="bg-white border border-stone-200 p-5 rounded-2xl space-y-2 shadow-sm">
              <span className="text-xs font-bold text-stone-500 uppercase">Sales Cycle Duration</span>
              <div className="text-2xl font-black text-stone-900">18.2 Days</div>
              <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                -2.1 Days Improvement
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
