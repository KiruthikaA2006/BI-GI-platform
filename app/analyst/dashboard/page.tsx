"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  LayoutDashboard,
  TableProperties,
  Search,
  TrendingUp,
  Sparkles,
  FileText,
  ArrowRight,
  Database,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  PieChart,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function AnalystDashboardPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [activeTab, setActiveTab] = useState<"available_datasets" | "my_analysis">("available_datasets");
  const [datasets, setDatasets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);

    fetch("/api/datasets")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.datasets)) {
          setDatasets(data.datasets);
        }
      })
      .catch((err) => console.error("Error fetching analyst datasets:", err));

    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data);
        }
      })
      .catch(() => {});
  }, []);

  const totalRowsCount = datasets.reduce((acc, d) => acc + (d.rowCount || 0), 0);

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-cyan-500">
      <Sidebar currentRole="ANALYST" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Analyst Dashboard" subtitle="Analyst Workflow: Datasets ➔ Data Prep ➔ Analysis ➔ Visualizations ➔ AI Insights ➔ Reports" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Workflow Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-cyan-700">Analyst Scope • {currentOrgName}</span>
              <h1 className="text-2xl font-black text-stone-900">Analyst Workspace & Data Engine</h1>
              <p className="text-xs text-stone-600 max-w-2xl">
                Execute end-to-end data analysis for <strong>{currentOrgName}</strong>: Select Organization Datasets ➔ Data Preparation ➔ Statistical Analysis ➔ Visualization Builder ➔ AI Insights ➔ Share Reports.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-300">
              <button
                onClick={() => setActiveTab("available_datasets")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                  activeTab === "available_datasets"
                    ? "bg-cyan-700 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Available Datasets ({datasets.length})
              </button>
              <button
                onClick={() => setActiveTab("my_analysis")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                  activeTab === "my_analysis"
                    ? "bg-cyan-700 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                My Analysis Studio
              </button>
            </div>
          </div>

          {/* Workflow Steps Visual Navigator Bar */}
          <div className="bg-white border border-stone-300 p-5 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="text-[10px] font-extrabold uppercase text-stone-500">Analyst End-to-End Pipeline</span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                PostgreSQL RLS Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs font-bold">
              <Link href="/analyst/datasets" className="p-3 bg-cyan-50 border border-cyan-200 hover:border-cyan-400 rounded-2xl text-cyan-900 transition space-y-1">
                <TableProperties className="h-4 w-4 mx-auto text-cyan-700" />
                <span className="block text-[11px]">1. Datasets</span>
              </Link>
              <Link href="/analyst/preparation" className="p-3 bg-stone-50 border border-stone-200 hover:border-cyan-400 rounded-2xl text-stone-800 transition space-y-1">
                <RefreshCw className="h-4 w-4 mx-auto text-stone-600" />
                <span className="block text-[11px]">2. Data Prep</span>
              </Link>
              <Link href="/analyst/analysis" className="p-3 bg-stone-50 border border-stone-200 hover:border-cyan-400 rounded-2xl text-stone-800 transition space-y-1">
                <Search className="h-4 w-4 mx-auto text-stone-600" />
                <span className="block text-[11px]">3. Analysis</span>
              </Link>
              <Link href="/analyst/visualizations" className="p-3 bg-stone-50 border border-stone-200 hover:border-cyan-400 rounded-2xl text-stone-800 transition space-y-1">
                <BarChart3 className="h-4 w-4 mx-auto text-stone-600" />
                <span className="block text-[11px]">4. Visual Builder</span>
              </Link>
              <Link href="/analyst/ai-insights" className="p-3 bg-purple-50 border border-purple-200 hover:border-purple-400 rounded-2xl text-purple-900 transition space-y-1">
                <Sparkles className="h-4 w-4 mx-auto text-purple-700" />
                <span className="block text-[11px]">5. AI Insights</span>
              </Link>
              <Link href="/analyst/reports" className="p-3 bg-indigo-50 border border-indigo-200 hover:border-indigo-400 rounded-2xl text-indigo-900 transition space-y-1">
                <FileText className="h-4 w-4 mx-auto text-indigo-700" />
                <span className="block text-[11px]">6. Share Reports</span>
              </Link>
            </div>
          </div>

          {/* Tab Content 1: Available Datasets */}
          {activeTab === "available_datasets" && (
            <div className="space-y-6">
              <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-stone-900">Organization Datasets Catalog</h2>
                    <p className="text-xs text-stone-500">Select an organization dataset to inspect rows/columns, clean data, and build analysis</p>
                  </div>
                  <Link
                    href="/analyst/datasets"
                    className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
                  >
                    View All Datasets Catalog →
                  </Link>
                </div>

                {datasets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    {datasets.map((ds) => (
                      <div key={ds.id} className="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-3 shadow-sm hover:border-cyan-500 transition">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase bg-white border border-stone-300 px-2 py-0.5 rounded text-stone-700">
                            {(ds.rowCount || 0).toLocaleString()} Rows
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            PostgreSQL
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-stone-900">{ds.name}</h3>
                        <p className="text-xs text-stone-600 line-clamp-2">{ds.description || "Ingested transactional dataset"}</p>
                        <div className="pt-2 flex items-center justify-between border-t border-stone-200 text-xs">
                          <Link href={`/analyst/datasets?id=${ds.id}`} className="font-bold text-cyan-700 hover:underline">
                            Inspect Details →
                          </Link>
                          <Link href="/analyst/preparation" className="font-bold text-stone-600 hover:text-stone-900">
                            Prepare Data ➔
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 bg-stone-50 border border-stone-200 rounded-2xl text-center space-y-3">
                    <Database className="h-8 w-8 text-stone-400 mx-auto" />
                    <p className="text-xs text-stone-600 font-medium">No datasets uploaded for <strong>{currentOrgName}</strong> yet.</p>
                    <Link href="/data-center" className="inline-flex items-center gap-1.5 bg-cyan-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow">
                      <span>Import Dataset in Data Center →</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab Content 2: My Analysis */}
          {activeTab === "my_analysis" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/analyst/analysis"
                className="bg-white border border-stone-300 p-6 rounded-3xl hover:border-cyan-500 transition shadow-sm space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold">
                    <Search className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200 uppercase">
                    Step 3
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-cyan-700 transition">Data Analysis Workbench</h3>
                <p className="text-xs text-stone-600">Descriptive statistics, growth trends, correlation matrix, and metric filtering.</p>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-cyan-700">
                  <span>Open Analysis Studio →</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                </div>
              </Link>

              <Link
                href="/analyst/visualizations"
                className="bg-white border border-stone-300 p-6 rounded-3xl hover:border-blue-500 transition shadow-sm space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 uppercase">
                    Step 4
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-blue-700 transition">Visualization Builder</h3>
                <p className="text-xs text-stone-600">Build custom bar charts, line trends, pie breakdown charts, and KPI summary scorecards.</p>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-blue-700">
                  <span>Launch Visual Builder →</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                </div>
              </Link>

              <Link
                href="/analyst/reports"
                className="bg-white border border-stone-300 p-6 rounded-3xl hover:border-indigo-500 transition shadow-sm space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 uppercase">
                    Step 6
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-indigo-700 transition">Save & Share Reports</h3>
                <p className="text-xs text-stone-600">Compile analysis into PDF presentation decks or text format reports to share with executives.</p>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-indigo-700">
                  <span>Export & Share Reports →</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
