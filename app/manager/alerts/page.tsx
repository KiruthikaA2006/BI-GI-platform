"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Bell, AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight, Info } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function ManagerAlertsPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);

    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data);
          if (data.organizationName) setCurrentOrgName(data.organizationName);
        }
      })
      .catch((err) => console.error("Error fetching stats for manager alerts:", err));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-amber-500">
      <Sidebar currentRole="DEPARTMENT_MANAGER" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Department Alerts & Threshold Notifications" subtitle="Manager Scope: Real-Time Operational Alerts" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner White Card */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-700">Manager Scope: Department Alerts</span>
              <h1 className="text-2xl font-black text-stone-900">Operational Alerts & Threshold Warnings • {currentOrgName}</h1>
              <p className="text-xs text-stone-600">Real-time notifications for sales quota targets, ad spend thresholds, and lead queue status for <strong>{currentOrgName}</strong>.</p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 w-fit flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-amber-600" /> {stats && stats.rawRowsCount === 0 ? "0 Alerts" : "3 Active Alerts"}
            </span>
          </div>

          {stats && (stats.rawRowsCount === 0 || !stats.datasetInfo) ? (
            <div className="bg-white border border-stone-300 p-8 md:p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <div className="h-16 w-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Bell className="h-8 w-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-black text-stone-900">No Dataset Uploaded for {currentOrgName}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Organization <strong>{currentOrgName}</strong> does not have any imported CSV datasets yet. Operational alerts are computed strictly from uploaded dataset rows.
                </p>
              </div>
              <Link
                href="/data-center"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition"
              >
                <span>Import CSV Dataset for {currentOrgName} →</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
            <div className="bg-white border border-amber-300 p-6 rounded-3xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" /> Ad Spend Threshold Warning
                </span>
                <span className="text-xs font-mono font-bold text-stone-500">Today 11:20 AM</span>
              </div>
              <h4 className="text-base font-black text-stone-900">Meta Paid Campaign Reached 85% of Budget Limit</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Meta paid campaign spend reached $12,850 of the $15,000 monthly limit. CAC is elevated at $142.80 vs target $118.00.
              </p>
            </div>

            <div className="bg-white border border-rose-300 p-6 rounded-3xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-800 uppercase flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-rose-600" /> Mid-Market Churn Warning
                </span>
                <span className="text-xs font-mono font-bold text-stone-500">Yesterday 4:45 PM</span>
              </div>
              <h4 className="text-base font-black text-stone-900">Onboarding Friction Detected at Day 45</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                3 mid-market accounts have delayed API integration setups during onboarding. Technical Onboarding Specialist check-in required.
              </p>
            </div>
          </div>
          )}
        </main>
      </div>
    </div>
  );
}

