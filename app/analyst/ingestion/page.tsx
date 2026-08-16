"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowRight,
  RefreshCw,
  FileText,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { validateCSVContent, FileValidationResult } from "@/lib/csv-validator";
import { getActiveOrganization } from "@/lib/org-context";

export default function AnalystIngestionPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [files, setFiles] = useState<File[]>([]);
  const [validations, setValidations] = useState<FileValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [datasetName, setDatasetName] = useState("Q3 Business Telemetry Dataset");

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);
  }, []);

  const handleFileDrop = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setIsValidating(true);
    setUploadError(null);
    setUploadSuccess(false);

    const results: FileValidationResult[] = [];
    for (const f of selectedFiles) {
      const text = await f.text();
      const res = await validateCSVContent(f.name, text);
      results.push(res);
    }

    setValidations(results);
    setIsValidating(false);
  };

  const handleImportToDatabase = async () => {
    if (validations.length === 0) return;
    setIsUploading(true);
    setUploadError(null);

    const org = getActiveOrganization();
    const payload = {
      datasetName: datasetName || "Analyst Ingested Dataset",
      organizationId: org?.id,
      organizationName: org?.name || currentOrgName,
      files: validations.map((v) => ({
        fileName: v.fileName,
        entityType: v.entityType,
        rowCount: v.rowCount,
        validRows: v.validRows,
        invalidRows: v.invalidRows,
        columns: v.columns,
        sampleData: v.sampleData,
        errors: v.errors,
      })),
    };

    try {
      const res = await fetch("/api/data-imports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setUploadSuccess(true);
      } else {
        setUploadError(data.error || "Failed to import dataset to database");
      }
    } catch (err: any) {
      setUploadError(err?.message || "Server connection error during dataset import");
    } finally {
      setIsUploading(false);
    }
  };

  const totalValidRows = validations.reduce((acc, v) => acc + v.validRows, 0);

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-cyan-500">
      <Sidebar currentRole="ANALYST" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Data Ingestion Studio" subtitle="Analyst Scope: Upload CSV/XLSX Files & Ingest to PostgreSQL" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800">Analyst Data Engine • {currentOrgName}</span>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">Upload CSV Data Files & Ingest</h1>
              <p className="text-xs text-stone-600">Select business CSV files (Sales, Expenses, Customers, Goals) for automated schema validation & PostgreSQL storage</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> RLS Isolated Tenant
              </span>
            </div>
          </div>

          {/* Upload Card Dropzone */}
          <div className="bg-white border border-stone-300 p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Dataset Name / Identifier</label>
                <input
                  type="text"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  placeholder="e.g. FY2026 Q3 Operational Financial Rollup"
                  className="w-full max-w-xl bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-bold text-stone-900 focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div className="border-2 border-dashed border-cyan-300 hover:border-cyan-500 bg-cyan-50/50 rounded-3xl p-10 text-center transition cursor-pointer relative group">
                <input
                  type="file"
                  multiple
                  accept=".csv,.xlsx"
                  onChange={handleFileDrop}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <div className="space-y-3 pointer-events-none">
                  <div className="h-14 w-14 rounded-2xl bg-cyan-100 border border-cyan-200 text-cyan-700 flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">Click or drag & drop CSV files here</h3>
                    <p className="text-xs text-stone-500 mt-1">Supports expenses.csv, sales_transactions.csv, customers.csv, goals.csv, etc.</p>
                  </div>
                </div>
              </div>
            </div>

            {isValidating && (
              <div className="flex items-center gap-3 p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold text-stone-700">
                <RefreshCw className="h-4 w-4 animate-spin text-cyan-600" />
                <span>Validating CSV fields and detecting entity schema...</span>
              </div>
            )}

            {/* Validation Results Table */}
            {validations.length > 0 && !isValidating && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Validated Files ({validations.length})</h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    {totalValidRows.toLocaleString()} Valid Rows Ready
                  </span>
                </div>

                <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] border-b border-stone-200">
                      <tr>
                        <th className="p-3">File Name</th>
                        <th className="p-3">Entity Type</th>
                        <th className="p-3">Rows Count</th>
                        <th className="p-3">Detected Columns</th>
                        <th className="p-3">Validation Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 bg-white font-medium">
                      {validations.map((v, idx) => (
                        <tr key={idx} className="hover:bg-stone-50 transition">
                          <td className="p-3 font-bold text-stone-900 flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-cyan-600" />
                            <span>{v.fileName}</span>
                          </td>
                          <td className="p-3">
                            <span className="bg-stone-100 text-stone-800 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-stone-200 uppercase">
                              {v.entityType}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-stone-800">{v.rowCount.toLocaleString()} rows</td>
                          <td className="p-3 text-stone-600 truncate max-w-[200px]">{v.columns.join(", ")}</td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3" /> Validated
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {uploadError && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {uploadSuccess ? (
                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span>Dataset successfully ingested and persisted into PostgreSQL!</span>
                    </div>
                    <p className="text-xs text-emerald-800">
                      All transactional records were saved under <strong>{currentOrgName}</strong>. You can now explore trends in Dashboards & Reports or run queries in Data Explorer.
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <Link
                        href="/dashboards"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
                      >
                        View Dashboards & Trends →
                      </Link>
                      <Link
                        href="/analyst/explorer"
                        className="bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
                      >
                        Open Data Explorer →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleImportToDatabase}
                    disabled={isUploading}
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-sm shadow-lg transition flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Persisting Dataset to PostgreSQL...</span>
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4" />
                        <span>Ingest & Persist Dataset to PostgreSQL Database →</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
