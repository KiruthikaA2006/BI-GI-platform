"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { FileText, Plus, Download, Calendar, Clock, Share2, FileCheck, X } from "lucide-react";
import { mockReports } from "@/lib/mock-data";
import { exportToCSV, exportToPDF } from "@/lib/export-utils";

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportFormat, setReportFormat] = useState("PDF");

  const downloadReport = (name: string, format: string) => {
    if (format === "CSV") {
      exportToCSV(name.toLowerCase().replace(/\s+/g, "_"), reports);
    } else {
      exportToPDF(name);
    }
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;

    const newReport = {
      id: `rep_${Date.now()}`,
      name: reportTitle,
      description: "Custom operational report export",
      format: reportFormat,
      frequency: "WEEKLY",
      owner: "Kiruthika Anand",
      updatedAt: "Just now",
    };

    setReports([newReport, ...reports]);
    setReportTitle("");
    setShowBuilderModal(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Reports Center" subtitle="Generate, schedule, export and share operational & executive reports" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-300 p-6 rounded-3xl shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-indigo-700">Organization Scope • Reports</span>
              <h2 className="text-xl font-black text-stone-900">Scheduled & Exportable Reports</h2>
              <p className="text-xs text-stone-500">PDF, Excel & CSV report generation for board reviews & department leads</p>
            </div>
            <button
              onClick={() => setShowBuilderModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Report</span>
            </button>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white border border-stone-300 p-6 rounded-3xl shadow-sm space-y-4 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 uppercase border border-stone-200">
                      {report.format}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900">{report.name}</h3>
                  <div className="space-y-1 mt-2 text-xs text-stone-500">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-stone-400" /> Frequency: {report.frequency}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-stone-400" /> Generated: {report.updatedAt}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <button
                    onClick={() => downloadReport(report.name, report.format)}
                    className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download {report.format}</span>
                  </button>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    SOC2 Verified
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Create Report Modal */}
          {showBuilderModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white border border-stone-300 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="text-base font-black text-stone-900">Create Scheduled Report</h3>
                  <button onClick={() => setShowBuilderModal(false)} className="text-stone-400 hover:text-stone-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Report Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Q3 Operational Financial Rollup"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Export Format</label>
                    <select
                      value={reportFormat}
                      onChange={(e) => setReportFormat(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-medium"
                    >
                      <option value="PDF">PDF Presentation Deck</option>
                      <option value="CSV">CSV Raw Data Export</option>
                      <option value="EXCEL">XLSX Spreadsheet</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBuilderModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow"
                    >
                      Generate Report
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
