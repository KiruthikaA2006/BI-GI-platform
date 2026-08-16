"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { History, ShieldCheck, User, Calendar, Terminal, Download, Filter } from "lucide-react";
import { exportToCSV } from "@/lib/export-utils";
import { getActiveOrganization } from "@/lib/org-context";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);

    fetch("/api/audit-logs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      })
      .catch((err) => console.error("Error fetching audit logs:", err));
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesRole = roleFilter === "ALL" || (log.userRole && log.userRole.toUpperCase() === roleFilter);
    const matchesAction = actionFilter === "ALL" || (log.action && log.action.toUpperCase() === actionFilter);
    return matchesRole && matchesAction;
  });

  const handleExportCSV = () => {
    exportToCSV(`security_audit_logs_${currentOrgName.toLowerCase().replace(/\s+/g, "_")}`, filteredLogs);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Audit Logs & Compliance" subtitle="Security event logging, tenant modifications, old vs new JSON values" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-300 p-6 rounded-3xl shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-700">Organization Scope • Compliance</span>
              <h2 className="text-xl font-black text-stone-900">Immutable Security Audit Trail</h2>
              <p className="text-xs text-stone-500">Track user actions, configuration updates, dataset imports, and permissions</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>Export Audit CSV</span>
              </button>

              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>SOC2 Ready</span>
              </div>
            </div>
          </div>

          {/* Interactive Filters Bar */}
          <div className="bg-white border border-stone-300 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                <Filter className="h-4 w-4 text-stone-500" />
                <span>Filter Logs:</span>
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 text-stone-800 rounded-xl px-3 py-1.5 text-xs font-semibold"
              >
                <option value="ALL">All Roles</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="ORGANIZATION_ADMIN">ORGANIZATION_ADMIN</option>
                <option value="EXECUTIVE">EXECUTIVE</option>
                <option value="DEPARTMENT_MANAGER">DEPARTMENT_MANAGER</option>
                <option value="ANALYST">ANALYST</option>
              </select>

              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 text-stone-800 rounded-xl px-3 py-1.5 text-xs font-semibold"
              >
                <option value="ALL">All Actions</option>
                <option value="UPDATE_ROLE">UPDATE_ROLE</option>
                <option value="CREATE_USER">CREATE_USER</option>
                <option value="IMPORT_DATASET">IMPORT_DATASET</option>
                <option value="DEACTIVATE_USER">DEACTIVATE_USER</option>
              </select>
            </div>

            <span className="text-xs font-bold text-stone-500">
              Showing {filteredLogs.length} of {logs.length} Log Entries
            </span>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white border border-stone-300 rounded-3xl overflow-hidden shadow-sm">
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <History className="h-10 w-10 text-stone-400 mx-auto" />
                <h4 className="text-base font-bold text-stone-900">No Audit Logs Recorded Yet</h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Security events, role assignments, dataset imports, and configuration updates for <span className="font-semibold text-stone-800">{currentOrgName}</span> will be recorded here in real-time.
                </p>
              </div>
            ) : (
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
                        <span className="text-[10px] text-indigo-600 font-bold">{log.userRole}</span>
                      </td>
                      <td className="p-4">
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
