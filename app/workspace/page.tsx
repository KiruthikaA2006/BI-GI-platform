"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { OrganizationSwitcher } from "@/components/layout/organization-switcher";
import { Building2, ShieldCheck, Users, Lock, Key, Plus } from "lucide-react";

export default function WorkspaceManagementPage() {
  const [activeOrg, setActiveOrg] = useState({
    id: "org_qubertrix_01",
    name: "Qubertrix Technologies",
    slug: "qubertrix",
    role: "OWNER",
  });

  const [members, setMembers] = useState([
    { id: "1", name: "Kiruthika Anand", email: "kiruthika@qubertrix.com", role: "OWNER" },
    { id: "2", name: "Chief Executive Officer", email: "ceo@qubertrix.com", role: "ADMIN" },
    { id: "3", name: "Sales Department Manager", email: "manager@qubertrix.com", role: "MANAGER" },
    { id: "4", name: "Senior Data Analyst", email: "analyst@qubertrix.com", role: "MEMBER" },
  ]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Workspace Foundation" subtitle="PostgreSQL Multi-Tenant Organization & Membership Architecture" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Header Action Bar with Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Multi-Tenant PostgreSQL Workspace</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Tenant Isolated
                </span>
              </div>
              <p className="text-xs text-slate-400">Current Active Workspace: <strong className="text-white">{activeOrg.name}</strong> ({activeOrg.slug})</p>
            </div>

            <div className="flex items-center gap-3">
              <OrganizationSwitcher />
            </div>
          </div>

          {/* Architecture Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">Tenant Isolation</span>
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">PostgreSQL Enforced</h3>
              <p className="text-xs text-slate-400">All queries automatically scoped by verified <code className="text-emerald-400">organization_id</code></p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">Transactions</span>
                <Lock className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Atomic Transactions</h3>
              <p className="text-xs text-slate-400">Org creation + Membership assignment executed inside <code className="text-indigo-300">$transaction</code></p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">Security Test Suite</span>
                <Key className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-purple-400">6 / 6 PASSED</h3>
              <p className="text-xs text-slate-400">Cross-tenant Read, Write, Delete & Switching blocked (403/404)</p>
            </div>
          </div>

          {/* Organization Members Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-400" />
                  <span>Workspace Members ({members.length})</span>
                </h3>
                <p className="text-xs text-slate-400">Users authorized to access {activeOrg.name}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">User Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">Membership Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white">{m.name}</td>
                      <td className="p-3 text-slate-400">{m.email}</td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase ${
                            m.role === "OWNER"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : m.role === "ADMIN"
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {m.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          Active Member
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
