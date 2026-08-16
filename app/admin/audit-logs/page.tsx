"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Header } from "@/components/layout/header";
import { History, ShieldCheck, Download, Filter, Terminal, User } from "lucide-react";
import { exportToCSV, exportAuditLogsToPDF } from "@/lib/export-utils";
import { AdminFlowNavigator } from "@/components/layout/admin-flow-navigator";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit-logs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      })
      .catch((err) => console.error("Error fetching admin audit logs:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredLogs = logs.filter(
    (log) => roleFilter === "ALL" || (log.userRole && log.userRole.toUpperCase() === roleFilter)
  );

  const handleExportCSV = () => {
    exportToCSV("global_platform_audit_logs", filteredLogs);
  };

  const handleExportPDF = () => {
    exportAuditLogsToPDF("Global Platform (Super Admin)", filteredLogs);
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
              <span className="text-[10px] font-extrabold uppercase text-emerald-800">Super Admin Scope • Global Compliance</span>
              <h2 className="text-xl font-black text-stone-900">Global Platform Audit Trail</h2>
              <p className="text-xs text-stone-600">Security event logs, tenant modifications, and administrative payload deltas</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF Audit Report</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>

              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Logging Active</span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white border border-stone-300 p-4 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-stone-400" />
              <span className="text-xs font-bold text-stone-700">Filter by User Role:</span>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-xl px-3 py-1.5 outline-none font-bold"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ORGANIZATION_ADMIN">Organization Admin</option>
              <option value="EXECUTIVE">Executive</option>
              <option value="DEPARTMENT_MANAGER">Department Manager</option>
              <option value="ANALYST">Analyst</option>
            </select>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white border border-stone-300 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-100 text-stone-700 uppercase text-[10px] tracking-wider border-b border-stone-200 font-bold">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Target Entity</th>
                    <th className="p-4">IP Address</th>
                    <th className="p-4">State Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-xs text-stone-500 font-medium">
                        Loading real platform audit logs...
                      </td>
                    </tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-xs text-stone-500 font-medium">
                        No audit log events found for selected role.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50 transition font-mono text-[11px]">
                        <td className="p-4 text-stone-500 whitespace-nowrap">{log.timestamp}</td>
                        <td className="p-4 font-sans">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-stone-400" />
                            <div>
                              <span className="font-bold text-stone-900 block">{log.userName}</span>
                              <span className="text-[10px] text-stone-500 font-mono">{log.userRole}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-stone-100 text-stone-900 font-bold px-2 py-0.5 rounded border border-stone-300">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4 font-sans text-stone-800">{log.entity}</td>
                        <td className="p-4 text-stone-500">{log.ipAddress}</td>
                        <td className="p-4 max-w-xs truncate text-stone-600" title={log.newValue || log.details}>
                          {log.newValue || log.details || "N/A"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
