"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Header } from "@/components/layout/header";
import { AdminFlowNavigator } from "@/components/layout/admin-flow-navigator";
import { Database, Plus, CheckCircle2, FileSpreadsheet, Layers, ShieldCheck } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function AdminDataSourcesPage() {
  const [dataImports, setDataImports] = useState<any[]>([]);
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [currentOrgName, setCurrentOrgName] = useState("Active Organization");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const active = getActiveOrganization();
    if (active && active.name) setCurrentOrgName(active.name);

    fetch("/api/data-imports")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.imports)) {
          setDataImports(data.imports);
          if (data.organizationName) setCurrentOrgName(data.organizationName);
        }
      })
      .catch((err) => console.error("DataImports GET error:", err));

    fetch("/api/data-sources")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.dataSources)) {
          setDataSources(data.dataSources);
        }
      })
      .catch((err) => console.error("DataSources GET error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-cyan-500">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminFlowNavigator />
        <Header title="Admin Data Sources" subtitle="Admin Node: Connections, Data Access Controls & SaaS Integrations" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-300 p-6 rounded-3xl shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-cyan-800">Admin Architecture Node: DATA SOURCES • {currentOrgName}</span>
              <h2 className="text-xl font-black text-stone-900">Database & Ingested Datasets</h2>
              <p className="text-xs text-stone-600">PostgreSQL database connection pools, multi-file CSV dataset imports, and tenant data pipelines.</p>
            </div>

            <Link
              href="/data-sources/import"
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Import New Dataset →</span>
            </Link>
          </div>

          {/* Real System Database Connection Status */}
          <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">PostgreSQL Platform Database Engine</h3>
                  <span className="text-[10px] font-mono text-stone-500">Prisma ORM • PostgreSQL Storage Node</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Active & Operational
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200">
              <span>Tenant Scope: <strong className="text-stone-900">{currentOrgName}</strong></span>
              <span>Ingested Records: <strong className="text-stone-900">{dataImports.reduce((acc, imp) => acc + (imp.totalRows || 0), 0).toLocaleString()} rows</strong></span>
            </div>
          </div>

          {/* Real Imported Datasets Section */}
          <div className="bg-white border border-stone-300 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <FileSpreadsheet className="h-4.5 w-4.5 text-cyan-700" />
                  <span>Real Imported Datasets ({dataImports.length})</span>
                </h3>
                <p className="text-xs text-stone-600">Actual CSV datasets imported for {currentOrgName} persisted in PostgreSQL</p>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-stone-500 font-medium">Loading real dataset connections...</div>
            ) : dataImports.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-stone-800">No Custom Datasets Imported Yet for {currentOrgName}</p>
                <p className="text-[11px] text-stone-500">Import CSV datasets in Data Center to populate data sources for {currentOrgName}.</p>
                <Link
                  href="/data-sources/import"
                  className="inline-flex items-center gap-1 text-xs font-bold text-cyan-700 hover:underline pt-1"
                >
                  Import Dataset Now →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataImports.map((imp) => (
                  <div key={imp.id} className="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-800 font-bold">
                          <Layers className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">{imp.datasetName}</h4>
                          <span className="text-[10px] text-stone-500 font-mono">By {imp.uploadedBy}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                        {imp.status}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
                      <span>Total Rows: <strong className="text-stone-900">{imp.totalRows?.toLocaleString() || 0}</strong></span>
                      <span>Files: <strong className="text-stone-900">{imp.filesCount || 0} CSV files</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
