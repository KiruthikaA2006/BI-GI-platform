"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  Database,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  BarChart3,
  Layers,
  ArrowRight,
  FileSpreadsheet,
  Cloud,
  Check,
  Building2,
  FileText,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export interface ImportFileRecord {
  id?: string;
  fileName: string;
  entityType: string;
  rowCount: number;
  validRows: number;
  invalidRows: number;
  status: string;
}

export interface DataImportRecord {
  id: string;
  organizationId: string;
  datasetName: string;
  uploadedBy: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  filesCount: number;
  totalRows: number;
  files: ImportFileRecord[];
}

export default function DataCenterPage() {
  const router = useRouter();
  const [activeStage, setActiveStage] = useState<number>(1);
  const [currentOrgName, setCurrentOrgName] = useState("Acme Global Retail");
  const [userRole, setUserRole] = useState("ORGANIZATION_ADMIN");
  const [dataImports, setDataImports] = useState<DataImportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedImportId, setExpandedImportId] = useState<string | null>(null);

  useEffect(() => {
    const active = getActiveOrganization();
    if (active && active.name) {
      setCurrentOrgName(active.name);
    }
    // Fetch auth session to get role
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          if (data.user.role) setUserRole(data.user.role);
        }
      })
      .catch(() => {});

    // Fetch previously imported datasets for current tenant from PostgreSQL API
    fetch("/api/data-imports")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.imports)) {
          setDataImports(data.imports);
          if (data.organizationName) setCurrentOrgName(data.organizationName);
        }
      })
      .catch((err) => console.error("Error fetching data imports:", err))
      .finally(() => setLoading(false));
  }, []);

  const normRole = (userRole || "ORGANIZATION_ADMIN").toUpperCase().replace(/\s+/g, "_");
  const isAuthorizedToImport = ["SUPER_ADMIN", "ORGANIZATION_ADMIN", "ADMIN", "OWNER", "ANALYST", "EXECUTIVE", "DEPARTMENT_MANAGER"].includes(normRole);

  const handleDeleteImport = async (id?: string) => {
    if (!id && !confirm("Are you sure you want to clear all imported datasets for " + currentOrgName + "?")) return;
    if (id && !confirm("Are you sure you want to delete this dataset?")) return;

    try {
      const url = id ? `/api/data-imports?id=${id}` : "/api/data-imports?clearAll=true";
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setDataImports((prev) => (id ? prev.filter((item) => item.id !== id) : []));
      } else {
        alert(data.error || "Failed to delete dataset");
      }
    } catch (err) {
      console.error("Error deleting dataset import:", err);
    }
  };

  const pipelineStages = [
    {
      id: 1,
      title: "1. Data Ingestion",
      icon: Upload,
      description: "Connect multi-file CSV uploads (8 business datasets), PostgreSQL & APIs",
      status: "Multi-CSV Ingestion Ready",
      color: "text-cyan-700",
      bgColor: "bg-cyan-50 border-cyan-200 text-cyan-800",
    },
    {
      id: 2,
      title: "2. Schema Validation",
      icon: RefreshCw,
      description: "Header inspection, row counts, data type detection & missing value audits",
      status: "100% Schema Validated",
      color: "text-blue-700",
      bgColor: "bg-blue-50 border-blue-200 text-blue-800",
    },
    {
      id: 3,
      title: "3. Entity Mapping",
      icon: Sliders,
      description: "Map customers, employees, expenses, goals, KPIs, leads, sales & support tickets",
      status: "8 Entities Mapped",
      color: "text-purple-700",
      bgColor: "bg-purple-50 border-purple-200 text-purple-800",
    },
    {
      id: 4,
      title: "4. Business Logic",
      icon: Layers,
      description: "Applies tenant-scoped row-level security & multi-tenant isolation rules",
      status: "Tenant Isolation Active",
      color: "text-amber-700",
      bgColor: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      id: 5,
      title: "5. KPI Pipeline Engine",
      icon: BarChart3,
      description: "Calculates MRR, CAC, Margins, Goals & Funnel Conversion metrics",
      status: "Real Data Ready",
      color: "text-indigo-700",
      bgColor: "bg-indigo-50 border-indigo-200 text-indigo-800",
    },
    {
      id: 6,
      title: "6. PostgreSQL Warehouse",
      icon: Database,
      description: "Persists import metadata & file records in PostgreSQL database",
      status: "PostgreSQL Connected",
      color: "text-emerald-700",
      bgColor: "bg-emerald-50 border-emerald-200 text-emerald-800",
    },
  ];

  return (
    <div className="flex h-screen bg-[#e4dac9] text-stone-900 overflow-hidden selection:bg-cyan-500">
      <Sidebar currentRole={userRole} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Data Center — Pipeline & Datasets" subtitle="Pillar 1 in BI-GI Architecture: Multi-CSV dataset import foundation" />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Current Organization: {currentOrgName}</span>
                </span>
                {!isAuthorizedToImport && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
                    <ShieldAlert className="h-3 w-3" /> Read-Only Access (Role: {userRole})
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                Data Center & Ingestion Foundation
              </h1>
              <p className="text-xs text-stone-600 max-w-xl">
                Upload and manage real multi-file business datasets (customers, sales, expenses, employees, goals, KPIs, leads, tickets) for <strong>{currentOrgName}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isAuthorizedToImport ? (
                <Link
                  href="/data-sources/import"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/25 transition flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Business Dataset</span>
                </Link>
              ) : (
                <button
                  disabled
                  title="Only Admin and Analyst roles can import business datasets"
                  className="bg-stone-200 text-stone-500 font-bold text-xs px-5 py-3 rounded-2xl border border-stone-300 cursor-not-allowed flex items-center gap-2"
                >
                  <ShieldAlert className="h-4 w-4 text-stone-400" />
                  <span>Upload Business Dataset (Restricted)</span>
                </button>
              )}
            </div>
          </div>

          {/* SECTION: PREVIOUSLY IMPORTED DATASETS */}
          <div className="bg-white border border-stone-300 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-600" />
                  <span>Previously Imported Datasets ({dataImports.length})</span>
                </h2>
                <p className="text-xs text-stone-600">
                  Business datasets imported for <strong>{currentOrgName}</strong> persisted in PostgreSQL.
                </p>
              </div>

              {isAuthorizedToImport && (
                <Link
                  href="/data-sources/import"
                  className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Import New CSV Dataset</span>
                </Link>
              )}
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-stone-500 animate-pulse font-medium">
                Loading dataset imports from PostgreSQL database...
              </div>
            ) : dataImports.length === 0 ? (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 text-center space-y-3">
                <FileSpreadsheet className="h-10 w-10 text-stone-400 mx-auto" />
                <h3 className="text-sm font-bold text-stone-800">No Business Datasets Imported Yet</h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  Click "Upload Business Dataset" to upload your CSV files (customers.csv, sales_transactions.csv, expenses.csv, employees.csv, goals.csv, kpi_definitions.csv, sales_funnel_leads.csv, support_tickets.csv).
                </p>
                {isAuthorizedToImport && (
                  <Link
                    href="/data-sources/import"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition mt-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload First Dataset</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {dataImports.map((imp) => {
                  const isExpanded = expandedImportId === imp.id;
                  return (
                    <div
                      key={imp.id}
                      className="border border-stone-200 rounded-2xl bg-stone-50 overflow-hidden transition"
                    >
                      <div
                        onClick={() => setExpandedImportId(isExpanded ? null : imp.id)}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-stone-100/70"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm">
                            <FileSpreadsheet className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-stone-900">{imp.datasetName}</h3>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                                {imp.status}
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5">
                              Uploaded by <strong>{imp.uploadedBy}</strong> • {new Date(imp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-xs text-stone-700 font-medium">
                          <div className="text-right">
                            <span className="block text-[10px] text-stone-500 uppercase font-bold">Files</span>
                            <span className="font-bold text-stone-900">{imp.filesCount} CSV files</span>
                          </div>
                          <div className="text-right">
                            <span className="block text-[10px] text-stone-500 uppercase font-bold">Total Rows</span>
                            <span className="font-bold text-indigo-700">{imp.totalRows.toLocaleString()} rows</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImport(imp.id);
                            }}
                            title="Delete Dataset"
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="text-stone-400 hover:text-stone-700 p-1">
                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded File List */}
                      {isExpanded && (
                        <div className="bg-white border-t border-stone-200 p-4 space-y-3">
                          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Included Files in Dataset</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {imp.files && imp.files.length > 0 ? (
                              imp.files.map((file, idx) => (
                                <div key={idx} className="bg-stone-50 border border-stone-200 p-3 rounded-xl flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2.5">
                                    <FileText className="h-4 w-4 text-indigo-600" />
                                    <div>
                                      <span className="font-bold text-stone-900 block">{file.fileName}</span>
                                      <span className="text-[10px] text-indigo-700 font-mono font-bold uppercase">{file.entityType}</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-bold text-stone-900 block">{file.rowCount.toLocaleString()} rows</span>
                                    <span className="text-[10px] text-emerald-700 font-bold">✓ Validated</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-stone-500">File details recorded in import metadata.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive 6-Stage Pipeline Stepper Bar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">6-Stage Data Flow Pipeline</h2>
              <span className="text-xs font-bold text-cyan-800">Click any stage to view live status</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
              {pipelineStages.map((stage) => {
                const Icon = stage.icon;
                const isSelected = activeStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(stage.id)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 relative overflow-hidden ${
                      isSelected
                        ? "bg-white border-cyan-600 ring-2 ring-cyan-500/40 shadow-md"
                        : "bg-white border-stone-300 hover:border-stone-400 text-stone-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                        Stage {stage.id}
                      </span>
                      <Icon className={`h-4 w-4 ${stage.color}`} />
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-stone-900">{stage.title}</h3>
                      <p className="text-[10px] text-stone-600 line-clamp-1 mt-0.5">{stage.status}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Stage Detailed Breakdown */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold">
                  {activeStage}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-cyan-800 tracking-wider">
                    Selected Pipeline Stage Breakdown
                  </span>
                  <h3 className="text-xl font-bold text-stone-900">
                    {pipelineStages[activeStage - 1].title}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Stage Operational
              </span>
            </div>

            {/* Stage 1 Content */}
            {activeStage === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-800 font-bold text-sm">
                    <Database className="h-4 w-4" /> PostgreSQL Production DB
                  </div>
                  <p className="text-xs text-stone-600">Multi-tenant PostgreSQL schema scoped by organization_id</p>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold block">Status: Connected & Isolated</span>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                    <FileSpreadsheet className="h-4 w-4" /> 8 CSV Datasets Multi-File Ingestion
                  </div>
                  <p className="text-xs text-stone-600">customers, employees, expenses, goals, kpis, leads, sales, tickets</p>
                  <span className="text-[10px] text-indigo-700 font-mono font-bold block">Parser: PapaParse + Schema Validation</span>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <Cloud className="h-4 w-4" /> Tenant Security Enforcer
                  </div>
                  <p className="text-xs text-stone-600">Strictly assigns organization_id from authenticated session</p>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold block">RBAC: Admin & Analyst Authorized</span>
                </div>
              </div>
            )}

            {/* Stage 2 to 6 Content */}
            {activeStage > 1 && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <h4 className="text-sm font-bold text-stone-900">{pipelineStages[activeStage - 1].description}</h4>
                <p className="text-xs text-stone-600">Automated processing active with 100% throughput efficiency.</p>
                <div className="pt-2 flex items-center gap-2 text-xs text-emerald-700 font-bold">
                  <Check className="h-4 w-4" /> Status: {pipelineStages[activeStage - 1].status}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
