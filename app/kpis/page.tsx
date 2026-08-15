"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Target, Plus, ArrowUpRight, Activity, X, Download, Filter } from "lucide-react";
import { mockDepartmentKPIs } from "@/lib/mock-data";
import { exportToCSV } from "@/lib/export-utils";

export default function KpisPage() {
  const [kpis, setKpis] = useState(mockDepartmentKPIs);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // New KPI form state
  const [newKpiName, setNewKpiName] = useState("");
  const [newKpiCategory, setNewKpiCategory] = useState("Revenue");
  const [newKpiTarget, setNewKpiTarget] = useState("");
  const [newKpiMetric, setNewKpiMetric] = useState("");

  const handleAddKpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKpiName.trim()) return;

    const newItem = {
      id: `kpi_${Date.now()}`,
      name: newKpiName,
      category: newKpiCategory,
      target: Number(newKpiTarget) || 2500000,
      value: 2450000,
      metric: newKpiMetric || "₹ 24.5L",
      unit: "INR",
      trend: 14.2,
      status: "on_track",
      owner: "Kiruthika Anand",
    };

    setKpis([newItem, ...kpis]);
    setNewKpiName("");
    setNewKpiTarget("");
    setNewKpiMetric("");
    setShowAddModal(false);
  };

  const filteredKPIs = kpis.filter(
    (k: any) => categoryFilter === "ALL" || k.category.toUpperCase() === categoryFilter.toUpperCase()
  );

  const handleExportCSV = () => {
    exportToCSV("organization_kpi_metrics", filteredKPIs);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="KPI Management" subtitle="Define, monitor, and align organizational key performance indicators" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-300 p-6 rounded-3xl shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-indigo-700">Organization Scope • KPIs</span>
              <h2 className="text-xl font-black text-stone-900">Target Telemetry & KPI Center</h2>
              <p className="text-xs text-stone-500">Track metrics across Revenue, Marketing, Product, Sales & Finance</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>Export KPIs CSV</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Create New KPI</span>
              </button>
            </div>
          </div>

          {/* Interactive Category Filter */}
          <div className="bg-white border border-stone-300 p-4 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-bold text-stone-700">
              <Filter className="h-4 w-4 text-stone-500" />
              <span>Category Filter:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 text-stone-900 rounded-xl px-3 py-1.5 font-bold"
              >
                <option value="ALL">All Categories</option>
                <option value="REVENUE">Revenue</option>
                <option value="SALES">Sales</option>
                <option value="MARKETING">Marketing</option>
                <option value="PRODUCT">Product</option>
                <option value="FINANCE">Finance</option>
              </select>
            </div>
            <span className="text-xs font-bold text-stone-500">
              Showing {filteredKPIs.length} KPIs
            </span>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKPIs.map((kpi: any) => (
              <div
                key={kpi.id}
                className="bg-white border border-stone-300 p-6 rounded-3xl shadow-sm space-y-4 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg">
                      {kpi.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        kpi.status === "on_track"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {kpi.status === "on_track" ? "On Track" : "At Risk"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900">{kpi.name}</h3>
                  <p className="text-xs text-stone-500 mt-1">Owner: {kpi.owner}</p>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-stone-900">{kpi.metric}</span>
                      <span className="text-xs text-stone-500 ml-1">/ Target</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <ArrowUpRight className="h-4 w-4" /> {kpi.trend > 0 ? `+${kpi.trend}%` : `${kpi.trend}%`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add KPI Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white border border-stone-300 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="text-base font-black text-stone-900">Define New Key Performance Indicator</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleAddKpi} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">KPI Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Enterprise Net Retention Rate"
                      value={newKpiName}
                      onChange={(e) => setNewKpiName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Category</label>
                      <select
                        value={newKpiCategory}
                        onChange={(e) => setNewKpiCategory(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-medium"
                      >
                        <option value="Revenue">Revenue</option>
                        <option value="Sales">Sales</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Product">Product</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Display Metric</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ₹ 28.5L"
                        value={newKpiMetric}
                        onChange={(e) => setNewKpiMetric(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Target Numeric Value</label>
                    <input
                      type="text"
                      placeholder="e.g. 3000000"
                      value={newKpiTarget}
                      onChange={(e) => setNewKpiTarget(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow"
                    >
                      Save KPI Indicator
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
