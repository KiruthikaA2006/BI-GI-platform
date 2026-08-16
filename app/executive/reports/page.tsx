"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { FileText, Download } from "lucide-react";
import { exportToPDF } from "@/lib/export-utils";
import { getActiveOrganization } from "@/lib/org-context";

export default function ExecutiveReportsPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-indigo-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive Reports" subtitle="High-Level Executive Summaries & Export Presentation Deck" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-700">Executive Flow Node: REPORTS</span>
              <h2 className="text-2xl font-black text-stone-900">Executive Summaries • {currentOrgName}</h2>
              <p className="text-xs text-stone-600">Export presentation-ready English narrative reports for Board of Directors and Shareholders of <strong>{currentOrgName}</strong>.</p>
            </div>

            <button
              onClick={() => exportToPDF(`Quarterly Executive & Board Report — ${currentOrgName}`, currentOrgName)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition flex items-center gap-2"
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

