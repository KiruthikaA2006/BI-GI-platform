"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { User, ShieldCheck, Mail, Building2, Key, CheckCircle2 } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function AnalystProfilePage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [userEmail, setUserEmail] = useState("analyst@qubertrix.com");

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);

    const storedEmail = localStorage.getItem("user_email");
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-cyan-500">
      <Sidebar currentRole="ANALYST" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Analyst Profile & Scope" subtitle="Analyst Credentials & Role Permission Overview" />

        <main className="p-6 space-y-6 max-w-[1200px] mx-auto w-full">
          <div className="bg-white border border-stone-300 p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center gap-4 border-b border-stone-200 pb-6">
              <div className="h-16 w-16 rounded-2xl bg-cyan-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-cyan-600/30">
                DA
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-stone-900">Data Analyst</h1>
                  <span className="bg-cyan-50 text-cyan-800 text-xs px-3 py-1 rounded-full border border-cyan-200 font-bold uppercase">
                    ANALYST ROLE
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1">{userEmail} • Active Workspace: <strong>{currentOrgName}</strong></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold uppercase text-stone-700 tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-700" />
                  <span>Permission Scope & Capabilities</span>
                </h3>
                <ul className="space-y-2 text-xs text-stone-700 font-medium">
                  <li className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Import & Ingest Business CSV Datasets</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Data Preparation: Clean, Deduplicate & Transform</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Run Data Analysis & SQL Queries</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Build Visualizations & Executive Reports</span>
                  </li>
                </ul>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold uppercase text-stone-700 tracking-wider flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-cyan-700" />
                  <span>Active Workspace Context</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-stone-200 pb-2 font-medium">
                    <span className="text-stone-500">Organization Name:</span>
                    <span className="font-bold text-stone-900">{currentOrgName}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2 font-medium">
                    <span className="text-stone-500">PostgreSQL RLS Mode:</span>
                    <span className="font-bold text-emerald-700">Tenant Isolated</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1">
                    <span className="text-stone-500">Report Export Scope:</span>
                    <span className="font-bold text-indigo-700">PDF & Text Format</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
