"use client";

import React from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Header } from "@/components/layout/header";
import { AdminFlowNavigator } from "@/components/layout/admin-flow-navigator";
import { Lock, Shield, Key, Eye, CheckCircle2 } from "lucide-react";

export default function AdminDataAccessPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-purple-500">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminFlowNavigator />
        <Header title="Data Access Policies" subtitle="Admin Node: Security Policies, Tenant Data Isolation & Key Vault" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-purple-400">Admin Architecture Node: DATA ACCESS</span>
            <h2 className="text-xl font-black text-white">Tenant Data Access & Row-Level Security</h2>
            <p className="text-xs text-slate-400">Enforces strict organization-level data boundaries, column masking, and AES-256 encryption at rest.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-3 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5" /> Multi-Tenant Row Isolation
              </div>
              <p className="text-xs text-slate-300">
                All SQL queries automatically append <code>WHERE tenant_id = active_tenant</code> filter at the Prisma ORM driver layer.
              </p>
              <span className="text-[10px] font-mono text-emerald-400 block bg-slate-950 p-2 rounded-lg border border-slate-800">
                Status: Enforced & Verified
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-3 text-purple-400 font-bold text-sm">
                <Key className="h-5 w-5" /> Encryption Key Management
              </div>
              <p className="text-xs text-slate-300">
                DB credentials and API keys stored using AWS KMS / HashiCorp Vault Hardware Security Modules.
              </p>
              <span className="text-[10px] font-mono text-purple-400 block bg-slate-950 p-2 rounded-lg border border-slate-800">
                KMS Rotation: Monthly Auto-Rotation
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
