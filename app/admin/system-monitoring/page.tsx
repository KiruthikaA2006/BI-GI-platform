"use client";

import React from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Header } from "@/components/layout/header";
import { Activity, Server, Zap, ShieldCheck } from "lucide-react";
import { mockAdminStats } from "@/lib/mock-data";

export default function AdminMonitoringPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Super Admin — System Telemetry" subtitle="Platform infrastructure health, API error rates & background sync status" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">System Uptime</span>
              <h3 className="text-2xl font-bold text-emerald-400">{mockAdminStats.systemUptime}%</h3>
              <span className="text-[10px] text-slate-500">Last 30 Days SLA</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">Data Processed</span>
              <h3 className="text-2xl font-bold text-white">{mockAdminStats.totalDataProcessedGB} GB</h3>
              <span className="text-[10px] text-slate-500">PostgreSQL + Storage</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">AI Queries</span>
              <h3 className="text-2xl font-bold text-purple-400">{mockAdminStats.aiQueriesThisMonth.toLocaleString()}</h3>
              <span className="text-[10px] text-slate-500">This Month</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">Connector Errors</span>
              <h3 className="text-2xl font-bold text-amber-400">{mockAdminStats.failedSyncsCount} active</h3>
              <span className="text-[10px] text-slate-500">Tally ERP Timeout</span>
            </div>
          </div>

          {/* Infrastructure Health Status */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Platform Subsystem Telemetry</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-indigo-400" />
                  <div>
                    <span className="text-sm font-bold text-white block">PostgreSQL Primary Cluster</span>
                    <span className="text-xs text-slate-400">Prisma ORM • Connection Pool: 24 active</span>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Healthy</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-purple-400" />
                  <div>
                    <span className="text-sm font-bold text-white block">AI Inference & Embedding API</span>
                    <span className="text-xs text-slate-400">Latency: 142ms • Error Rate: 0.02%</span>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Healthy</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
