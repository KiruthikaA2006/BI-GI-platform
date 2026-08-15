"use client";

import React from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Header } from "@/components/layout/header";
import { Building2, Users, CreditCard, Activity, ShieldCheck, Database, Zap, ArrowUpRight } from "lucide-react";
import { mockAdminStats } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Platform Admin Dashboard" subtitle="Super Admin global tenant telemetry & platform administration" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Executive Admin Banner */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Global Administration Scope</span>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>Multi-Tenant Platform Control</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  SLA 99.98%
                </span>
              </h2>
              <p className="text-xs text-slate-400">Isolated Tenant Organizations • RBAC Security Enforcement Enabled</p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/organizations"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
              >
                <Building2 className="h-4 w-4" />
                <span>Manage Organizations</span>
              </Link>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">Active Organizations</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">{mockAdminStats.activeOrganizationsCount} Tenants</h3>
              <p className="text-[10px] text-emerald-400 font-semibold">+3 onboarded this month</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">Platform Users</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">{mockAdminStats.totalUsersCount} Users</h3>
              <p className="text-[10px] text-slate-400">Enforced by RBAC</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">Monthly Subscription ARR</span>
              <h3 className="text-2xl font-bold text-emerald-400 tracking-tight">₹ 18.50 Lakhs</h3>
              <p className="text-[10px] text-slate-400">Pro & Enterprise tiers</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">AI Queries Processed</span>
              <h3 className="text-2xl font-bold text-purple-400 tracking-tight">{mockAdminStats.aiQueriesThisMonth.toLocaleString()}</h3>
              <p className="text-[10px] text-slate-400">Inference Engine Telemetry</p>
            </div>
          </div>

          {/* Core Modules List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/admin/organizations"
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl space-y-2 group transition"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">Organizations Directory</h3>
              <p className="text-xs text-slate-400">Provision tenants, manage limits, isolate databases, and monitor usage.</p>
            </Link>

            <Link
              href="/admin/users"
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl space-y-2 group transition"
            >
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition">User Access & Roles</h3>
              <p className="text-xs text-slate-400">Manage SUPER_ADMIN, ORGANIZATION_ADMIN, EXECUTIVE & ANALYST permissions.</p>
            </Link>

            <Link
              href="/admin/system-monitoring"
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl space-y-2 group transition"
            >
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition">System Telemetry</h3>
              <p className="text-xs text-slate-400">Track database connection pools, API latencies, error rates, and job syncs.</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
