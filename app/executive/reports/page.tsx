"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { FileText, Download } from "lucide-react";
import { exportToPDF } from "@/lib/export-utils";

export default function ExecutiveReportsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-indigo-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive Reports" subtitle="High-Level Executive Summaries & Export Presentation Deck" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-700">Executive Flow Node: REPORTS</span>
              <h2 className="text-xl font-black text-stone-900">Monthly & Quarterly Executive Summaries</h2>
              <p className="text-xs text-stone-600">Export presentation-ready narrative text reports for Board of Directors and Shareholders.</p>
            </div>

            <button
              onClick={() => exportToPDF("Quarterly Executive & Board Report")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF Executive Report</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
