"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  Database,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Sparkles,
  BarChart3,
  Layers,
  ArrowRight,
  FileSpreadsheet,
  Cloud,
  Check,
} from "lucide-react";

export default function DataCenterPage() {
  const [activeStage, setActiveStage] = useState<number>(1);

  const pipelineStages = [
    {
      id: 1,
      title: "1. Data Ingestion",
      icon: Upload,
      description: "Connect CSV/XLSX uploads, PostgreSQL, Stripe & Salesforce APIs",
      status: "4 Connected Sources",
      color: "text-cyan-700",
      bgColor: "bg-cyan-50 border-cyan-200 text-cyan-800",
    },
    {
      id: 2,
      title: "2. Cleaning & Prep",
      icon: RefreshCw,
      description: "Auto-deduplication, date parsing, missing value imputation & null filters",
      status: "145,000 Rows Cleaned",
      color: "text-blue-700",
      bgColor: "bg-blue-50 border-blue-200 text-blue-800",
    },
    {
      id: 3,
      title: "3. Normalization",
      icon: Sliders,
      description: "Currency conversions (USD → INR), regional aggregation & schema mapping",
      status: "100% Schema Aligned",
      color: "text-purple-700",
      bgColor: "bg-purple-50 border-purple-200 text-purple-800",
    },
    {
      id: 4,
      title: "4. Business Logic",
      icon: Layers,
      description: "Applies revenue formulas, CAC calculations, churn rules & margins",
      status: "32 Rules Applied",
      color: "text-amber-700",
      bgColor: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: 5,
      title: "5. KPI Generation",
      icon: BarChart3,
      description: "Computes MRR, ARR, CAC, ARPU, LTV, and NPS metrics in real-time",
      status: "6 Primary KPIs Computed",
      color: "text-indigo-700",
      bgColor: "bg-indigo-50 border-indigo-200 text-indigo-800",
    },
    {
      id: 6,
      title: "6. Data Center Storage",
      icon: Database,
      description: "Stores normalized dataset in analytical PostgreSQL warehouse for AI Insights",
      status: "Live Output Ready",
      color: "text-emerald-700",
      bgColor: "bg-emerald-50 border-emerald-200 text-emerald-800",
    },
  ];

  return (
    <div className="flex h-screen bg-[#e4dac9] text-stone-900 overflow-hidden selection:bg-cyan-500">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Data Center — Pipeline & KPI Engine" subtitle="Pillar 1 in BI-GI Architecture: 6-stage data processing pipeline" />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider">
                <Database className="h-3.5 w-3.5" />
                <span>Pillar 1 • Operational Data Pipeline</span>
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                Data Center & Ingestion Pipeline
              </h1>
              <p className="text-xs text-stone-600 max-w-xl">
                Continuous 6-stage pipeline transforming raw unstructured data into validated, high-precision KPI metrics for Dashboards & AI Insights.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/data-sources/import"
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                <span>Connect Data Source</span>
              </Link>
              <Link
                href="/dashboards"
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-stone-300 transition flex items-center gap-1.5"
              >
                <span>Proceed to Dashboards</span>
                <ArrowRight className="h-3.5 w-3.5 text-indigo-700" />
              </Link>
            </div>
          </div>

          {/* Interactive 6-Stage Pipeline Stepper Bar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">6-Stage Data Flow Pipeline</h2>
              <span className="text-xs font-bold text-cyan-800">Click any stage to view live status</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
              {pipelineStages.map((stage) => {
                const Icon = stage.icon;
                const isSelected = activeStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(stage.id)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 relative overflow-hidden ${
                      isSelected
                        ? "bg-white border-cyan-600 ring-2 ring-cyan-500/40 shadow-md"
                        : "bg-white border-stone-300 hover:border-stone-400 text-stone-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                        Stage {stage.id}
                      </span>
                      <Icon className={`h-4 w-4 ${stage.color}`} />
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-stone-900">{stage.title}</h3>
                      <p className="text-[10px] text-stone-600 line-clamp-1 mt-0.5">{stage.status}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Stage Detailed Breakdown */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold">
                  {activeStage}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-cyan-800 tracking-wider">
                    Selected Pipeline Stage Breakdown
                  </span>
                  <h3 className="text-xl font-bold text-stone-900">
                    {pipelineStages[activeStage - 1].title}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Stage Operational
              </span>
            </div>

            {/* Stage 1 Content */}
            {activeStage === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-800 font-bold text-sm">
                    <Database className="h-4 w-4" /> PostgreSQL Production DB
                  </div>
                  <p className="text-xs text-stone-600">Direct SQL connection for customer transactions & ledger</p>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold block">Latency: 12ms • Connected</span>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                    <Cloud className="h-4 w-4" /> Stripe Billing REST API
                  </div>
                  <p className="text-xs text-stone-600">Webhook sync for monthly recurring revenue & subscriptions</p>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold block">Sync: 1 min ago • 200 OK</span>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <FileSpreadsheet className="h-4 w-4" /> CSV/XLSX Manual Import
                  </div>
                  <p className="text-xs text-stone-600">Ad-hoc department spreadsheet batch uploads</p>
                  <span className="text-[10px] text-indigo-700 font-mono font-bold block">Uploaded: Q3 Sales Batch.csv</span>
                </div>
              </div>
            )}

            {/* Stage 2 to 6 Content */}
            {activeStage > 1 && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <h4 className="text-sm font-bold text-stone-900">{pipelineStages[activeStage - 1].description}</h4>
                <p className="text-xs text-stone-600">Automated processing active with 100% throughput efficiency.</p>
                <div className="pt-2 flex items-center gap-2 text-xs text-emerald-700 font-bold">
                  <Check className="h-4 w-4" /> Status: {pipelineStages[activeStage - 1].status}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
