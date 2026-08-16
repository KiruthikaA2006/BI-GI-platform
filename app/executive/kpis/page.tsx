"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { Target, ArrowUpRight, ArrowRight, DollarSign, Users, ShoppingBag, TrendingUp } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";
import { getCachedStats, setCachedStats } from "@/lib/stats-cache";

export default function ExecutiveKPIsPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const org = getActiveOrganization();
    const orgId = org?.id || "default";
    if (org && org.name) setCurrentOrgName(org.name);

    const cached = getCachedStats(orgId);
    if (cached) {
      setStats(cached);
      setLoading(false);
    }

    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data);
          setCachedStats(orgId, data);
          if (data.organizationName) setCurrentOrgName(data.organizationName);
        }
      })
      .catch((err) => console.error("Error fetching executive KPIs stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = stats?.metrics;
  const hasData = Boolean(stats && stats.rawRowsCount > 0 && stats.datasetInfo);
  const totalRevenue = hasData && metrics?.totalRevenue ? `$${((metrics.totalRevenue || 0) / 100).toLocaleString()}` : "$0";
  const churnRate = hasData && metrics?.churnRate != null ? `${metrics.churnRate.toFixed(2)}%` : "0.00%";
  const growthIndex = hasData && metrics?.growthIndex ? metrics.growthIndex : "0.0% YoY";

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-indigo-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive KPIs — High-Level Telemetry" subtitle="Revenue, Profit, Sales, and Customer Retention Metrics" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="bg-white/80 h-28 rounded-3xl border border-stone-300 shadow-sm" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 h-36 rounded-3xl border border-stone-300 shadow-sm" />
                <div className="bg-white/80 h-36 rounded-3xl border border-stone-300 shadow-sm" />
                <div className="bg-white/80 h-36 rounded-3xl border border-stone-300 shadow-sm" />
              </div>
            </div>
          ) : (
            <>
              {/* Top Banner White Card */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-700">Executive Flow Node: KPIs</span>
              <h2 className="text-2xl font-black text-stone-900">Revenue, Profit & Customer Telemetry • {currentOrgName}</h2>
              <p className="text-xs text-stone-600">Core financial metrics feeding directly into AI Insights ("Why?").</p>
            </div>

            <Link
              href="/ai-insights"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition flex items-center gap-1.5"
            >
              <span>Analyze in AI Insights →</span>
            </Link>
          </div>

          {/* 4 Core Executive Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-stone-500">Monthly Recurring Revenue</span>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-stone-900">{totalRevenue}</div>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> {growthIndex}
              </span>
            </div>

            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-stone-500">Net Profit Margin</span>
                <TrendingUp className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-stone-900">$74,200</div>
              <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> 29.8% Margin
              </span>
            </div>

            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-stone-500">Gross Sales Vol.</span>
                <ShoppingBag className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-stone-900">1,420 Deals</div>
              <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> +8.4% QoQ
              </span>
            </div>

            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-stone-500">Customer Retention</span>
                <Users className="h-4 w-4 text-cyan-600" />
              </div>
              <div className="text-3xl font-black text-stone-900">{(100 - Number(churnRate.replace('%',''))).toFixed(1)}%</div>
              <span className="text-xs font-bold text-cyan-700 flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> {churnRate} Churn Risk
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

