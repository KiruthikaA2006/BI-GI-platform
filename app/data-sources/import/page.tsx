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
  Layers,
  Database,
  Filter,
  Loader2,
} from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export default function ImportWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState<"upload" | "validation" | "mapping" | "preview" | "success">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [rawData, setRawData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [datasetName, setDatasetName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileSizeMB, setFileSizeMB] = useState(0);

  // Validation Metrics
  const [validationMetrics, setValidationMetrics] = useState({
    totalRows: 0,
    missingValuesCount: 0,
    duplicateRowsCount: 0,
    invalidDatesCount: 0,
    invalidNumbersCount: 0,
    columnTypes: {} as Record<string, string>,
  });

  // Field Mapping State
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({
    date: "",
    revenue: "",
    expense: "",
    region: "",
    department: "",
    product: "",
    customer: "",
    salesperson: "",
  });

  // Global event capturer to prevent browser from downloading/opening dropped files anywhere
  useEffect(() => {
    const handleGlobalDrag = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFile = e.dataTransfer.files[0];
        processFile(droppedFile);
      }
    };

    window.addEventListener("dragover", handleGlobalDrag, true);
    window.addEventListener("dragenter", handleGlobalDrag, true);
    window.addEventListener("drop", handleGlobalDrop, true);

    return () => {
      window.removeEventListener("dragover", handleGlobalDrag, true);
      window.removeEventListener("dragenter", handleGlobalDrag, true);
      window.removeEventListener("drop", handleGlobalDrop, true);
    };
  }, []);

  const analyzeRowsAndSetState = (rows: any[], detectedCols: string[], fileName: string) => {
    let missing = 0;
    let dupes = 0;
    let invalidDates = 0;
    let invalidNums = 0;
    const colTypes: Record<string, string> = {};
    const seenRows = new Set<string>();

    detectedCols.forEach((col: string) => {
      const sampleVal = rows.find((r: any) => r[col] !== undefined && r[col] !== null && r[col] !== "")?.[col];
      if (sampleVal !== undefined) {
        if (!isNaN(Number(sampleVal))) {
          colTypes[col] = "number";
        } else if (!isNaN(Date.parse(sampleVal))) {
          colTypes[col] = "date";
        } else {
          colTypes[col] = "string";
        }
      } else {
        colTypes[col] = "string";
      }
    });

    // Process sample for missing and duplicate detection efficiently
    const sampleRows = rows.slice(0, 10000);
    sampleRows.forEach((r: any) => {
      const strRepresentation = JSON.stringify(r);
      if (seenRows.has(strRepresentation)) {
        dupes++;
      } else {
        seenRows.add(strRepresentation);
      }

      detectedCols.forEach((col: string) => {
        const val = r[col];
        if (val === undefined || val === null || val === "") {
          missing++;
        }
      });
    });

    setRawData(rows);
    setColumns(detectedCols);
    setValidationMetrics({
      totalRows: rows.length,
      missingValuesCount: missing,
      duplicateRowsCount: dupes,
      invalidDatesCount: invalidDates,
      invalidNumbersCount: invalidNums,
      columnTypes: colTypes,
    });

    // Auto-guess field mappings
    const autoMap: Record<string, string> = { ...fieldMappings };
    detectedCols.forEach((col: string) => {
      const lower = col.toLowerCase();
      if (lower.includes("date") || lower.includes("invoicedate") || lower.includes("time")) autoMap.date = col;
      if (lower.includes("price") || lower.includes("amount") || lower.includes("rev") || lower.includes("sales"))
        autoMap.revenue = col;
      if (lower.includes("exp") || lower.includes("cost")) autoMap.expense = col;
      if (lower.includes("country") || lower.includes("reg") || lower.includes("city")) autoMap.region = col;
      if (lower.includes("dept") || lower.includes("cat") || lower.includes("stockcode")) autoMap.department = col;
      if (lower.includes("description") || lower.includes("prod") || lower.includes("item")) autoMap.product = col;
      if (lower.includes("customer") || lower.includes("customer id") || lower.includes("client"))
        autoMap.customer = col;
    });
    setFieldMappings(autoMap);

    setIsParsing(false);
    setStep("validation");
  };

  const processFile = async (uploadedFile: File) => {
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setDatasetName(uploadedFile.name);
    setFileSizeMB(Number((uploadedFile.size / (1024 * 1024)).toFixed(1)));
    setIsParsing(true);

    const isExcel = uploadedFile.name.endsWith(".xlsx") || uploadedFile.name.endsWith(".xls");

    if (isExcel) {
      try {
        const buffer = await uploadedFile.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        const detectedCols = rows[0] ? Object.keys(rows[0]) : [];

        analyzeRowsAndSetState(rows, detectedCols, uploadedFile.name);
      } catch (err) {
        console.error(err);
        setIsParsing(false);
        alert("Failed to parse Excel file. Please ensure it is a valid .xlsx file.");
      }
    } else {
      // CSV Parsing with PapaParse
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          const rows = results.data || [];
          const detectedCols = results.meta?.fields || (rows[0] ? Object.keys(rows[0]) : []);
          analyzeRowsAndSetState(rows, detectedCols, uploadedFile.name);
        },
        error: (err: any) => {
          console.error(err);
          setIsParsing(false);
          alert("Error parsing CSV file.");
        },
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      processFile(uploadedFile);
    }
  };

  const executeImportToPostgreSQL = async () => {
    setIsProcessing(true);

    try {
      // Map row keys based on selected field mappings & calculate calculated fields
      const mappedRows = rawData.map((row) => {
        const mappedRow: any = { ...row };
        if (fieldMappings.date && row[fieldMappings.date]) mappedRow.date = row[fieldMappings.date];

        // If revenue column is Price and Quantity is available, compute revenue = Price * Quantity
        const revColVal = Number(row[fieldMappings.revenue]) || 0;
        const qtyVal = Number(row["Quantity"] || row["quantity"]) || 1;
        mappedRow.revenue = revColVal * (qtyVal > 0 ? qtyVal : 1);

        if (fieldMappings.expense && row[fieldMappings.expense]) mappedRow.expense = Number(row[fieldMappings.expense]) || 0;
        if (fieldMappings.region && row[fieldMappings.region]) mappedRow.region = row[fieldMappings.region];
        if (fieldMappings.department && row[fieldMappings.department]) mappedRow.department = row[fieldMappings.department];
        if (fieldMappings.product && row[fieldMappings.product]) mappedRow.product = row[fieldMappings.product];
        if (fieldMappings.customer && row[fieldMappings.customer]) mappedRow.customer = row[fieldMappings.customer];
        return mappedRow;
      });

      const res = await fetch("/api/datasets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: datasetName,
          description: `User-imported business dataset saved to PostgreSQL (${rawData.length} records)`,
          rowCount: rawData.length,
          columns,
          data: mappedRows,
          dataSourceName: file?.name || "CSV/XLSX Upload",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStep("success");
      } else {
        alert("Failed to save dataset to PostgreSQL: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Import error while connecting to PostgreSQL.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Data Import Pipeline" subtitle="Upload or Drag & Drop CSV or XLSX files into PostgreSQL dataset database" />

        <main className="p-6 space-y-6 max-w-4xl mx-auto w-full relative">
          {/* Stepper Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            {[
              { id: "upload", label: "1. Upload File" },
              { id: "validation", label: "2. Validation" },
              { id: "mapping", label: "3. Field Mapping" },
              { id: "preview", label: "4. Preview & Import" },
              { id: "success", label: "5. Status" },
            ].map((s, idx) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === s.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {idx + 1}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${step === s.id ? "text-white" : "text-slate-400"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* PARSING LOADING OVERLAY */}
          {isParsing && (
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center space-y-4 shadow-2xl">
              <Loader2 className="h-10 w-10 text-indigo-400 animate-spin mx-auto" />
              <h3 className="text-xl font-bold text-white">Reading & Analyzing File...</h3>
              <p className="text-xs text-slate-400">
                File: <strong className="text-white">{file?.name}</strong> ({fileSizeMB} MB)
              </p>
              <p className="text-[11px] text-indigo-300 animate-pulse">
                Parsing rows, inspecting columns, checking duplicate records & data types...
              </p>
            </div>
          )}

          {/* STEP 1: UPLOAD & DRAG & DROP ZONE */}
          {!isParsing && step === "upload" && (
            <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl text-center space-y-6">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <UploadCloud className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Upload or Drag & Drop CSV / XLSX Business Dataset</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload transaction logs, sales pipelines, customer records, or financial spreadsheets
                </p>
              </div>

              {/* Interactive Drag & Drop Box */}
              <div className="max-w-md mx-auto">
                <div
                  className={`border-2 border-dashed p-10 rounded-2xl cursor-pointer block transition relative ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-950/40 ring-4 ring-indigo-500/20 scale-[1.02]"
                      : "border-slate-700 hover:border-indigo-500 bg-slate-950"
                  }`}
                >
                  <label className="cursor-pointer block w-full h-full">
                    <FileSpreadsheet
                      className={`h-12 w-12 mx-auto mb-3 transition ${
                        isDragging ? "text-indigo-400 animate-bounce" : "text-slate-500"
                      }`}
                    />
                    <span className="text-sm font-bold text-indigo-400 block mb-1">
                      {isDragging ? "Drop file here to import" : "Drag & Drop CSV / XLSX file here"}
                    </span>
                    <span className="text-xs text-slate-400 block mb-2">or click to browse from device</span>
                    <span className="text-[10px] text-slate-500 block">Supports .csv, .xlsx, .xls formats (any file size)</span>
                    <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: VALIDATION INSPECTOR */}
          {!isParsing && step === "validation" && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Data Validation & Schema Inspection</h3>
                  <p className="text-xs text-slate-400">
                    File: <strong className="text-white">{file?.name}</strong> ({validationMetrics.totalRows.toLocaleString()} rows, {columns.length} columns detected)
                  </p>
                </div>
                <button
                  onClick={() => setStep("mapping")}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-600/30"
                >
                  <span>Proceed to Field Mapping</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Rows</span>
                  <span className="text-xl font-bold text-white mt-1 block">{validationMetrics.totalRows.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Columns</span>
                  <span className="text-xl font-bold text-indigo-400 mt-1 block">{columns.length}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Missing Values</span>
                  <span className="text-xl font-bold text-amber-400 mt-1 block">{validationMetrics.missingValuesCount.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Duplicates</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block">{validationMetrics.duplicateRowsCount.toLocaleString()}</span>
                </div>
              </div>

              {/* Column Types Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Detected Column Types</h4>
                <div className="flex flex-wrap gap-2">
                  {columns.map((col) => (
                    <div key={col} className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
                      <span className="font-semibold text-white">{col}</span>
                      <span className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded font-mono uppercase">
                        {validationMetrics.columnTypes[col] || "string"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FIELD MAPPING */}
          {!isParsing && step === "mapping" && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Field Mapping</h3>
                  <p className="text-xs text-slate-400">Map uploaded file headers to platform business metrics</p>
                </div>
                <button
                  onClick={() => setStep("preview")}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-600/30"
                >
                  <span>Preview & Confirm Import</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { field: "revenue", label: "Sales / Price / Amount Column", required: true },
                  { field: "date", label: "Invoice Date / Timestamp Column", required: true },
                  { field: "expense", label: "Expense / Cost Column", required: false },
                  { field: "region", label: "Country / Region Column", required: false },
                  { field: "department", label: "Category / StockCode Column", required: false },
                  { field: "product", label: "Description / Product Column", required: false },
                  { field: "customer", label: "Customer ID Column", required: false },
                ].map((item) => (
                  <div key={item.field} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.required && <span className="text-amber-400 text-[10px] uppercase font-bold">Required</span>}
                    </label>
                    <select
                      value={fieldMappings[item.field] || ""}
                      onChange={(e) => setFieldMappings({ ...fieldMappings, [item.field]: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">-- Select Uploaded Column --</option>
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {col} ({validationMetrics.columnTypes[col] || "string"})
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: PREVIEW & IMPORT TO POSTGRESQL */}
          {!isParsing && step === "preview" && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Preview & Commit to PostgreSQL</h3>
                  <p className="text-xs text-slate-400">Ready to store {rawData.length.toLocaleString()} rows in PostgreSQL database</p>
                </div>
                <button
                  onClick={executeImportToPostgreSQL}
                  disabled={isProcessing}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30 transition"
                >
                  <span>{isProcessing ? "Saving to PostgreSQL..." : "Save Dataset to PostgreSQL"}</span>
                  <Check className="h-4 w-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      {columns.map((col) => (
                        <th key={col} className="p-3 border-b border-slate-800">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {rawData.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        {columns.map((col) => (
                          <td key={col} className="p-3 text-slate-300">{String(row[col] ?? "")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS */}
          {!isParsing && step === "success" && (
            <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl text-center space-y-6">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">Import Complete! Saved to PostgreSQL</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {rawData.length.toLocaleString()} records stored in PostgreSQL database. Your dashboard metrics have been recalculated live.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
                >
                  Go to Live Dashboard
                </button>
                <button
                  onClick={() => router.push("/datasets")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-2.5 rounded-xl text-xs font-semibold transition"
                >
                  View PostgreSQL Datasets
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
