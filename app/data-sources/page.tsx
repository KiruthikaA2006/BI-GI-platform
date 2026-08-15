"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  Database,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  Globe,
  HardDrive,
  Users,
  Headphones,
  CreditCard,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UploadCloud,
  ChevronRight,
} from "lucide-react";
import { mockDataSources } from "@/lib/mock-data";

export default function DataSourcesPage() {
  const [sources, setSources] = useState(mockDataSources);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const getConnectorIcon = (type: string) => {
    switch (type) {
      case "DATABASE":
        return HardDrive;
      case "CSV":
      case "XLSX":
        return FileSpreadsheet;
      case "REST_API":
        return Globe;
      case "CRM":
        return Users;
      case "SUPPORT":
        return Headphones;
      case "PAYMENT":
        return CreditCard;
      case "ACCOUNTING":
        return Calculator;
      default:
        return Database;
    }
  };

  const triggerSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSources((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: "connected", lastSyncAt: new Date().toISOString().replace("T", " ").substring(0, 19) }
            : s
        )
      );
      setSyncingId(null);
    }, 1200);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Data Sources" subtitle="Manage enterprise connectors, sync frequencies, and data pipelines" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Connected Enterprise Data Pipelines</h2>
              <p className="text-xs text-slate-400">Active connectors syncing databases, CRMs, APIs & file imports</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/data-sources/import"
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload CSV / XLSX</span>
              </Link>
              <button
                onClick={() => alert("Opening Connector Marketplace...")}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition"
              >
                <Plus className="h-4 w-4 text-indigo-400" />
                <span>New Connector</span>
              </button>
            </div>
          </div>

          {/* Connectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sources.map((source) => {
              const Icon = getConnectorIcon(source.type);
              const isSyncing = syncingId === source.id;

              return (
                <div
                  key={source.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl space-y-4 transition group flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1 ${
                          source.status === "connected"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : source.status === "syncing" || isSyncing
                            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {source.status === "connected" && <CheckCircle2 className="h-3 w-3" />}
                        {source.status === "error" && <AlertTriangle className="h-3 w-3" />}
                        {isSyncing ? "Syncing..." : source.status}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition">
                      {source.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Type: <span className="text-slate-300 font-semibold">{source.type}</span></p>

                    {/* Metadata Grid */}
                    <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Data Volume</span>
                        <span className="text-slate-200 font-bold">{source.dataVolume}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Frequency</span>
                        <span className="text-slate-200 font-semibold">{source.syncFrequency}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Owner</span>
                        <span className="text-slate-300">{source.owner}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Last Sync</span>
                        <span className="text-slate-300 text-[11px]">{source.lastSyncAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => triggerSync(source.id)}
                      disabled={isSyncing}
                      className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                      <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
                    </button>
                    <Link
                      href="/datasets"
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <span>View Datasets</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
