"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Search, Filter, Database, TableProperties, Target, FileText, ArrowRight, Sparkles } from "lucide-react";
import { mockDatasets, mockDepartmentKPIs, mockReports, mockDataSources } from "@/lib/mock-data";

export default function ExplorerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Global Data Explorer" subtitle="Unified business search across datasets, KPIs, reports & system metadata" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Global Search Input */}
          <div className="bg-white border border-stone-300 p-8 rounded-3xl space-y-4 shadow-sm">
            <h2 className="text-xl font-black text-stone-900">Search Enterprise Platform</h2>
            <div className="relative">
              <Search className="h-5 w-5 text-stone-400 absolute left-4 top-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search customers, revenue metrics, datasets, reports, or KPIs..."
                className="w-full bg-stone-50 border border-stone-300 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 text-xs">
              {["All", "KPIs", "Datasets", "Reports", "Data Sources"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    categoryFilter === cat
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-stone-100 text-stone-700 border border-stone-300 hover:text-stone-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results Sections */}
          <div className="space-y-6">
            {/* KPIs Results */}
            {(categoryFilter === "All" || categoryFilter === "KPIs") && (
              <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Target className="h-4 w-4 text-indigo-600" />
                  <span>Matching KPIs ({mockDepartmentKPIs.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockDepartmentKPIs.map((kpi) => (
                    <div key={kpi.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                      <span className="text-xs font-bold text-stone-900">{kpi.name}</span>
                      <span className="block text-lg font-black text-indigo-700 mt-1">{kpi.metric}</span>
                      <span className="text-[10px] text-stone-500 block mt-1">Category: {kpi.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Datasets Results */}
            {(categoryFilter === "All" || categoryFilter === "Datasets") && (
              <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <TableProperties className="h-4 w-4 text-emerald-600" />
                  <span>Matching Datasets ({mockDatasets.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockDatasets.map((dt) => (
                    <div key={dt.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                      <span className="text-xs font-bold text-stone-900">{dt.name}</span>
                      <p className="text-[11px] text-stone-600 mt-1 line-clamp-2">{dt.description}</p>
                      <span className="text-[10px] text-emerald-700 font-bold block mt-2">
                        {dt.rowCount.toLocaleString()} rows
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
