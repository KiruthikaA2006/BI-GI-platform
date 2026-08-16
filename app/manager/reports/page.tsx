"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { FileText, Download } from "lucide-react";
import { exportToPDF } from "@/lib/export-utils";
import { getActiveOrganization } from "@/lib/org-context";

export default function ManagerReportsPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-blue-500">
      <Sidebar currentRole="DEPARTMENT_MANAGER" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Operational Performance Reports" subtitle="Manager Scope: Department Operational Performance Reports" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          <div className="bg-white border border-stone-300 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-blue-700">Manager Scope: Operational Reports</span>
              <h1 className="text-2xl font-black text-stone-900">Sales & Marketing Performance Reports • {currentOrgName}</h1>
              <p className="text-xs text-stone-600">Weekly and monthly operational audit rollups for management review of <strong>{currentOrgName}</strong>.</p>
            </div>

            <button
              onClick={() => exportToPDF(`Sales & Marketing Operational Performance Report — ${currentOrgName}`, currentOrgName)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF Operational Report</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

