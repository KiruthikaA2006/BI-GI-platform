"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Target, Plus, TrendingUp, TrendingDown, Edit3, Trash2, CheckCircle2 } from "lucide-react";
import { mockDepartmentKPIs } from "@/lib/mock-data";

export default function KPIsPage() {
  const [kpis, setKpis] = useState(mockDepartmentKPIs);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKpiName, setNewKpiName] = useState("");
  const [newKpiMetric, setNewKpiMetric] = useState("");
  const [newKpiCategory, setNewKpiCategory] = useState("Sales");

  const handleCreateKPI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKpiName || !newKpiMetric) return;

    const created = {
      id: `kpi_${Date.now()}`,
      name: newKpiName,
      metric: newKpiMetric,
      value: 100,
      target: 120,
      unit: "INR",
      category: newKpiCategory,
      trend: 5.0,
      status: "on_track" as const,
      owner: "Kiruthika Anand",
    };

    setKpis([created, ...kpis]);
    setNewKpiName("");
    setNewKpiMetric("");
    setShowAddModal(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="KPI Management" subtitle="Define, monitor, and align organizational key performance indicators" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Target Telemetry & KPI Center</h2>
              <p className="text-xs text-slate-400">Track metrics across Revenue, Marketing, Customer Success & Finance</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create New KPI</span>
            </button>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpis.map((kpi) => (
              <div
                key={kpi.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl space-y-4 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-slate-800 text-indigo-300 text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg">
                      {kpi.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        kpi.status === "on_track"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {kpi.status.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{kpi.name}</h3>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-white tracking-tight">{kpi.metric}</span>
                    <span
                      className={`text-xs font-semibold flex items-center gap-0.5 ${
                        (kpi.trend ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {(kpi.trend ?? 0) >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      {kpi.trend}%
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Owner: <strong className="text-slate-200">{kpi.owner}</strong></span>
                  <button
                    onClick={() => setKpis(kpis.filter((k) => k.id !== kpi.id))}
                    className="text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add KPI Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <form
                onSubmit={handleCreateKPI}
                className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">Create New Metric KPI</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="text-slate-400 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">KPI Title</label>
                  <input
                    type="text"
                    required
                    value={newKpiName}
                    onChange={(e) => setNewKpiName(e.target.value)}
                    placeholder="e.g. Monthly Recurring Revenue"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Target Value / Display Metric</label>
                  <input
                    type="text"
                    required
                    value={newKpiMetric}
                    onChange={(e) => setNewKpiMetric(e.target.value)}
                    placeholder="e.g. ₹ 30,00,000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={newKpiCategory}
                    onChange={(e) => setNewKpiCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option>Sales</option>
                    <option>Revenue</option>
                    <option>Marketing</option>
                    <option>Product</option>
                    <option>Finance</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30"
                  >
                    Save KPI
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
