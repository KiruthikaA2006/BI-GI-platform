"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Header } from "@/components/layout/header";
import { AdminFlowNavigator } from "@/components/layout/admin-flow-navigator";
import {
  LayoutDashboard,
  Users,
  Building,
  ShieldCheck,
  Database,
  Lock,
  Settings,
  History,
  Shield,
  ArrowRight,
  UserPlus,
  PlusCircle,
  Key,
  Layers,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { getActiveOrganization, getOrgMembers } from "@/lib/org-context";

export default function AdminDashboardPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [usersCount, setUsersCount] = useState(1);
  const [dataSourcesCount, setDataSourcesCount] = useState(0);

  useEffect(() => {
    const org = getActiveOrganization();
    if (org) {
      setCurrentOrgName(org.name);
      const members = getOrgMembers(org.id);
      setUsersCount(members.length || 1);
    }

    fetch("/api/data-sources")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.dataSources)) {
          setDataSourcesCount(data.dataSources.length);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-emerald-500">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminFlowNavigator />
        <Header title="Admin Dashboard — Organization Overview" subtitle="Central Admin Cockpit matching Admin Architecture Flowchart" />

        <main className="p-6 space-y-8 max-w-[1600px] mx-auto w-full">
          {/* Executive Admin Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">Admin Console Scope • {currentOrgName}</span>
              <h2 className="text-2xl font-black text-stone-900 flex items-center gap-2">
                <span>ADMIN DASHBOARD — Organization Overview</span>
                <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                  Active Workspace
                </span>
              </h2>
              <p className="text-xs text-stone-600">Manage Users, Departments, Roles & Permissions, Data Sources, Org Settings & Audit Logs</p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/users"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
              >
                <Users className="h-4 w-4" />
                <span>Manage Users & Roles →</span>
              </Link>
            </div>
          </div>

          {/* Quick Admin Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-1 shadow-sm">
              <span className="text-xs font-bold text-stone-500 uppercase">Total Active Users</span>
              <h3 className="text-2xl font-black text-stone-900 tracking-tight">{usersCount} Users</h3>
              <p className="text-[10px] text-emerald-700 font-bold">Organization Members Configured</p>
            </div>

            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-1 shadow-sm">
              <span className="text-xs font-bold text-stone-500 uppercase">Active Departments</span>
              <h3 className="text-2xl font-black text-stone-900 tracking-tight">4 Departments</h3>
              <p className="text-[10px] text-stone-500">Executive, Sales, Data, Analytics</p>
            </div>

            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-1 shadow-sm">
              <span className="text-xs font-bold text-stone-500 uppercase">Data Connections</span>
              <h3 className="text-2xl font-black text-cyan-700 tracking-tight">{dataSourcesCount} Connected</h3>
              <p className="text-[10px] text-stone-500">PostgreSQL Data Pipeline Active</p>
            </div>

            <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-1 shadow-sm">
              <span className="text-xs font-bold text-stone-500 uppercase">Audit Log Events</span>
              <h3 className="text-2xl font-black text-purple-700 tracking-tight">Real-Time</h3>
              <p className="text-[10px] text-stone-500">Security & RBAC Audit Active</p>
            </div>
          </div>

          {/* Admin Architecture Flowchart Diagram Visualizer */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">
                  Admin System Architecture Blueprint
                </span>
                <h3 className="text-xl font-black text-stone-900 tracking-tight">
                  Admin Workflow Navigation (Flowchart Map)
                </h3>
              </div>
              <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                1-Click Navigation
              </span>
            </div>

            {/* Visual Node Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Branch 1: USERS */}
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-4 hover:border-emerald-500 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
                      <Users className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-black text-stone-900 uppercase tracking-wider">USERS</h4>
                  </div>
                  <Link href="/admin/users" className="text-xs font-bold text-emerald-700 hover:underline">
                    Open →
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center font-bold">
                  <span className="p-2 rounded-lg bg-white text-stone-800 border border-stone-300">Create</span>
                  <span className="p-2 rounded-lg bg-white text-stone-800 border border-stone-300">Manage</span>
                  <span className="p-2 rounded-lg bg-white text-stone-800 border border-stone-300">Roles</span>
                </div>
              </div>

              {/* Branch 2: DATA SOURCES */}
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-4 hover:border-emerald-500 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold border border-cyan-200">
                      <Database className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-black text-stone-900 uppercase tracking-wider">DATA SOURCES</h4>
                  </div>
                  <Link href="/admin/data-sources" className="text-xs font-bold text-cyan-700 hover:underline">
                    Open →
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center font-bold">
                  <span className="p-2 rounded-lg bg-white text-stone-800 border border-stone-300">Connect</span>
                  <span className="p-2 rounded-lg bg-white text-stone-800 border border-stone-300">CSV Import</span>
                  <span className="p-2 rounded-lg bg-white text-stone-800 border border-stone-300">PostgreSQL</span>
                </div>
              </div>

              {/* Branch 3: SYSTEM AUDIT */}
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-4 hover:border-emerald-500 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold border border-purple-200">
                      <History className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-black text-stone-900 uppercase tracking-wider">AUDIT LOGS</h4>
                  </div>
                  <Link href="/admin/audit-logs" className="text-xs font-bold text-purple-700 hover:underline">
                    Open →
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center font-bold">
                  <span className="p-2 rounded-lg bg-white text-stone-800 border border-stone-300">Activity</span>
                  <span className="p-2 rounded-lg bg-white text-stone-800 border border-stone-300">RBAC</span>
                  <span className="p-2 rounded-lg bg-white text-stone-800 border border-stone-300">Security</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
