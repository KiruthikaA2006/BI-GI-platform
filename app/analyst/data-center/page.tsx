"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Database } from "lucide-react";

export default function AnalystDataCenterPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-cyan-500">
      <Sidebar currentRole="ANALYST" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Analyst Data Center Pipeline" subtitle="Analyst Scope: 6-Stage Pipeline Monitoring" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-cyan-600">Analyst Scope: Data Center</span>
            <h1 className="text-2xl font-black text-stone-900">Data Processing Pipeline Status</h1>
          </div>
        </main>
      </div>
    </div>
  );
}
