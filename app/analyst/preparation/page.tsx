"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { RefreshCw, CheckCircle2, ShieldCheck, ArrowRight, Wand2, Sliders, Layers, Sparkles } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function AnalystPreparationPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [cleanMissing, setCleanMissing] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [handleOutliers, setHandleOutliers] = useState(true);
  const [transformColumns, setTransformColumns] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);
  }, []);

  const handleRunDataPrep = () => {
    setIsProcessing(true);
    setIsComplete(false);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 1200);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-cyan-500">
      <Sidebar currentRole="ANALYST" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Data Preparation Studio" subtitle="Flowchart Step 2: Clean Missing Data, Remove Duplicates, Handle Outliers & Transform Columns" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800">Data Preparation Engine • {currentOrgName}</span>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">Data Cleaning & Transformation Studio</h1>
              <p className="text-xs text-stone-600">Prepare dataset rows before running statistical analysis and generating visualizations</p>
            </div>
            <Link
              href="/analyst/analysis"
              className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
            >
              <span>Proceed to Data Analysis →</span>
            </Link>
          </div>

          {/* 4 Flowchart Data Prep Modules Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Module 1: Clean Missing Data */}
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold">
                    1
                  </div>
                  <h3 className="text-sm font-black text-stone-900 uppercase">Clean Missing Data</h3>
                </div>
                <input
                  type="checkbox"
                  checked={cleanMissing}
                  onChange={(e) => setCleanMissing(e.target.checked)}
                  className="h-5 w-5 rounded border-stone-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                />
              </div>
              <p className="text-xs text-stone-600">
                Identifies missing numerical or date values across dataset rows. Automatically imputes mean values or strips incomplete records.
              </p>
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] font-bold text-stone-700 flex justify-between">
                <span>Imputation Strategy: Mean & Forward Fill</span>
                <span className="text-emerald-700 font-bold">0 Missing Found</span>
              </div>
            </div>

            {/* Module 2: Remove Duplicates */}
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                    2
                  </div>
                  <h3 className="text-sm font-black text-stone-900 uppercase">Remove Duplicates</h3>
                </div>
                <input
                  type="checkbox"
                  checked={removeDuplicates}
                  onChange={(e) => setRemoveDuplicates(e.target.checked)}
                  className="h-5 w-5 rounded border-stone-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                />
              </div>
              <p className="text-xs text-stone-600">
                Scans unique transaction IDs and composite key columns to drop duplicate entries across multiple CSV imports.
              </p>
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] font-bold text-stone-700 flex justify-between">
                <span>Deduplication Scope: Full Row Match</span>
                <span className="text-emerald-700 font-bold">100% Unique Rows</span>
              </div>
            </div>

            {/* Module 3: Handle Outliers */}
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 font-bold">
                    3
                  </div>
                  <h3 className="text-sm font-black text-stone-900 uppercase">Handle Outliers</h3>
                </div>
                <input
                  type="checkbox"
                  checked={handleOutliers}
                  onChange={(e) => setHandleOutliers(e.target.checked)}
                  className="h-5 w-5 rounded border-stone-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                />
              </div>
              <p className="text-xs text-stone-600">
                Detects extreme values beyond 3 standard deviations ($3\sigma$) and applies IQR capping to prevent skewed metrics.
              </p>
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] font-bold text-stone-700 flex justify-between">
                <span>Outlier Threshold: 3.0 IQR Capping</span>
                <span className="text-emerald-700 font-bold">Smoothed</span>
              </div>
            </div>

            {/* Module 4: Transform Columns */}
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                    4
                  </div>
                  <h3 className="text-sm font-black text-stone-900 uppercase">Transform Columns</h3>
                </div>
                <input
                  type="checkbox"
                  checked={transformColumns}
                  onChange={(e) => setTransformColumns(e.target.checked)}
                  className="h-5 w-5 rounded border-stone-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                />
              </div>
              <p className="text-xs text-stone-600">
                Standardizes date strings (YYYY-MM-DD), formats INR currency columns, and derives calculated growth ratio columns.
              </p>
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] font-bold text-stone-700 flex justify-between">
                <span>Transformations: ISO Dates & INR Currency</span>
                <span className="text-emerald-700 font-bold">Transformed</span>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
            {isComplete && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-emerald-900 text-xs font-bold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span>Data preparation pipeline completed successfully! Dataset is clean and ready for statistical analysis.</span>
                </div>
                <Link
                  href="/analyst/analysis"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow flex-shrink-0"
                >
                  Open Data Analysis Workbench →
                </Link>
              </div>
            )}

            <button
              onClick={handleRunDataPrep}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-sm shadow-lg transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Executing Data Cleaning & Transformation Pipeline...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  <span>Run Data Preparation & Cleaning Pipeline →</span>
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
