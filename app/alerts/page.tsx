"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Bell, Plus, ShieldAlert, CheckCircle2, Download, X } from "lucide-react";
import { mockAlerts } from "@/lib/mock-data";
import { exportToCSV } from "@/lib/export-utils";
import { getActiveOrganization } from "@/lib/org-context";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [stats, setStats] = useState<any>(null);

  // New rule form states
  const [ruleName, setRuleName] = useState("");
  const [metric, setMetric] = useState("Monthly Revenue (MRR)");
  const [condition, setCondition] = useState("Drops below $220,000");
  const [severity, setSeverity] = useState<"CRITICAL" | "HIGH" | "MEDIUM">("HIGH");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);

    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data);
          if (data.organizationName) setCurrentOrgName(data.organizationName);
        }
      })
      .catch((err) => console.error("Error fetching stats for alerts:", err));
  }, []);

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
        <Header title={`Threshold Alerts — ${currentOrgName}`} subtitle="Configure automated metric threshold alerts, risk detectors & notification triggers" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Header Action Bar */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-700">Threshold Governance • {currentOrgName}</span>
              <h1 className="text-2xl font-black text-stone-900">Operational Risk & Threshold Rules • {currentOrgName}</h1>
              <p className="text-xs text-stone-600">Metric boundary guards and trigger rules for <strong>{currentOrgName}</strong>.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Alerts</span>
              </button>
              <button
                onClick={() => setShowConfigModal(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Threshold Guard Rule</span>
              </button>
            </div>
          </div>

          {/* Zero Dataset Empty State Guard */}
          {stats && (stats.rawRowsCount === 0 || !stats.datasetInfo) ? (
            <div className="bg-white border border-stone-300 p-8 md:p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <div className="h-16 w-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Bell className="h-8 w-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-black text-stone-900">No Dataset Uploaded for {currentOrgName}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Organization <strong>{currentOrgName}</strong> does not have any imported CSV datasets yet. Operational alerts and threshold guards are evaluated strictly against active dataset rows.
                </p>
              </div>
              <Link
                href="/analyst/preparation"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition"
              >
                <span>Import CSV Dataset for {currentOrgName} →</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`bg-white border p-5 rounded-2xl transition space-y-3 shadow-sm ${
                    alt.severity === "CRITICAL"
                      ? "border-rose-300 hover:border-rose-400"
                      : alt.severity === "HIGH"
                      ? "border-amber-300 hover:border-amber-400"
                      : "border-stone-300 hover:border-stone-400"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${
                            alt.severity === "CRITICAL"
                              ? "bg-rose-50 border-rose-200 text-rose-800"
                              : alt.severity === "HIGH"
                              ? "bg-amber-50 border-amber-200 text-amber-800"
                              : "bg-stone-100 border-stone-300 text-stone-700"
                          }`}
                        >
                          {alt.severity} THRESHOLD
                        </span>
                        <span className="text-xs font-bold text-stone-900">{alt.name}</span>
                      </div>
                      <p className="text-xs text-stone-600 font-medium">{alt.description}</p>
                      <div className="flex items-center gap-4 text-[11px] text-stone-500 font-mono pt-1">
                        <span>Metric: {alt.metric}</span>
                        <span>•</span>
                        <span>Condition: {alt.condition}</span>
                        <span>•</span>
                        <span>Triggered: {alt.createdAt}</span>
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
                </div>
              ))}
            </div>
          )}

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
