"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Building2, Users, CheckCircle2 } from "lucide-react";

export default function ManagerWorkspacePage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-indigo-500">
      <Sidebar currentRole="DEPARTMENT_MANAGER" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Team Workspace" subtitle="Manager Login Scope: Team Roster & Department Task Allocation" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-600">Manager Scope: Team Workspace</span>
              <h1 className="text-2xl font-black text-stone-900">Sales & Marketing Team Roster</h1>
              <p className="text-xs text-stone-500">Manage team capacity, active campaigns, and individual performance.</p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Active Department Members</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                    SJ
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 text-xs block">Sarah Jenkins</span>
                    <span className="text-[11px] text-stone-500 block">Lead Growth Manager</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Capacity 85%
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
