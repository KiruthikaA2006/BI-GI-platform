"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { LayoutDashboard, Target, Building2, Trophy, Bell, FileText, ArrowRight, CheckCircle2, DollarSign, Users, TrendingUp } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";
import { useTelemetry } from "@/components/providers/telemetry-provider";
import { ColorfulTrendChart } from "@/components/analytics/colorful-trend-chart";

export default function ManagerDashboardPage() {
  const { stats, loading, currentOrgName } = useTelemetry();

  const metrics = stats?.metrics;
  const hasData = Boolean(stats && stats.rawRowsCount > 0 && stats.datasetInfo);
  const totalRevenue = hasData && metrics?.totalRevenue ? `$${((metrics.totalRevenue || 0) / 100).toLocaleString()}` : "$0";
  const totalSales = hasData && metrics?.totalSales ? metrics.totalSales.toLocaleString() : "0";
  const activeCustomers = hasData && metrics?.activeCustomers ? metrics.activeCustomers.toLocaleString() : "0";

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-blue-500">
      <Sidebar currentRole="DEPARTMENT_MANAGER" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Manager Operational Command Center" subtitle="Department Performance, Team Velocity & Operational Telemetry" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="bg-white/80 h-28 rounded-3xl border border-stone-300 shadow-sm" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 h-32 rounded-3xl border border-stone-300 shadow-sm" />
                <div className="bg-white/80 h-32 rounded-3xl border border-stone-300 shadow-sm" />
                <div className="bg-white/80 h-32 rounded-3xl border border-stone-300 shadow-sm" />
              </div>
            </div>
          ) : (
            <>
              {/* Top Banner White Card */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-blue-700 tracking-wider">Department Scope • {currentOrgName}</span>
              <h1 className="text-2xl font-black text-stone-900">Manager Operational Cockpit • {currentOrgName}</h1>
              <p className="text-xs text-stone-600">Manage team velocity, department KPIs, goals, and operational reports strictly within <strong>{currentOrgName}</strong>.</p>
            </div>

            <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full flex items-center gap-1 w-fit">
              <CheckCircle2 className="h-4 w-4 text-blue-600" /> Sales & Dept Active
            </span>
          </div>

          {/* Quick Department Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-stone-500">Department Revenue</span>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-stone-900">{totalRevenue}</div>
              <p className="text-xs text-emerald-700 font-bold">+14.2% YoY Growth</p>
            </div>

            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-stone-500">Total Closed Deals</span>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-stone-900">{totalSales} Deals</div>
              <p className="text-xs text-blue-700 font-bold">14 Days Win Cycle</p>
            </div>

            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-stone-500">Active Department Accounts</span>
                <Users className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-stone-900">{activeCustomers} Accounts</div>
              <p className="text-xs text-indigo-700 font-bold">98.2% Retention Rate</p>
            </div>
          </div>

          {/* COLORFUL TREND CHART MATCHING SCREENSHOT 5 */}
          <ColorfulTrendChart
            title={`Department Performance Velocity — ${currentOrgName}`}
            subtitle="Total sales up 7%, while returns decreased by 12%"
            salesCount="4,782"
            salesChange="+7%"
            returnsCount="503"
            returnsChange="-12%"
            orgName={currentOrgName}
            initialTrends={stats?.trends}
          />

          {/* Core Manager Sub-Route Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/manager/kpis"
              className="bg-white border border-stone-300 p-6 rounded-3xl hover:border-blue-500 transition shadow-sm space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                  <Target className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 uppercase">
                  Department KPIs
                </span>
              </div>
              <h3 className="text-base font-black text-stone-900 group-hover:text-blue-600 transition">Department KPIs</h3>
              <p className="text-xs text-stone-600">Track Sales Conversion, Deal Velocity, CAC targets, and Team Targets.</p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-blue-700">
                <span>View Department KPIs →</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              href="/manager/workspace"
              className="bg-white border border-stone-300 p-6 rounded-3xl hover:border-indigo-500 transition shadow-sm space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                  <Building2 className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200 uppercase">
                  Team Workspace
                </span>
              </div>
              <h3 className="text-base font-black text-stone-900 group-hover:text-indigo-600 transition">Team Workspace</h3>
              <p className="text-xs text-stone-600">Team roster, capacity allocation, active projects, and task assignments.</p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-indigo-700">
                <span>Open Team Workspace →</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              href="/manager/goals"
              className="bg-white border border-stone-300 p-6 rounded-3xl hover:border-emerald-500 transition shadow-sm space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                  <Trophy className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 uppercase">
                  Department Goals
                </span>
              </div>
              <h3 className="text-base font-black text-stone-900 group-hover:text-emerald-600 transition">Department Goals</h3>
              <p className="text-xs text-stone-600">Target metrics assigned to Sales & Marketing team members.</p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Open Department Goals →</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
          </>
          )}
        </main>
      </div>
    </div>
  );
}

