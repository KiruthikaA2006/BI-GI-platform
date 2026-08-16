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
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-purple-800">Admin Architecture Node: PERMISSIONS</span>
              <h2 className="text-xl font-black text-stone-900">Roles, Access & Custom Permissions</h2>
              <p className="text-xs text-stone-600">Configuring fine-grained role-based access control (RBAC) across platform modules.</p>
            </div>
          </div>

          {/* Roles Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`p-4 rounded-2xl border text-left transition shadow-sm ${
                  selectedRole === r.id
                    ? "bg-purple-50 border-purple-500 ring-2 ring-purple-500/20"
                    : "bg-white border-stone-300 text-stone-600 hover:text-stone-900 hover:border-purple-300"
                }`}
              >
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                  {r.scope}
                </span>
                <h3 className="text-sm font-bold text-stone-900 mt-2">{r.name}</h3>
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{r.desc}</p>
              </button>
            ))}
          </div>

          {/* Permissions Access Matrix Table */}
          <div className="bg-white border border-stone-300 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-600" />
                Access Control Matrix
              </h3>
              <span className="text-xs text-stone-500 font-medium">Custom Role Overrides Active</span>
            </div>

            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-100 text-stone-700 uppercase text-[10px] tracking-wider border-b border-stone-200 font-bold">
                <tr>
                  <th className="p-4">Platform Module</th>
                  <th className="p-4 text-center">Super Admin</th>
                  <th className="p-4 text-center">Org Admin</th>
                  <th className="p-4 text-center">Executive</th>
                  <th className="p-4 text-center">Manager</th>
                  <th className="p-4 text-center">Analyst</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {permissionsMatrix.map((row, i) => (
                  <tr key={i} className="hover:bg-stone-50 transition">
                    <td className="p-4 font-bold text-stone-900">{row.module}</td>
                    <td className="p-4 text-center">{row.superAdmin ? <Check className="h-4 w-4 text-emerald-600 mx-auto" /> : <X className="h-4 w-4 text-stone-300 mx-auto" />}</td>
                    <td className="p-4 text-center">{row.orgAdmin ? <Check className="h-4 w-4 text-emerald-600 mx-auto" /> : <X className="h-4 w-4 text-stone-300 mx-auto" />}</td>
                    <td className="p-4 text-center">{row.exec ? <Check className="h-4 w-4 text-emerald-600 mx-auto" /> : <X className="h-4 w-4 text-stone-300 mx-auto" />}</td>
                    <td className="p-4 text-center">{row.manager ? <Check className="h-4 w-4 text-emerald-600 mx-auto" /> : <X className="h-4 w-4 text-stone-300 mx-auto" />}</td>
                    <td className="p-4 text-center">{row.analyst ? <Check className="h-4 w-4 text-emerald-600 mx-auto" /> : <X className="h-4 w-4 text-stone-300 mx-auto" />}</td>
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
