"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Header } from "@/components/layout/header";
import { AdminFlowNavigator } from "@/components/layout/admin-flow-navigator";
import { ShieldCheck, Lock, Check, X, Sliders, Key } from "lucide-react";

export default function AdminRolesPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState("SUPER_ADMIN");

  const roles = [
    { id: "SUPER_ADMIN", name: "Super Admin", scope: "Platform Scope", desc: "Full administrative access across all tenants and database telemetry" },
    { id: "ORGANIZATION_ADMIN", name: "Organization Admin", scope: "Tenant Scope", desc: "Full administrative access within active organization tenant" },
    { id: "EXECUTIVE", name: "Executive", scope: "Executive Scope", desc: "C-Level view of high-level KPIs, strategic forecasts, and AI insights" },
    { id: "DEPARTMENT_MANAGER", name: "Department Manager", scope: "Department Scope", desc: "Department performance, team goals, and operational reports" },
    { id: "ANALYST", scope: "Data Scope", name: "Analyst", desc: "Data ingestion, dataset exploration, custom report creation" },
  ];

  const permissionsMatrix = [
    { module: "User Administration", superAdmin: true, orgAdmin: true, exec: false, manager: false, analyst: false },
    { module: "Data Center & Ingestion", superAdmin: true, orgAdmin: true, exec: false, manager: false, analyst: true },
    { module: "KPI Views & Dashboards", superAdmin: true, orgAdmin: true, exec: true, manager: true, analyst: true },
    { module: "AI Root Cause & Insights", superAdmin: true, orgAdmin: true, exec: true, manager: false, analyst: true },
    { module: "Strategic Forecasting", superAdmin: true, orgAdmin: true, exec: true, manager: false, analyst: false },
    { module: "Goals & Actions Assign", superAdmin: true, orgAdmin: true, exec: true, manager: true, analyst: false },
    { module: "System & Audit Logs", superAdmin: true, orgAdmin: true, exec: false, manager: false, analyst: false },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-purple-500">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminFlowNavigator />
        <Header title="Roles & Permissions Matrix" subtitle="Admin Node: Roles, Access Level Control, Custom Permissions" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-purple-400">Admin Architecture Node: PERMISSIONS</span>
              <h2 className="text-xl font-black text-white">Roles, Access & Custom Permissions</h2>
              <p className="text-xs text-slate-400">Configuring fine-grained role-based access control (RBAC) across platform modules.</p>
            </div>
          </div>

          {/* Roles Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`p-4 rounded-2xl border text-left transition ${
                  selectedRole === r.id
                    ? "bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/40"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-950 text-purple-400 border border-purple-500/30">
                  {r.scope}
                </span>
                <h3 className="text-sm font-bold text-white mt-2">{r.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{r.desc}</p>
              </button>
            ))}
          </div>

          {/* Permissions Access Matrix Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-400" />
                Access Control Matrix
              </h3>
              <span className="text-xs text-slate-400">Custom Role Overrides Active</span>
            </div>

            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Platform Module</th>
                  <th className="p-4 text-center">Super Admin</th>
                  <th className="p-4 text-center">Org Admin</th>
                  <th className="p-4 text-center">Executive</th>
                  <th className="p-4 text-center">Manager</th>
                  <th className="p-4 text-center">Analyst</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {permissionsMatrix.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-bold text-white">{row.module}</td>
                    <td className="p-4 text-center">{row.superAdmin ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-4 w-4 text-rose-500/40 mx-auto" />}</td>
                    <td className="p-4 text-center">{row.orgAdmin ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-4 w-4 text-rose-500/40 mx-auto" />}</td>
                    <td className="p-4 text-center">{row.exec ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-4 w-4 text-rose-500/40 mx-auto" />}</td>
                    <td className="p-4 text-center">{row.manager ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-4 w-4 text-rose-500/40 mx-auto" />}</td>
                    <td className="p-4 text-center">{row.analyst ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-4 w-4 text-rose-500/40 mx-auto" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
