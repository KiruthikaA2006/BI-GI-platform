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
  const hasRealData = stats?.source === "database" && metrics;

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

          {/* KPI Views Tab */}
          {activeTab === "kpi_views" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-stone-500">Revenue & Finance</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {hasRealData ? "Live DB Data" : "Database Ready"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-stone-900">
                    {hasRealData && metrics.totalRevenue
                      ? `$${(metrics.totalRevenue / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                      : "$248,500"}
                  </h3>
                  <p className="text-xs text-stone-600">
                    Gross Margin: {hasRealData && metrics.grossMargin ? `${metrics.grossMargin}%` : "64.2%"} • Profit: {hasRealData && metrics.profit ? `$${(metrics.profit / 100).toLocaleString()}` : "$82,400"}
                  </p>
                </div>

                <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-stone-500">Sales Velocity</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      On Track
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-stone-900">
                    {hasRealData && metrics.totalSales ? `${metrics.totalSales.toLocaleString()} Deals` : "14 Days Win Cycle"}
                  </h3>
                  <p className="text-xs text-stone-600">
                    Avg Deal Size: {hasRealData && metrics.avgDealSize ? `$${metrics.avgDealSize.toLocaleString()}` : "$18,400"} • Growth: {hasRealData && metrics.revenueGrowth != null ? `${metrics.revenueGrowth}%` : "+18.4%"}
                  </p>
                </div>

                <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-stone-500">Customer Success</span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Attention
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-stone-900">
                    {hasRealData && metrics.churnRate != null ? `${metrics.churnRate.toFixed(2)}% Churn Rate` : "1.82% Churn Rate"}
                  </h3>
                  <p className="text-xs text-stone-600">
                    Active Customers: {hasRealData && metrics.activeCustomers ? metrics.activeCustomers.toLocaleString() : "4,850"} • Alerts: {hasRealData && metrics.activeAlertsCount != null ? metrics.activeAlertsCount : "2 Active"}
                  </p>
                </div>
              </div>

              {/* Real Monthly Trends Visualizer */}
              <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                      <span>Monthly Performance & Revenue Trends</span>
                    </h3>
                    <p className="text-xs text-stone-500">
                      Visualizing monthly aggregated dataset trends in PostgreSQL for <strong>{currentOrgName}</strong>
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full border border-indigo-200">
                    {trends.length > 0 ? `${trends.length} Months Tracked` : "Real-Time Engine"}
                  </span>
                </div>

                {trends.length > 0 ? (
                  <div className="space-y-3 pt-2">
                    {trends.map((t: any, idx: number) => {
                      const maxRev = Math.max(...trends.map((tr: any) => tr.revenue || 1));
                      const pct = Math.round(((t.revenue || 0) / maxRev) * 100);
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-stone-700">{t.month}</span>
                            <span className="text-indigo-700">${((t.revenue || 0) / 100).toLocaleString()}</span>
                          </div>
                          <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                              style={{ width: `${Math.max(pct, 5)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 bg-stone-50 border border-stone-200 rounded-2xl text-center space-y-3">
                    <Activity className="h-8 w-8 text-stone-400 mx-auto" />
                    <p className="text-xs text-stone-600 font-medium">
                      No CSV business dataset imported for <strong>{currentOrgName}</strong> yet.
                    </p>
                    <Link
                      href="/data-center"
                      className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
                    >
                      <span>Upload Dataset in Data Center →</span>
                    </Link>
                  </div>
                )}
              </div>
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
        </main>
      </div>
    </div>
  );
}
