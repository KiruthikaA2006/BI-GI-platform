"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { LayoutDashboard, Target, Building2, Trophy, Bell, FileText, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ManagerDashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-blue-500">
      <Sidebar currentRole="DEPARTMENT_MANAGER" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Manager Dashboard" subtitle="Department Performance & Operational Telemetry" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-blue-600 tracking-wider">Department Scope • Sales & Growth</span>
              <h1 className="text-2xl font-black text-stone-900">Manager Operational Command</h1>
              <p className="text-xs text-stone-500">Manage team velocity, department KPIs, goals, and operational reports strictly within your Manager login.</p>
            </div>

            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Sales Dept Active
            </span>
          </div>

          {/* Core Manager Sub-Route Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/manager/kpis"
              className="bg-white border border-stone-200 p-6 rounded-3xl hover:border-blue-500 transition shadow-sm space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  <Target className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">
                  Department KPIs
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-blue-600 transition">Department KPIs</h3>
              <p className="text-xs text-stone-500">Track Sales Conversion, Deal Velocity, CAC targets, and Team Targets.</p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>View Department KPIs →</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              href="/manager/workspace"
              className="bg-white border border-stone-200 p-6 rounded-3xl hover:border-blue-500 transition shadow-sm space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  <Building2 className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase">
                  Team Workspace
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-indigo-600 transition">Team Workspace</h3>
              <p className="text-xs text-stone-500">Team roster, capacity allocation, active projects, and task assignments.</p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>Open Team Workspace →</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              href="/manager/alerts"
              className="bg-white border border-stone-200 p-6 rounded-3xl hover:border-amber-500 transition shadow-sm space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold">
                  <Bell className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase">
                  3 Active Alerts
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-600 transition">Alerts & Notifications</h3>
              <p className="text-xs text-stone-500">Department threshold alerts, target warnings, and performance notifications.</p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>Check Department Alerts →</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
