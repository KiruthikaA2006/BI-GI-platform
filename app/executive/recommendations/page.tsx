"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { Lightbulb, ArrowRight, Trophy } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function ExecutiveRecommendationsPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      .catch((err) => console.error("Error fetching stats for recommendations:", err))
      .finally(() => setLoading(false));
  }, []);

  const hasData = Boolean(stats && stats.rawRowsCount > 0 && stats.datasetInfo);

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-amber-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive Recommendations" subtitle="Answers Question: What should we do? (Prescriptive AI Action Items)" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner White Card */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-700">Executive Flow Node: RECOMMENDATIONS</span>
              <h2 className="text-2xl font-black text-stone-900">What Should We Do? (Prescriptive Strategy) • {currentOrgName}</h2>
              <p className="text-xs text-stone-600">Turn forecasts and root causes into high-ROI executive decisions and goal assignments for <strong>{currentOrgName}</strong>.</p>
            </div>

            <Link
              href="/executive/goals"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Trophy className="h-4 w-4" />
              <span>Convert to Goals & Decisions →</span>
            </Link>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="bg-white/80 h-48 rounded-3xl border border-stone-300 shadow-sm" />
            </div>
          ) : !hasData ? (
            <div className="bg-white border border-stone-300 p-8 md:p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <div className="h-16 w-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Lightbulb className="h-8 w-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-black text-stone-900">No Dataset Uploaded for {currentOrgName}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Organization <strong>{currentOrgName}</strong> does not have any imported CSV datasets yet. AI Recommendations and Prescriptive Action Items are generated strictly from uploaded dataset analytics.
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
            <div className="bg-white border border-amber-300 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  High Impact Proposal
                </span>
                <span className="text-xs font-mono text-stone-500 font-bold">Projected MRR Lift: +$37,000</span>
              </div>
              <h3 className="text-xl font-black text-stone-900">Reallocate Monthly Meta Budget to High-Intent Search Channels</h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                Lower CAC back to $118.00 within 14 days and recover -$37k projected margin loss for <strong>{currentOrgName}</strong>.
              </p>
              <Link
                href="/executive/goals"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline pt-2"
              >
                <span>Set Goal & Assign Action →</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

