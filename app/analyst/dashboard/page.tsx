"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { LayoutDashboard, UploadCloud, Database, TableProperties, Search, Sparkles, FileText, ArrowRight } from "lucide-react";

export default function AnalystDashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-cyan-500">
      <Sidebar currentRole="ANALYST" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Analyst Dashboard" subtitle="Data Scope: Data Ingestion, Dataset Exploration & Analytics" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-cyan-600">Analyst Studio • Data Scope</span>
            <h1 className="text-2xl font-black text-stone-900">Analyst Workspace</h1>
            <p className="text-xs text-stone-500">Manage data imports, explore datasets, execute SQL queries, and build custom analytical reports.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/analyst/ingestion"
              className="bg-white border border-stone-200 p-6 rounded-3xl hover:border-cyan-500 transition shadow-sm space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 font-bold">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100 uppercase">
                  Data Ingestion
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-cyan-600 transition">Data Ingestion</h3>
              <p className="text-xs text-stone-500">Upload CSV/XLSX files or configure automated DB API syncs.</p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-cyan-600">
                <span>Upload Data Files →</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              href="/analyst/explorer"
              className="bg-white border border-stone-200 p-6 rounded-3xl hover:border-blue-500 transition shadow-sm space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  <Search className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">
                  Data Explorer
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-blue-600 transition">Data Explorer</h3>
              <p className="text-xs text-stone-500">Interactive SQL query sandbox, metric aggregation, and visual charts.</p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Open Data Explorer →</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              href="/analyst/reports"
              className="bg-white border border-stone-200 p-6 rounded-3xl hover:border-purple-500 transition shadow-sm space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 uppercase">
                  Custom Reports
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-purple-600 transition">Custom Reports</h3>
              <p className="text-xs text-stone-500">Build bespoke analytical reports and export datasets.</p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-purple-600">
                <span>Build Custom Reports →</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
