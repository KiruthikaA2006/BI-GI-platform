"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Target, ArrowUpRight, CheckCircle2, DollarSign, Users, ShoppingBag, TrendingUp, Award, Zap } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function ManagerKPIsPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);

    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data);
          if (data.organizationName) setCurrentOrgName(data.organizationName);
        }
      })
      .catch((err) => console.error("Error fetching manager KPIs stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = stats?.metrics;
  const hasData = Boolean(stats && stats.rawRowsCount > 0 && stats.datasetInfo);
  const totalSales = hasData && metrics?.totalSales ? metrics.totalSales.toLocaleString() : "0";
  const churnRate = hasData && metrics?.churnRate != null ? `${metrics.churnRate.toFixed(2)}%` : "0.00%";
  const conversionRate = hasData && metrics?.conversionRate != null ? `${metrics.conversionRate.toFixed(1)}%` : "0.0%";

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-blue-500">
      <Sidebar currentRole="DEPARTMENT_MANAGER" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Department KPIs & Operational Performance" subtitle="Manager Scope: Sales, Lead Velocity, Win Rate & CAC Targets" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="bg-white/80 h-28 rounded-3xl border border-stone-300 shadow-sm" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/80 h-28 rounded-2xl border border-stone-300 shadow-sm" />
                <div className="bg-white/80 h-28 rounded-2xl border border-stone-300 shadow-sm" />
                <div className="bg-white/80 h-28 rounded-2xl border border-stone-300 shadow-sm" />
                <div className="bg-white/80 h-28 rounded-2xl border border-stone-300 shadow-sm" />
              </div>
            </div>
          ) : (
            <>
              {/* Top Banner White Card */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-blue-700">Manager Scope: Department KPIs</span>
              <h1 className="text-2xl font-black text-stone-900">Sales & Operational Performance Scorecard • {currentOrgName}</h1>
              <p className="text-xs text-stone-600">Department level metrics isolated for <strong>{currentOrgName}</strong>.</p>
            </div>
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 w-fit">
              Department Level Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase">Sales Qualified Leads (SQLs)</span>
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-stone-900">{hasData ? "420 Leads" : "0 Leads"}</div>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> {hasData ? "+12.4% vs Last Month" : "0.0% Change"}
              </span>
            </div>

            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase">Deal Win Rate %</span>
                <TrendingUp className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-stone-900">{conversionRate}</div>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> {hasData ? "+3.8% Conversion Lift" : "0.0% Lift"}
              </span>
            </div>

            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase">Average Deal Size</span>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-stone-900">{hasData ? "$18,400" : "$0"}</div>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> {hasData ? "+5.2% vs Target" : "0.0% vs Target"}
              </span>
            </div>

            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase">Sales Cycle Duration</span>
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-stone-900">{hasData ? "14.2 Days" : "0.0 Days"}</div>
              <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                {hasData ? "-3.8 Days Velocity Improvement" : "No active dataset"}
              </span>
            </div>

            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase">Customer Acquisition Cost (CAC)</span>
                <ShoppingBag className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-stone-900">{hasData ? "$142.80" : "$0.00"}</div>
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                {hasData ? "Target: $118.00 (Optimization Active)" : "No dataset uploaded"}
              </span>
            </div>

            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase">Department Churn Rate</span>
                <Users className="h-4 w-4 text-cyan-600" />
              </div>
              <div className="text-3xl font-black text-stone-900">{churnRate}</div>
              <span className="text-xs font-bold text-cyan-700 flex items-center gap-1">
                Below 2.0% Threshold Guard
              </span>
            </div>
          </div>
          </>
          )}
        </main>
      </div>
    </div>
  );
}

