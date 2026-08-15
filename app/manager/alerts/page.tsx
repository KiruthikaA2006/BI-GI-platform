"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Bell, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ManagerAlertsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-amber-500">
      <Sidebar currentRole="DEPARTMENT_MANAGER" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Alerts & Notifications" subtitle="Manager Login Scope: Operational Alerts & Threshold Warnings" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-amber-600">Manager Scope: Department Alerts</span>
            <h1 className="text-2xl font-black text-stone-900">Active Department Notifications</h1>
            <p className="text-xs text-stone-500">Real-time alerts for sales quota targets, ad spend thresholds, and lead queue status.</p>
          </div>

          <div className="space-y-3">
            <div className="bg-white border border-amber-200 p-5 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> Ad Spend Threshold Warning
                </span>
                <span className="text-[10px] text-stone-500 font-mono">Today 11:20</span>
              </div>
              <p className="text-xs text-stone-700">
                Meta paid campaign spend reached 85% of monthly allocated budget ($12.8k of $15k limit).
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
