"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Building2, Users, CheckCircle2, DollarSign, Award, Target, UserCheck } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function ManagerWorkspacePage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);

    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.users)) {
          setTeamMembers(data.users);
        }
      })
      .catch((err) => console.error("Error fetching team members for manager workspace:", err));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-indigo-500">
      <Sidebar currentRole="DEPARTMENT_MANAGER" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Team Workspace & Capacity Roster" subtitle="Manager Scope: Team Roster, Sales Reps, and Capacity Allocation" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner White Card */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-indigo-700">Manager Scope: Team Workspace</span>
              <h1 className="text-2xl font-black text-stone-900">Sales & Operational Team Roster • {currentOrgName}</h1>
              <p className="text-xs text-stone-600">Manage team capacity, active deals, and sales rep performance for <strong>{currentOrgName}</strong>.</p>
            </div>
            <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200 w-fit flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-indigo-600" /> {teamMembers.length} Team Members Active
            </span>
          </div>

          <div className="bg-white border border-stone-300 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                <span>Active Department Members & Sales Reps</span>
              </h3>
              <span className="text-xs font-mono font-bold text-stone-500">Synced from PostgreSQL Data Records</span>
            </div>

            {teamMembers.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6" />
                </div>
                <h4 className="text-base font-black text-stone-900">No Team Members / Sales Reps Found for {currentOrgName}</h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Upload a dataset containing sales rep records to automatically populate team capacity and roster for <strong>{currentOrgName}</strong>.
                </p>
                <Link
                  href="/data-center"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
                >
                  <span>Import Dataset for {currentOrgName} →</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembers.map((m, idx) => (
                  <div key={m.id || idx} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3.5">
                      <div className="h-11 w-11 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow">
                        {(m.name || "User").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-black text-stone-900 text-sm block">{m.name}</span>
                        <span className="text-xs text-stone-500 font-bold block">{m.role || "Sales Executive"} • {m.email}</span>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full block w-fit ml-auto">
                        Capacity 85%
                      </span>
                      <span className="text-[10px] font-mono font-bold text-stone-500 block">Active Rep</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

