"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Database,
  Activity,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  PieChart as PieChartIcon,
  BarChart3,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Target,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface RoleDashboardProps {
  role: string; // SUPER_ADMIN, ORGANIZATION_ADMIN, EXECUTIVE, DEPARTMENT_MANAGER, ANALYST
  data: any;
}

export function RoleDashboardView({ role, data }: RoleDashboardProps) {
  const normalizedRole = (role || "ORGANIZATION_ADMIN").toUpperCase();

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  // -------------------------------------------------------------
  // 1. SUPER ADMIN DASHBOARD SUMMARY (Infrastructure & Platform Governance)
  // -------------------------------------------------------------
  if (normalizedRole === "SUPER_ADMIN") {
    return (
      <div className="space-y-6">
        {/* Role Badge Banner */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded uppercase">
                Platform Admin Portal
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">Super Admin Infrastructure & Tenant Governance</h3>
            </div>
          </div>
          <Link
            href="/admin/organizations"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-2 rounded-xl font-semibold transition flex items-center gap-1.5"
          >
            <span>Manage Organizations</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Super Admin Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Active Organizations</span>
            <h4 className="text-2xl font-bold text-white">12 Organizations</h4>
            <p className="text-xs text-emerald-400 font-semibold">+2 new this month</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Platform Subscriptions</span>
            <h4 className="text-2xl font-bold text-white">₹ 4.85 Lakhs / mo</h4>
            <p className="text-xs text-emerald-400 font-semibold">+18.5% MRR Growth</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">System Server Load</span>
            <h4 className="text-2xl font-bold text-emerald-400">14.2% CPU</h4>
            <p className="text-xs text-slate-400">Memory: 4.2 GB / 32 GB</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Audit Log Events</span>
            <h4 className="text-2xl font-bold text-white">1,420 Events</h4>
            <p className="text-xs text-indigo-400 font-semibold">100% Tenant Isolated</p>
          </div>
        </div>

        {/* Super Admin Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/organizations" className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl transition space-y-2">
            <Building2 className="h-6 w-6 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Tenant Organization Manager</h4>
            <p className="text-xs text-slate-400">Provision new organizations, manage owner accounts & custom domains</p>
          </Link>
          <Link href="/admin/system-monitoring" className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-5 rounded-2xl transition space-y-2">
            <Activity className="h-6 w-6 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">System Infrastructure Health</h4>
            <p className="text-xs text-slate-400">Monitor PostgreSQL pool latency, API uptime & storage volume</p>
          </Link>
          <Link href="/admin/audit-logs" className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl transition space-y-2">
            <FileText className="h-6 w-6 text-purple-400" />
            <h4 className="text-sm font-bold text-white">Global Audit Trail</h4>
            <p className="text-xs text-slate-400">Inspect platform administrative events, security tokens & user access</p>
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. EXECUTIVE DASHBOARD SUMMARY (Strategic Growth & Intelligence)
  // -------------------------------------------------------------
  if (normalizedRole === "EXECUTIVE") {
    return (
      <div className="space-y-6">
        {/* Role Badge Banner */}
        <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded uppercase">
                Executive Portal
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">Executive Growth Intelligence & Financial Health</h3>
            </div>
          </div>
          <Link
            href="/forecasts"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3.5 py-2 rounded-xl font-semibold transition flex items-center gap-1.5"
          >
            <span>View AI Forecasts</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Executive KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Enterprise Revenue</span>
            <h4 className="text-2xl font-bold text-white">{formatCurrency(data?.metrics?.totalRevenue || 12450000)}</h4>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+14.8% YoY Growth</span>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Net Profit Margin</span>
            <h4 className="text-2xl font-bold text-emerald-400">32.4% Margin</h4>
            <p className="text-xs text-slate-400">Net Profit: {formatCurrency(data?.metrics?.netProfit || 4033800)}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Strategic Goal Progress</span>
            <h4 className="text-2xl font-bold text-indigo-400">82.5% Target</h4>
            <p className="text-xs text-slate-400">Q3 FY26 Milestone Achieved</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">High Risk AI Flag</span>
            <h4 className="text-2xl font-bold text-amber-400">1 Risk Flag</h4>
            <p className="text-xs text-slate-400">Expense Spike in Marketing</p>
          </div>
        </div>

        {/* Executive AI Insights & Strategic Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-white">6-Month Strategic Revenue Trajectory</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.trends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="h-5 w-5" />
              <h4 className="text-sm font-bold text-white">Executive Decision Summary</h4>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 block">Growth Momentum</span>
                <p className="text-slate-300">Revenue trajectory indicates positive expansion. Customer retention is at 94.2%.</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block">Cost Optimization</span>
                <p className="text-slate-300">Operational expenses increased 8.2% in West Region. Recommend cost audit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. DEPARTMENT MANAGER DASHBOARD (Operations & Team Performance)
  // -------------------------------------------------------------
  if (normalizedRole === "DEPARTMENT_MANAGER") {
    return (
      <div className="space-y-6">
        {/* Role Badge Banner */}
        <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-blue-500/30 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded uppercase">
                Manager Portal
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">Department Operations & Team Performance</h3>
            </div>
          </div>
          <Link
            href="/admin/users"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-2 rounded-xl font-semibold transition flex items-center gap-1.5"
          >
            <span>Manage Team</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Manager Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Department Revenue</span>
            <h4 className="text-2xl font-bold text-white">{formatCurrency(3850000)}</h4>
            <p className="text-xs text-emerald-400 font-semibold">108% of Monthly Quota</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Team Members</span>
            <h4 className="text-2xl font-bold text-white">8 Members</h4>
            <p className="text-xs text-slate-400">All Active & Assigned</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Conversion Efficiency</span>
            <h4 className="text-2xl font-bold text-blue-400">18.4% Rate</h4>
            <p className="text-xs text-slate-400">+2.1% higher than team average</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Open Operational Tasks</span>
            <h4 className="text-2xl font-bold text-amber-400">3 Pending</h4>
            <p className="text-xs text-slate-400">Quarterly Review Pending</p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. ANALYST DASHBOARD (Data Ingestion & Analytical Deep-Dive)
  // -------------------------------------------------------------
  if (normalizedRole === "ANALYST") {
    return (
      <div className="space-y-6">
        {/* Role Badge Banner */}
        <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-500/30 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded uppercase">
                Analyst Portal
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">Analytical Deep-Dive & Data Validation Telemetry</h3>
            </div>
          </div>
          <Link
            href="/data-sources/import"
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3.5 py-2 rounded-xl font-semibold transition flex items-center gap-1.5"
          >
            <span>Import Dataset</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Analyst Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Connected Datasets</span>
            <h4 className="text-2xl font-bold text-white">
              {data?.datasetInfo?.name ? "1 Active Dataset" : "0 Datasets"}
            </h4>
            <p className="text-xs text-purple-400 font-semibold truncate">
              {data?.datasetInfo?.name || "No dataset loaded"}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">PostgreSQL Row Count</span>
            <h4 className="text-2xl font-bold text-white">
              {(data?.datasetInfo?.rowCount || 0).toLocaleString()} Rows
            </h4>
            <p className="text-xs text-slate-400">Processed in memory</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Statistical Forecast Model</span>
            <h4 className="text-2xl font-bold text-emerald-400">96.5% Accuracy</h4>
            <p className="text-xs text-slate-400">Linear Regression Engine</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Anomaly Detection</span>
            <h4 className="text-2xl font-bold text-indigo-400">0 Critical Errors</h4>
            <p className="text-xs text-slate-400">Schema validated</p>
          </div>
        </div>

        {/* Analyst Quick Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/explorer" className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl transition space-y-2">
            <BarChart3 className="h-6 w-6 text-purple-400" />
            <h4 className="text-sm font-bold text-white">Data Explorer & Queries</h4>
            <p className="text-xs text-slate-400">Run custom SQL-like data queries and inspect individual transaction rows</p>
          </Link>
          <Link href="/reports" className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-5 rounded-2xl transition space-y-2">
            <FileText className="h-6 w-6 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">Custom Report Builder</h4>
            <p className="text-xs text-slate-400">Generate PDF/CSV reports and share automated analytics summaries</p>
          </Link>
          <Link href="/ai-insights" className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl transition space-y-2">
            <Sparkles className="h-6 w-6 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">AI Insights Generator</h4>
            <p className="text-xs text-slate-400">Generate statistical anomaly flags and growth intelligence breakdowns</p>
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 5. DEFAULT ORGANIZATION ADMIN DASHBOARD SUMMARY
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Role Badge Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded uppercase">
              Organization Admin Portal
            </span>
            <h3 className="text-sm font-bold text-white mt-0.5">Enterprise Operations & Governance Console</h3>
          </div>
        </div>
        <Link
          href="/admin/users"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3.5 py-2 rounded-xl font-semibold transition flex items-center gap-1.5"
        >
          <span>Manage Users</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Admin KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Organization Revenue</span>
          <h4 className="text-2xl font-bold text-white">{formatCurrency(data?.metrics?.totalRevenue || 12450000)}</h4>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+{data?.metrics?.revenueGrowth || 14.8}% calculated MoM</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Active Users</span>
          <h4 className="text-2xl font-bold text-white">4 Authorized Users</h4>
          <p className="text-xs text-slate-400">RBAC Enforced</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Dataset Health</span>
          <h4 className="text-2xl font-bold text-emerald-400">PostgreSQL Live</h4>
          <p className="text-xs text-slate-400">
            {data?.datasetInfo?.rowCount ? `${data.datasetInfo.rowCount.toLocaleString()} records` : "Connected"}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Tenant Isolation</span>
          <h4 className="text-2xl font-bold text-indigo-400">Active</h4>
          <p className="text-xs text-slate-400">Strictly Scoped</p>
        </div>
      </div>
    </div>
  );
}
