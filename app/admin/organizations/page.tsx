"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Building2, Plus, Users, Database, ShieldCheck, Activity } from "lucide-react";

export default function AdminOrganizationsPage() {
  const orgs = [
    { id: "1", name: "Qubertrix Technologies", slug: "qubertrix", users: 12, dataSources: 6, plan: "Professional", status: "Active" },
    { id: "2", name: "Acme Logistics Corp", slug: "acme-logistics", users: 45, dataSources: 12, plan: "Enterprise", status: "Active" },
    { id: "3", name: "Zenith Retail India", slug: "zenith-retail", users: 8, dataSources: 3, plan: "Starter", status: "Active" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar currentRole="SUPER_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Super Admin — Organizations" subtitle="Manage tenant organizations, isolate data & provision subscriptions" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Platform Tenant Organizations</h2>
              <p className="text-xs text-slate-400">Total Active Organizations: {orgs.length}</p>
            </div>
            <button
              onClick={() => alert("Provisioning new Organization tenant...")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create Tenant Organization</span>
            </button>
          </div>

          {/* Organizations Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Organization Name</th>
                  <th className="p-4">Tenant Slug</th>
                  <th className="p-4">Active Users</th>
                  <th className="p-4">Data Connectors</th>
                  <th className="p-4">Subscription Plan</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orgs.map((org) => (
                  <tr key={org.id} className="hover:bg-slate-800/50 transition">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-indigo-400" />
                      <span>{org.name}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-400">{org.slug}</td>
                    <td className="p-4 text-slate-300 font-semibold">{org.users} users</td>
                    <td className="p-4 text-slate-300">{org.dataSources} sources</td>
                    <td className="p-4">
                      <span className="bg-slate-800 text-indigo-300 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        {org.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                        {org.status}
                      </span>
                    </td>
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
