"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  Table,
  Sparkles,
  Database,
  Loader2,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
} from "lucide-react";
import { validateCSVContent, FileValidationResult, detectEntityType } from "@/lib/csv-validator";
import { clearStatsCache } from "@/lib/stats-cache";
import { getActiveOrganization } from "@/lib/org-context";

export default function MultiCSVImportPage() {
  const router = useRouter();
  const [step, setStep] = useState<"upload" | "preview" | "success">("upload");
  const [datasetName, setDatasetName] = useState("Retail Business 2026");
  const [validatedFiles, setValidatedFiles] = useState<FileValidationResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFilePreviewIdx, setSelectedFilePreviewIdx] = useState<number>(0);
  const [userRole, setUserRole] = useState<string>("ORGANIZATION_ADMIN");
  const [currentOrg, setCurrentOrg] = useState<{ id: string; name: string }>({
    id: "acme-retail",
    name: "Acme Global Retail",
  });
  const [currentOrgName, setCurrentOrgName] = useState<string>("Acme Global Retail");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const active = getActiveOrganization();
    if (active && active.name) {
      setCurrentOrg({ id: active.id, name: active.name });
      setCurrentOrgName(active.name);
    }
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          if (data.user.role) setUserRole(data.user.role.toUpperCase());
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, []);

  const normRole = (userRole || "ORGANIZATION_ADMIN").toUpperCase().replace(/\s+/g, "_");
  const isAuthorized = ["SUPER_ADMIN", "ORGANIZATION_ADMIN", "ADMIN", "OWNER", "ANALYST", "EXECUTIVE", "DEPARTMENT_MANAGER"].includes(normRole);

  const processUploadedFiles = async (filesList: FileList | File[]) => {
    if (!filesList || filesList.length === 0) return;
    setIsParsing(true);

    const results: FileValidationResult[] = [];
    const filesArray = Array.from(filesList);

    for (const file of filesArray) {
      if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
        try {
          const text = await file.text();
          const validation = await validateCSVContent(file.name, text);
          results.push(validation);
        } catch (err) {
          console.error(`Error reading ${file.name}:`, err);
        }
      }
    }

    if (results.length > 0) {
      setValidatedFiles(results);
      setStep("preview");
    } else {
      alert("No valid .csv files were found in the selected files.");
    }
    setIsParsing(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(e.target.files);
    }
  };

  const loadAllEightSampleCSVs = async () => {
    setIsParsing(true);

    const sampleFiles = [
      {
        name: "customers.csv",
        content: `customer_id,name,email,segment,country,created_at\nCUST_001,Acme Logistics,contact@acmelog.com,Enterprise,USA,2026-01-15\nCUST_002,Global Retail Inc,info@globalretail.com,Enterprise,UK,2026-02-10\nCUST_003,Apex Analytics,ops@apexanalytics.io,Mid-Market,Germany,2026-03-05\nCUST_004,Starlight Commerce,billing@starlight.com,SMB,Canada,2026-04-12\nCUST_005,Nexus Financial,support@nexusfin.com,Enterprise,USA,2026-05-20`,
      },
      {
        name: "employees.csv",
        content: `employee_id,name,email,role,department,salary\nEMP_101,Kiruthika Anand,kiruthika@qubertrix.com,ORGANIZATION_ADMIN,Executive,145000\nEMP_102,Sarah Jenkins,sjenkins@qubertrix.com,DEPARTMENT_MANAGER,Sales,95000\nEMP_103,David Miller,dmiller@qubertrix.com,ANALYST,Analytics,88000\nEMP_104,Alex Wong,awong@qubertrix.com,ANALYST,Engineering,92000`,
      },
      {
        name: "expenses.csv",
        content: `expense_id,category,amount,currency,department,date,description\nEXP_901,Cloud Hosting,12500.00,USD,Engineering,2026-07-01,AWS Infrastructure & Database Server Nodes\nEXP_902,Ad Campaigns,8400.00,USD,Marketing,2026-07-05,Google & LinkedIn Targeted Lead Gen\nEXP_903,SaaS Licenses,3200.00,USD,Operations,2026-07-10,Enterprise Security & Productivity Tools\nEXP_904,Payroll Direct,48000.00,USD,Finance,2026-07-15,Monthly Staff Compensation Rollup`,
      },
      {
        name: "goals.csv",
        content: `goal_id,name,metric,target_value,current_value,start_date,end_date,status\nGOL_01,Scale MRR to $150K,mrr,150000,145200,2026-01-01,2026-12-31,active\nGOL_02,Reduce CAC by 10%,cac,300,340,2026-01-01,2026-12-31,active\nGOL_03,Maintain Gross Margin > 75%,margin,75,78.4,2026-01-01,2026-12-31,active`,
      },
      {
        name: "kpi_definitions.csv",
        content: `kpi_id,name,category,target,unit,frequency\nKPI_01,Monthly Recurring Revenue,Financial,150000,USD,Monthly\nKPI_02,Customer Acquisition Cost,Marketing,300,USD,Monthly\nKPI_03,Gross Profit Margin,Operations,75,%,Monthly\nKPI_04,Net Retention Rate,Customer Success,110,%,Quarterly`,
      },
      {
        name: "sales_funnel_leads.csv",
        content: `lead_id,company_name,contact_email,lead_score,stage,estimated_deal_value,created_date\nLED_801,Vortex Energy,sales@vortex.com,85,Qualified Demo,45000,2026-07-02\nLED_802,Horizon Tech,leads@horizon.com,92,Proposal Sent,68000,2026-07-04\nLED_803,Pinnacle Commerce,buyer@pinnacle.com,78,Initial Meeting,22000,2026-07-08\nLED_804,Summit Logistics,contact@summit.com,96,Closing / Legal,110000,2026-07-12`,
      },
      {
        name: "sales_transactions.csv",
        content: `transaction_id,customer_id,invoice_date,amount,currency,product_name,quantity\nTRX_5001,CUST_001,2026-07-01,12500.00,USD,Enterprise Intelligence Annual Subscription,1\nTRX_5002,CUST_002,2026-07-03,4500.00,USD,AI Insights & Root Cause Analysis Module,1\nTRX_5003,CUST_003,2026-07-08,8900.00,USD,Data Center Ingestion Pipeline License,2\nTRX_5004,CUST_004,2026-07-14,3200.00,USD,Growth Strategy & Goal Tracking Suite,1`,
      },
      {
        name: "support_tickets.csv",
        content: `ticket_id,customer_id,subject,priority,status,created_at,resolved_at\nTCK_201,CUST_001,API Rate Limit Query,Low,Resolved,2026-07-02,2026-07-02\nTCK_202,CUST_002,SSO Integration Setup,Medium,Resolved,2026-07-05,2026-07-06\nTCK_203,CUST_003,Custom Dashboard Export Request,Low,In Progress,2026-07-10,`,
      },
    ];

    const results: FileValidationResult[] = [];
    for (const file of sampleFiles) {
      const validation = await validateCSVContent(file.name, file.content);
      results.push(validation);
    }

    setValidatedFiles(results);
    setStep("preview");
    setIsParsing(false);
  };

  const handleConfirmImport = async () => {
    if (!validatedFiles || validatedFiles.length === 0) return;
    setIsProcessing(true);

    try {
      const payload = {
        organizationId: currentOrg.id,
        organizationName: currentOrg.name,
        datasetName: datasetName || "Retail Business 2026",
        files: validatedFiles.map((f) => ({
          fileName: f.fileName,
          entityType: f.entityType,
          rowCount: f.rowCount,
          validRows: f.validRows,
          invalidRows: f.invalidRows,
          columns: f.columns,
          sampleData: f.sampleData,
          warnings: f.warnings,
          errors: f.errors,
        })),
      };

      const res = await fetch("/api/data-imports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 403) {
        alert(`Authorization Failed: ${data.error}`);
        setIsProcessing(false);
        return;
      }

      if (data.success) {
        clearStatsCache();
        if (data.organizationName) {
          setCurrentOrgName(data.organizationName);
        }
        setStep("success");
      } else {
        alert(`Import Error: ${data.error || "Failed to persist import dataset"}`);
      }
    } catch (err) {
      console.error("Import submit error:", err);
      alert("Error connecting to server while committing dataset import.");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalCombinedRows = validatedFiles.reduce((acc, f) => acc + f.rowCount, 0);

  if (!authChecked) {
    return <div className="p-8 text-center text-xs text-stone-500 font-medium">Checking authorization permissions...</div>;
  }

  // Block unauthorized Manager and Executive roles
  if (!isAuthorized) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900">
        <Sidebar currentRole={userRole} />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header title="Data Import — Access Denied" subtitle="Role-Based Security Policy" />
          <main className="p-8 max-w-xl mx-auto w-full">
            <div className="bg-white border border-stone-300 rounded-3xl p-8 text-center space-y-4 shadow-sm">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-black text-stone-900">Authorization Restricted</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Your role (<strong>{userRole}</strong>) is not permitted to perform dataset imports for <strong>{currentOrgName}</strong>.
              </p>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left text-xs space-y-1">
                <p className="font-bold text-stone-800">Role Import Permissions:</p>
                <p className="text-emerald-700 font-semibold">✓ Admin (SUPER_ADMIN, ORGANIZATION_ADMIN, OWNER) — Allowed</p>
                <p className="text-emerald-700 font-semibold">✓ Analyst (ANALYST) — Allowed</p>
                <p className="text-rose-700 font-semibold">✕ Manager (DEPARTMENT_MANAGER) — Restricted</p>
                <p className="text-rose-700 font-semibold">✕ Executive (EXECUTIVE) — Restricted</p>
              </div>
              <button
                onClick={() => router.push("/data-center")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition"
              >
                Return to Data Center
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-indigo-500">
      <Sidebar currentRole={userRole} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Upload Business Dataset" subtitle="Multi-file CSV dataset ingestion & PostgreSQL tenant persistence" />

        <main className="p-6 max-w-5xl mx-auto w-full space-y-6">
          {/* Stepper Header */}
          <div className="bg-white border border-stone-300 p-4 rounded-3xl flex items-center justify-between shadow-sm">
            {[
              { id: "upload", label: "1. Select Multiple CSV Files" },
              { id: "preview", label: "2. Validate & Preview" },
              { id: "success", label: "3. PostgreSQL Import Status" },
            ].map((s, idx) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === s.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-stone-100 text-stone-500 border border-stone-200"
                  }`}
                >
                  {idx + 1}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${step === s.id ? "text-stone-900" : "text-stone-500"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* PARSING LOADING */}
          {isParsing && (
            <div className="bg-white border border-stone-300 p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto" />
              <h3 className="text-xl font-bold text-stone-900">Parsing & Validating CSV Files...</h3>
              <p className="text-xs text-stone-600">Detecting headers, row counts, schema entities & data types</p>
            </div>
          )}

          {/* STEP 1: MULTI-FILE CSV UPLOAD DROPZONE */}
          {!isParsing && step === "upload" && (
            <div className="bg-white border border-stone-300 p-8 sm:p-10 rounded-3xl text-center space-y-6 shadow-sm">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
                <UploadCloud className="h-8 w-8" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-indigo-700 tracking-wider">Tenant Scope: {currentOrgName}</span>
                <h3 className="text-2xl font-black text-stone-900">Upload Multiple Business CSV Files</h3>
                <p className="text-xs text-stone-600 mt-1 max-w-lg mx-auto">
                  Upload all eight CSV files (customers.csv, employees.csv, expenses.csv, goals.csv, kpi_definitions.csv, sales_funnel_leads.csv, sales_transactions.csv, support_tickets.csv) as <strong>one business dataset</strong>.
                </p>
              </div>

              {/* Drag & Drop Box */}
              <div className="max-w-xl mx-auto">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed p-10 rounded-3xl cursor-pointer block transition relative ${
                    isDragging
                      ? "border-indigo-600 bg-indigo-50/60 ring-4 ring-indigo-500/20 scale-[1.02]"
                      : "border-stone-300 hover:border-indigo-500 bg-stone-50/80 hover:bg-indigo-50/30"
                  }`}
                >
                  <label className="cursor-pointer block w-full h-full">
                    <FileSpreadsheet className={`h-12 w-12 mx-auto mb-3 transition ${isDragging ? "text-indigo-600 animate-bounce" : "text-stone-400"}`} />
                    <span className="text-sm font-bold text-indigo-700 block mb-1">
                      {isDragging ? "Drop CSV files here to import" : "Select or Drag & Drop Multiple CSV Files"}
                    </span>
                    <span className="text-xs text-stone-600 block mb-3">Support multiple files in one batch upload</span>
                    <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 max-w-md mx-auto">
                      {["customers.csv", "employees.csv", "expenses.csv", "goals.csv", "kpi_definitions.csv", "sales_funnel_leads.csv", "sales_transactions.csv", "support_tickets.csv"].map((f) => (
                        <span key={f} className="text-[10px] bg-stone-200 text-stone-800 font-bold px-2 py-0.5 rounded border border-stone-300">
                          {f}
                        </span>
                      ))}
                    </div>
                    <input type="file" accept=".csv" multiple onChange={handleFileInputChange} className="hidden" />
                  </label>
                </div>

                <div className="pt-6 border-t border-stone-200 mt-6 flex flex-col items-center space-y-2">
                  <span className="text-xs text-stone-500 font-medium">Or test with local files pre-loaded:</span>
                  <button
                    type="button"
                    onClick={loadAllEightSampleCSVs}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-lg shadow-indigo-600/25 transition flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Load All 8 Business CSV Files (Acme Global Retail 2026)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PREVIEW & VALIDATION BREAKDOWN */}
          {!isParsing && step === "preview" && (
            <div className="space-y-6">
              {/* Dataset Info Header */}
              <div className="bg-white border border-stone-300 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-indigo-700">Dataset Identification</span>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-stone-700">Dataset Name:</label>
                      <input
                        type="text"
                        value={datasetName}
                        onChange={(e) => setDatasetName(e.target.value)}
                        placeholder="e.g. Retail Business 2026"
                        className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-bold focus:outline-none focus:border-indigo-500 w-64"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setStep("upload"); setValidatedFiles([]); }}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmImport}
                      disabled={isProcessing}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
                    >
                      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      <span>{isProcessing ? "Persisting to PostgreSQL..." : "Import Dataset"}</span>
                    </button>
                  </div>
                </div>

                {/* Summary Stat Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Current Tenant</span>
                    <span className="text-xs font-bold text-stone-900 mt-1 block truncate">{currentOrgName}</span>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
                    <span className="text-[10px] text-indigo-700 uppercase font-bold block">Total CSV Files</span>
                    <span className="text-lg font-bold text-indigo-800 mt-1 block">{validatedFiles.length} files</span>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">Combined Total Rows</span>
                    <span className="text-lg font-bold text-emerald-800 mt-1 block">{totalCombinedRows.toLocaleString()} rows</span>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
                    <span className="text-[10px] text-purple-700 uppercase font-bold block">Detected Entities</span>
                    <span className="text-xs font-bold text-purple-800 mt-1 block truncate">
                      {Array.from(new Set(validatedFiles.map((f) => f.entityType))).join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* File Breakdown List & Sample Data Selector */}
              <div className="bg-white border border-stone-300 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-indigo-600" />
                    <span>CSV Files Validation Breakdown ({validatedFiles.length})</span>
                  </h3>
                  <span className="text-xs text-stone-500 font-medium">Click a file tab to view row preview</span>
                </div>

                {/* File Selector Tabs */}
                <div className="flex flex-wrap gap-2">
                  {validatedFiles.map((file, idx) => (
                    <button
                      key={file.fileName}
                      onClick={() => setSelectedFilePreviewIdx(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                        selectedFilePreviewIdx === idx
                          ? "bg-indigo-600 text-white border-indigo-600 shadow"
                          : "bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100"
                      }`}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>{file.fileName}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${selectedFilePreviewIdx === idx ? "bg-indigo-700 text-indigo-100" : "bg-stone-200 text-stone-800"}`}>
                        {file.rowCount} rows
                      </span>
                    </button>
                  ))}
                </div>

                {/* Active Selected File Detail Box */}
                {validatedFiles[selectedFilePreviewIdx] && (
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900">{validatedFiles[selectedFilePreviewIdx].fileName}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono uppercase">
                            Entity: {validatedFiles[selectedFilePreviewIdx].entityType}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {validatedFiles[selectedFilePreviewIdx].rowCount.toLocaleString()} rows • {validatedFiles[selectedFilePreviewIdx].columns.length} columns detected
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {validatedFiles[selectedFilePreviewIdx].warnings.map((w, wIdx) => (
                          <span key={wIdx} className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Column Headers List */}
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold block mb-1.5">Detected Header Columns:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {validatedFiles[selectedFilePreviewIdx].columns.map((col) => (
                          <span key={col} className="bg-white border border-stone-300 text-stone-800 text-[11px] px-2.5 py-1 rounded-lg font-mono font-bold">
                            {col} <span className="text-[9px] text-indigo-600 font-normal">({validatedFiles[selectedFilePreviewIdx].columnTypes[col] || "string"})</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Data Preview Table (First 5-10 rows) */}
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold block mb-1.5">First 5 Rows Preview:</span>
                      <div className="overflow-x-auto rounded-xl border border-stone-300 bg-white">
                        <table className="w-full text-left text-xs text-stone-700">
                          <thead className="bg-stone-100 text-stone-600 uppercase text-[10px] font-bold">
                            <tr>
                              {validatedFiles[selectedFilePreviewIdx].columns.map((col) => (
                                <th key={col} className="p-2.5 border-b border-stone-200">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-200">
                            {validatedFiles[selectedFilePreviewIdx].sampleData.slice(0, 5).map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-stone-50">
                                {validatedFiles[selectedFilePreviewIdx].columns.map((col) => (
                                  <td key={col} className="p-2.5 text-stone-800 whitespace-nowrap">{String(row[col] ?? "")}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {!isParsing && step === "success" && (
            <div className="bg-white border border-stone-300 p-10 rounded-3xl text-center space-y-6 shadow-sm">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">PostgreSQL Persistence Verified</span>
                <h3 className="text-2xl font-black text-stone-900 mt-1">Business Dataset Imported Successfully!</h3>
                <p className="text-xs text-stone-600 mt-2 max-w-lg mx-auto">
                  Dataset <strong>"{datasetName}"</strong> ({validatedFiles.length} files, {totalCombinedRows.toLocaleString()} total rows) has been securely persisted in PostgreSQL under <strong>{currentOrgName}</strong>.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-1.5">
                <p className="font-bold text-stone-800">Import Record Metadata:</p>
                <p className="text-stone-600">Organization: <strong className="text-stone-900">{currentOrgName}</strong></p>
                <p className="text-stone-600">Import Status: <strong className="text-emerald-700 uppercase">Completed</strong></p>
                <p className="text-stone-600">Files Ingested: <strong className="text-stone-900">{validatedFiles.map(f => f.fileName).join(", ")}</strong></p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => {
                    const targetPath = userRole === "EXECUTIVE" ? "/executive/command-center" : userRole === "DEPARTMENT_MANAGER" ? "/manager/dashboard" : userRole === "ANALYST" ? "/analyst/dashboard" : "/dashboard";
                    window.location.href = targetPath;
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>View Updated Dashboard →</span>
                </button>
                <button
                  onClick={() => router.push("/data-center")}
                  className="bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow transition"
                >
                  Return to Data Center
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
