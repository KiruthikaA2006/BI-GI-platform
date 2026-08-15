"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Trophy, CheckCircle2 } from "lucide-react";

export default function ManagerGoalsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-amber-500">
      <Sidebar currentRole="DEPARTMENT_MANAGER" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Department Goals" subtitle="Manager Login Scope: Target Metrics & Milestones" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-amber-600">Manager Scope: Department Goals</span>
            <h1 className="text-2xl font-black text-stone-900">Q3 Department Growth Targets</h1>
            <p className="text-xs text-stone-500">Target metrics assigned to Sales & Marketing team members.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
