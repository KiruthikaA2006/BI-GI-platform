"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Bell, Plus, ShieldAlert, CheckCircle2, Download, X } from "lucide-react";
import { mockAlerts } from "@/lib/mock-data";
import { exportToCSV } from "@/lib/export-utils";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // New rule form states
  const [ruleName, setRuleName] = useState("");
  const [metric, setMetric] = useState("Monthly Revenue (MRR)");
  const [condition, setCondition] = useState("Drops below $220,000");
  const [severity, setSeverity] = useState<"CRITICAL" | "HIGH" | "MEDIUM">("HIGH");
  const [description, setDescription] = useState("");

  const toggleAlertStatus = (id: string) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    const newRule = {
      id: `alt_${Date.now()}`,
      name: ruleName,
      metric,
      condition,
      threshold: 15,
      severity,
      description: description || `Automated alert triggered when ${metric} ${condition}`,
      isActive: true,
      createdAt: "Just now",
    };

    setAlerts([newRule, ...alerts]);
    setRuleName("");
    setDescription("");
    setShowConfigModal(false);
  };

  const handleExportCSV = () => {
    exportToCSV("active_alerts", alerts);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Threshold Alerts" subtitle="Configure automated metric threshold alerts, risk detectors & notification triggers" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-300 p-6 rounded-3xl shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-indigo-700">Organization Scope • Alerts</span>
              <h2 className="text-xl font-black text-stone-900">Active Alert Trigger Rules</h2>
              <p className="text-xs text-stone-500">Monitor revenue drops, CAC spikes, dataset failures, and target risks</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>Export Alerts CSV</span>
              </button>

              <button
                onClick={() => setShowConfigModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Configure New Rule</span>
              </button>
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className="bg-white border border-stone-300 p-6 rounded-3xl shadow-sm space-y-3 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-2xl border ${
                      alt.severity === "CRITICAL"
                        ? "bg-rose-50 text-rose-600 border-rose-200"
                        : alt.severity === "HIGH"
                        ? "bg-amber-50 text-amber-600 border-amber-200"
                        : "bg-blue-50 text-blue-600 border-blue-200"
                    }`}
                  >
                    <ShieldAlert className="h-6 w-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-stone-900">{alt.name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                          alt.severity === "CRITICAL"
                            ? "bg-rose-100 text-rose-700 border-rose-300"
                            : alt.severity === "HIGH"
                            ? "bg-amber-100 text-amber-700 border-amber-300"
                            : "bg-blue-100 text-blue-700 border-blue-300"
                        }`}
                      >
                        {alt.severity}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">{alt.description}</p>
                    <div className="flex items-center gap-4 text-[11px] text-stone-500 pt-1">
                      <span>Metric: <strong className="text-stone-800">{alt.metric}</strong></span>
                      <span>Condition: <strong className="text-stone-800">{alt.condition}</strong></span>
                      <span>Triggered: {alt.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleAlertStatus(alt.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      alt.isActive
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "bg-stone-100 border-stone-300 text-stone-500"
                    }`}
                  >
                    {alt.isActive ? "Active Rule" : "Paused"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Configure Rule Modal */}
          {showConfigModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white border border-stone-300 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="text-lg font-black text-stone-900">Configure New Alert Rule</h3>
                  <button onClick={() => setShowConfigModal(false)} className="text-stone-400 hover:text-stone-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Rule Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CAC Spike Alert (> $140)"
                      value={ruleName}
                      onChange={(e) => setRuleName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Target Metric</label>
                      <select
                        value={metric}
                        onChange={(e) => setMetric(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-medium"
                      >
                        <option>Monthly Revenue (MRR)</option>
                        <option>Customer Acquisition Cost (CAC)</option>
                        <option>Churn Rate</option>
                        <option>Dataset Ingestion Failures</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Severity Level</label>
                      <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as any)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-medium"
                      >
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Condition</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Increases above +15%"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Explain rule trigger threshold..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowConfigModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg"
                    >
                      Create Alert Rule
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
