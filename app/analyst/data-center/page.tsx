"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Database, CheckCircle2, RefreshCw, Layers, ShieldCheck, ArrowRight, Activity, FileSpreadsheet } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function AnalystDataCenterPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [imports, setImports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);

    fetch("/api/data-imports")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.imports)) {
          setImports(data.imports);
        }
      })
      .catch((err) => console.error("Error fetching data imports for analyst pipeline:", err))
      .finally(() => setLoading(false));
  }, []);

  const pipelineStages = [
    { stage: "1. Data Connection & Ingestion", status: "Active", desc: "CSV, XLSX & API connectors ingestion engine" },
    { stage: "2. Validation & Cleaning", status: "Active", desc: "Automated schema field validation & row sanitization" },
    { stage: "3. Schema Transformation", status: "Active", desc: "Entity detection for sales, expenses, leads, and goals" },
    { stage: "4. Metric & KPI Computation", status: "Active", desc: "Calculates MRR, profit margin, churn rate & velocity" },
    { stage: "5. RLS Security & Isolation", status: "Enforced", desc: "Row-Level Security boundary per organization tenant" },
    { stage: "6. PostgreSQL Persistence", status: "Online", desc: "Persisted into PostgreSQL DataImport & Dataset tables" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-cyan-500">
      <Sidebar currentRole="ANALYST" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Analyst Data Center Pipeline" subtitle="Analyst Scope: 6-Stage Processing Pipeline Monitoring" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800">Pipeline Monitoring • {currentOrgName}</span>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">Data Processing Pipeline Status</h1>
              <p className="text-xs text-stone-600">6-Stage automated telemetry pipeline transforming raw CSVs into PostgreSQL growth analytics</p>
            </div>
            <Link
              href="/analyst/ingestion"
              className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
            >
              <span>+ Ingest New Data File</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* 6-Stage Pipeline Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pipelineStages.map((st, idx) => (
              <div key={idx} className="bg-white border border-stone-300 p-5 rounded-2xl space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-cyan-800">{st.stage}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {st.status}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{st.desc}</p>
                <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Pipeline Operational</span>
                </div>
              </div>
            ))}
          </div>

          {/* Ingested Datasets Status Table */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-stone-900 tracking-tight flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-700" />
                <span>Ingested Datasets in PostgreSQL ({imports.length})</span>
              </h2>
              <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                Tenant: {currentOrgName}
              </span>
            </div>

            {imports.length > 0 ? (
              <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="p-3">Dataset Name</th>
                      <th className="p-3">Uploaded By</th>
                      <th className="p-3">Files Count</th>
                      <th className="p-3">Total Rows</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-white font-medium">
                    {imports.map((imp) => (
                      <tr key={imp.id} className="hover:bg-stone-50 transition">
                        <td className="p-3 font-bold text-stone-900 flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4 text-cyan-700" />
                          <span>{imp.datasetName}</span>
                        </td>
                        <td className="p-3 text-stone-600">{imp.uploadedBy}</td>
                        <td className="p-3 font-bold text-stone-800">{imp.filesCount || (imp.files ? imp.files.length : 0)} CSVs</td>
                        <td className="p-3 font-mono font-bold text-stone-900">{(imp.totalRows || 0).toLocaleString()} rows</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 bg-stone-50 border border-stone-200 rounded-2xl text-center space-y-3">
                <Activity className="h-8 w-8 text-stone-400 mx-auto" />
                <p className="text-xs text-stone-600 font-medium">
                  No datasets processed in pipeline for <strong>{currentOrgName}</strong> yet.
                </p>
                <Link
                  href="/analyst/ingestion"
                  className="inline-flex items-center gap-1.5 bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
                >
                  <span>Ingest CSV Dataset Now →</span>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
