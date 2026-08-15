"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { History, ShieldCheck, User, Calendar, Terminal } from "lucide-react";
import { mockAuditLogs } from "@/lib/mock-data";

export default function AuditLogsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Audit Logs & Compliance" subtitle="Security event logging, tenant modifications, old vs new JSON values" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Immutable Security Audit Trail</h2>
              <p className="text-xs text-slate-400">Track user actions, configuration updates, dataset imports, and permissions</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Compliance Status: SOC2 Ready</span>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User & Role</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Target Entity</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Payload Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {mockAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/50 transition">
                    <td className="p-4 text-slate-400 text-[11px] font-mono">{log.createdAt}</td>
                    <td className="p-4">
                      <span className="font-bold text-white block">{log.userName}</span>
                      <span className="text-[10px] text-indigo-400">{log.userRole}</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">
                      {log.entity} ({log.entityId})
                    </td>
                    <td className="p-4 font-mono text-slate-400 text-[11px]">{log.ipAddress}</td>
                    <td className="p-4">
                      <details className="cursor-pointer text-slate-400 hover:text-white">
                        <summary className="text-[11px] font-mono underline">View JSON Diff</summary>
                        <div className="mt-2 p-2 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono space-y-1">
                          {log.oldValue && <p className="text-rose-400">- Old: {log.oldValue}</p>}
                          {log.newValue && <p className="text-emerald-400">+ New: {log.newValue}</p>}
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
