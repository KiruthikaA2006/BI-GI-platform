"use client";

import React from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Header } from "@/components/layout/header";
import { AdminFlowNavigator } from "@/components/layout/admin-flow-navigator";
import { Database, Lock, RefreshCw, CheckCircle2, Plus, Shield } from "lucide-react";

export default function AdminDataSourcesPage() {
  const dataConnections = [
    { name: "PostgreSQL Production DB", type: "Relational SQL", status: "Active (12ms)", accessLevel: "Read-Only Replica", updated: "1 min ago" },
    { name: "Stripe Revenue Webhooks", type: "Billing API", status: "Active (Synced)", accessLevel: "Full Webhook", updated: "2 mins ago" },
    { name: "Salesforce CRM Connector", type: "SaaS REST API", status: "Active (Batch 1h)", accessLevel: "OAuth 2.0", updated: "15 mins ago" },
    { name: "Google Analytics 4 API", type: "Web Analytics", status: "Active", accessLevel: "Service Account", updated: "30 mins ago" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-cyan-500">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminFlowNavigator />
        <Header title="Admin Data Sources" subtitle="Admin Node: Connections, Data Access Controls & SaaS Integrations" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-cyan-400">Admin Architecture Node: DATA SOURCES</span>
              <h2 className="text-xl font-black text-white">Database & API Connections</h2>
              <p className="text-xs text-slate-400">Manage database pools, API tokens, data access policies, and third-party integrations.</p>
            </div>

            <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/30 transition flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Data Source Connection</span>
            </button>
          </div>

          {/* Connections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataConnections.map((conn, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-cyan-500/50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{conn.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400">{conn.type}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {conn.status}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                  <span>Access: <strong className="text-slate-200">{conn.accessLevel}</strong></span>
                  <span>Sync: {conn.updated}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
