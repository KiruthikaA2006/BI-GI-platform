"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Bell, Plus, ShieldAlert, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { mockAlerts } from "@/lib/mock-data";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);

  const toggleAlertStatus = (id: string) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Threshold Alerts" subtitle="Configure automated metric threshold alerts, risk detectors & notification triggers" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Active Alert Trigger Rules</h2>
              <p className="text-xs text-slate-400">Monitor revenue drops, CAC spikes, dataset failures, and target risks</p>
            </div>
            <button
              onClick={() => alert("Configure Alert Rule Dialog...")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Configure New Rule</span>
            </button>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl space-y-3 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-2xl border ${
                      alt.severity === "CRITICAL"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : alt.severity === "HIGH"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}
                  >
                    <ShieldAlert className="h-6 w-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{alt.name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          alt.severity === "CRITICAL"
                            ? "bg-rose-500/20 text-rose-300"
                            : alt.severity === "HIGH"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {alt.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{alt.description}</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span>Metric: <strong className="text-slate-300">{alt.metric}</strong></span>
                      <span>Condition: <strong className="text-slate-300">{alt.condition}</strong></span>
                      <span>Triggered: {alt.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleAlertStatus(alt.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                      alt.isActive
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    {alt.isActive ? "Active Rule" : "Paused"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
