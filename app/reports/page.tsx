"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { FileText, Plus, Download, Calendar, Clock, Share2, FileCheck } from "lucide-react";
import { mockReports } from "@/lib/mock-data";

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports);

  const downloadReport = (name: string, format: string) => {
    alert(`Downloading "${name}" in ${format} format...`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Reports Center" subtitle="Generate, schedule, export and share operational & executive reports" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Scheduled & Exportable Reports</h2>
              <p className="text-xs text-slate-400">PDF, Excel & CSV report generation for board reviews & department leads</p>
            </div>
            <button
              onClick={() => alert("Opening Report Builder Wizard...")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
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
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl space-y-4 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="bg-slate-800 text-indigo-300 text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg">
                      {report.format}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{report.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{report.description}</p>

                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-1 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Frequency:</span>
                      <strong className="text-slate-200">{report.frequency}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Owner:</span>
                      <strong className="text-slate-200">{report.owner}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => downloadReport(report.name, report.format)}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export {report.format}</span>
                  </button>
                  <span className="text-[10px] text-slate-500">Updated: {report.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
