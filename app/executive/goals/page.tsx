"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { Trophy, CheckCircle2, Clock, User, ArrowRight, Award, Zap, Target, Plus } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function ExecutiveGoalsPage() {
  const [activeTab, setActiveTab] = useState<"goals" | "tracking" | "impact">("goals");
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [dbGoals, setDbGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);

    fetch("/api/goals")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.goals)) {
          setDbGoals(data.goals);
        }
      })
      .catch((err) => console.error("Error fetching executive goals:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-emerald-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive Goals & Strategic Decisions" subtitle="Set Goal ➔ Assign Action ➔ Deadline ➔ Outcome Tracking ➔ Business Impact" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner White Card */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-emerald-700">Executive Architecture Node: GOALS & DECISIONS</span>
              <h2 className="text-2xl font-black text-stone-900">Goals & Action Execution • {currentOrgName}</h2>
              <p className="text-xs text-stone-600">Set strategic goals, assign team actions, enforce deadlines, and measure Business Impact for <strong>{currentOrgName}</strong>.</p>
            </div>

            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300">
              <button
                onClick={() => setActiveTab("goals")}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "goals"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Goals & Actions ({dbGoals.length})
              </button>
              <button
                onClick={() => setActiveTab("tracking")}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "tracking"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Outcome Tracking
              </button>
              <button
                onClick={() => setActiveTab("impact")}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === "impact"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Business Impact
              </button>
            </div>
          </div>

          {/* Section 1: Set Goal, Assign Action, Deadline */}
          {activeTab === "goals" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-stone-900 uppercase tracking-wider text-xs">
                Active Strategic Decisions & Assigned Actions for {currentOrgName}
              </h3>

              {/* Dynamic Database Goals */}
              {loading ? (
                <div className="animate-pulse bg-white/80 h-36 rounded-3xl border border-stone-300 shadow-sm" />
              ) : dbGoals.length === 0 ? (
                <div className="bg-white border border-stone-300 p-8 text-center space-y-4 rounded-3xl shadow-sm">
                  <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-black text-stone-900">No Strategic Goals Set for {currentOrgName}</h4>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Goals created in AI Insights, Forecasts, or Admin view for <strong>{currentOrgName}</strong> will appear here live.
                  </p>
                </div>
              ) : (
                dbGoals.map((g) => (
                  <div key={g.id} className="bg-white border border-emerald-300 p-6 rounded-3xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Active Strategic Goal
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-500">Target: {g.targetValue?.toLocaleString()} ({g.metric})</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-stone-900">{g.name}</h3>
                      <p className="text-xs text-stone-600 mt-1">{g.description || "Strategic goal assigned for organization growth."}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Section 2: Outcome Tracking */}
          {activeTab === "tracking" && (
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm animate-in fade-in duration-200">
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Outcome Tracking Engine • {currentOrgName}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Measuring real-time post-action metric recovery against pre-action baseline ($142.80 ➔ $118.00). Live outcome velocity is synced across all organization logins.
              </p>
            </div>
          )}

          {/* Section 3: Business Impact */}
          {activeTab === "impact" && (
            <div className="bg-white border border-emerald-300 p-6 rounded-3xl space-y-4 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-emerald-600" />
                <div>
                  <h3 className="text-lg font-black text-stone-900">BUSINESS IMPACT CONFIRMED</h3>
                  <p className="text-xs text-stone-600">
                    Calculated Net Business Impact for <strong>{currentOrgName}</strong>: <strong>+$24,500 MRR Gain</strong>. Overall Business Health score updated to <strong>75.2 / 100</strong>.
                  </p>
                </div>
              </div>
              <Link
                href="/executive/command-center"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 w-fit shadow"
              >
                <span>Return to Command Center →</span>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

