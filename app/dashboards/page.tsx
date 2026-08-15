"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  BarChart3,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  DollarSign,
  Users,
  Target,
} from "lucide-react";

export default function DashboardsPage() {
  const [activeTab, setActiveTab] = useState<"kpi_views" | "reports">("kpi_views");

  return (
    <div className="flex h-screen bg-[#e4dac9] text-stone-900 overflow-hidden selection:bg-blue-500">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Dashboards — KPI Views & Reports" subtitle="Pillar 2 in BI-GI Architecture" />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Pillar 2 • Visual Analytics & Reporting</span>
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                Dashboards & Reports Workspace
              </h1>
              <p className="text-xs text-stone-600">
                Explore real-time KPI scorecards, department metrics, and scheduled executive reports.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300">
              <button
                onClick={() => setActiveTab("kpi_views")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "kpi_views"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                KPI Views
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "reports"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Reports
              </button>
            </div>
          </div>

          {/* KPI Views Tab */}
          {activeTab === "kpi_views" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-stone-500">Revenue & Finance</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Optimal
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-stone-900">$248,500 MRR</h3>
                  <p className="text-xs text-stone-600">Gross Margin: 64.2% • EBITDA: $82.4k</p>
                </div>

                <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-stone-500">Sales Velocity</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      On Track
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-stone-900">14 Days Win Cycle</h3>
                  <p className="text-xs text-stone-600">Avg Deal Size: $18,400 • Win Rate: 34.2%</p>
                </div>

                <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-stone-500">Customer Success</span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Attention
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-stone-900">1.82% Churn Rate</h3>
                  <p className="text-xs text-stone-600">NPS: 68 • Net Expansion: 112.4%</p>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900">Executive & Department PDF/CSV Reports</h3>
              <p className="text-xs text-stone-600">Generated automatically from Pillar 1 Data Center Engine.</p>
              <Link
                href="/reports"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
              >
                <span>View Full Reports Center →</span>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
