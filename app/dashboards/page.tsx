"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  BarChart3,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  DollarSign,
  Users,
  Target,
  Activity,
  Building2,
} from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";
import { ColorfulTrendChart } from "@/components/analytics/colorful-trend-chart";

export default function DashboardsPage() {
  const [activeTab, setActiveTab] = useState<"kpi_views" | "reports">("kpi_views");
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const active = getActiveOrganization();
    if (active && active.name) {
      setCurrentOrgName(active.name);
    }

    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data);
          if (data.organizationName) setCurrentOrgName(data.organizationName);
        }
      })
      .catch((err) => console.error("Error fetching dashboard stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = stats?.metrics;
  const trends = stats?.trends || [];
  const hasRealData = Boolean(stats && stats.rawRowsCount > 0 && stats.datasetInfo);

  return (
    <div className="flex h-screen bg-[#e4dac9] text-stone-900 overflow-hidden selection:bg-blue-500">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Dashboards — KPI Views & Reports" subtitle="Pillar 2 in BI-GI Architecture" />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Pillar 2 • Visual Analytics & Reporting • {currentOrgName}</span>
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                Dashboards & Reports Workspace
              </h1>
              <p className="text-xs text-stone-600">
                Explore real-time KPI scorecards, department metrics, and trend visualizer for <strong>{currentOrgName}</strong>.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300">
              <button
                onClick={() => setActiveTab("kpi_views")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "kpi_views"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                KPI Views & Trends
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "reports"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Reports
              </button>
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 h-32 rounded-3xl border border-stone-300 shadow-sm" />
                <div className="bg-white/80 h-32 rounded-3xl border border-stone-300 shadow-sm" />
                <div className="bg-white/80 h-32 rounded-3xl border border-stone-300 shadow-sm" />
              </div>
              <div className="bg-white/80 h-72 rounded-3xl border border-stone-300 shadow-sm" />
            </div>
          ) : (
            <>
              {/* KPI Views Tab */}
              {activeTab === "kpi_views" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-stone-500">Revenue & Finance</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${hasRealData ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-amber-700 bg-amber-50 border border-amber-200"}`}>
                      {hasRealData ? "Live DB Data" : "No Dataset Uploaded"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-stone-900">
                    {hasRealData && metrics.totalRevenue
                      ? `$${(metrics.totalRevenue / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                      : "$0"}
                  </h3>
                  <p className="text-xs text-stone-600">
                    Gross Margin: {hasRealData && metrics.grossMargin ? `${metrics.grossMargin}%` : "0.0%"} • Profit: {hasRealData && metrics.profit ? `$${(metrics.profit / 100).toLocaleString()}` : "$0"}
                  </p>
                </div>

                <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-stone-500">Sales Velocity</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${hasRealData ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-stone-500 bg-stone-100 border border-stone-200"}`}>
                      {hasRealData ? "On Track" : "Inactive"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-stone-900">
                    {hasRealData && metrics.totalSales ? `${metrics.totalSales.toLocaleString()} Deals` : "0 Deals"}
                  </h3>
                  <p className="text-xs text-stone-600">
                    Avg Deal Size: {hasRealData && metrics.avgDealSize ? `$${metrics.avgDealSize.toLocaleString()}` : "$0"} • Growth: {hasRealData && metrics.revenueGrowth != null ? `${metrics.revenueGrowth}%` : "0.0%"}
                  </p>
                </div>

                <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-stone-500">Customer Success</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${hasRealData ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-stone-500 bg-stone-100 border border-stone-200"}`}>
                      {hasRealData ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-stone-900">
                    {hasRealData && metrics.churnRate != null ? `${metrics.churnRate.toFixed(2)}% Churn Rate` : "0.00% Churn Rate"}
                  </h3>
                  <p className="text-xs text-stone-600">
                    Active Customers: {hasRealData && metrics.activeCustomers ? metrics.activeCustomers.toLocaleString() : "0"} • Alerts: {hasRealData && metrics.activeAlertsCount != null ? metrics.activeAlertsCount : "0 Active"}
                  </p>
                </div>
              </div>

              {/* Real Monthly Trends Visualizer */}
              {!hasRealData ? (
                <div className="bg-white border border-stone-300 p-8 md:p-12 rounded-3xl text-center space-y-4 shadow-sm">
                  <div className="h-16 w-16 bg-blue-50 border border-blue-200 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <BarChart3 className="h-8 w-8" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-xl font-black text-stone-900">No Trend Analytics Available for {currentOrgName}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Organization <strong>{currentOrgName}</strong> does not have any imported CSV datasets yet. Trend visualizers and sales velocity curves are generated strictly after uploading a dataset.
                    </p>
                  </div>
                  <Link
                    href="/data-center"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition"
                  >
                    <span>Import CSV Dataset for {currentOrgName} →</span>
                  </Link>
                </div>
              ) : (
                <ColorfulTrendChart
                  title={`Sales & Returns Velocity — ${currentOrgName}`}
                  subtitle="Total sales and returns velocity calculated from active dataset rows"
                  salesCount={metrics?.totalSales ? metrics.totalSales.toLocaleString() : "0"}
                  salesChange={metrics?.revenueGrowth != null ? `${metrics.revenueGrowth >= 0 ? "+" : ""}${metrics.revenueGrowth.toFixed(1)}%` : "0.0%"}
                  returnsCount="0"
                  returnsChange="0.0%"
                  orgName={currentOrgName}
                  initialTrends={trends}
                />
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900">Executive & Department PDF/CSV Reports</h3>
              <p className="text-xs text-stone-600">Generated automatically from Pillar 1 Data Center Engine for {currentOrgName}.</p>
              <Link
                href="/reports"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
              >
                <span>View Full Reports Center →</span>
              </Link>
            </div>
          )}
          </>
          )}
        </main>
      </div>
    </div>
  );
}
