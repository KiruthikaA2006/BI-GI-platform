"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Header } from "@/components/layout/header";
import { History, ShieldCheck, Download, Filter } from "lucide-react";
import { mockAuditLogs } from "@/lib/mock-data";
import { exportToCSV } from "@/lib/export-utils";
import { AdminFlowNavigator } from "@/components/layout/admin-flow-navigator";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState(mockAuditLogs);
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filteredLogs = logs.filter(
    (log) => roleFilter === "ALL" || log.userRole.toUpperCase() === roleFilter
  );

  const handleExportCSV = () => {
    exportToCSV("global_platform_audit_logs", filteredLogs);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminFlowNavigator />
        <Header title="Super Admin — Platform Audit Logs" subtitle="Global security events, system administration changes & API accesses" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-300 p-6 rounded-3xl shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-700">Super Admin Scope • Global Compliance</span>
              <h2 className="text-xl font-black text-stone-900">Global Platform Audit Trail</h2>
              <p className="text-xs text-stone-500">Security event logs, tenant modifications, and administrative payload deltas</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>Export Global Audit CSV</span>
              </button>

              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Logging Active</span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white border border-stone-300 p-4 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-bold text-stone-700">
              <Filter className="h-4 w-4 text-stone-500" />
              <span>Role Filter:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 text-stone-900 rounded-xl px-3 py-1.5 font-bold"
              >
                <option value="ALL">All System Roles</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="ORGANIZATION_ADMIN">ORGANIZATION_ADMIN</option>
                <option value="EXECUTIVE">EXECUTIVE</option>
                <option value="DEPARTMENT_MANAGER">DEPARTMENT_MANAGER</option>
                <option value="ANALYST">ANALYST</option>
              </select>
            </div>
            <span className="text-xs font-bold text-stone-500">
              Showing {filteredLogs.length} of {logs.length} System Logs
            </span>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white border border-stone-300 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-100 text-stone-600 uppercase text-[10px] tracking-wider border-b border-stone-200 font-bold">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User & Role</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Target Entity</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Payload Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50 transition">
                    <td className="p-4 text-stone-500 text-[11px] font-mono">{log.createdAt}</td>
                    <td className="p-4">
                      <span className="font-bold text-stone-900 block">{log.userName}</span>
                      <span className="text-[10px] text-emerald-700 font-bold">{log.userRole}</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-stone-800 font-medium">
                      {log.entity} ({log.entityId})
                    </td>
                    <td className="p-4 font-mono text-stone-500 text-[11px]">{log.ipAddress}</td>
                    <td className="p-4">
                      <details className="cursor-pointer text-stone-600 hover:text-stone-900">
                        <summary className="text-[11px] font-mono underline font-bold">View JSON Diff</summary>
                        <div className="mt-2 p-2 bg-stone-50 rounded-xl border border-stone-200 text-[10px] font-mono space-y-1">
                          {log.oldValue && <p className="text-rose-600 font-semibold">- Old: {log.oldValue}</p>}
                          {log.newValue && <p className="text-emerald-700 font-semibold">+ New: {log.newValue}</p>}
                        </div>
                      </details>
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
