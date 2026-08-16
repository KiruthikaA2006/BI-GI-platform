"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  Target,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Zap,
  Activity,
  Plus,
  Building2,
  CheckCircle,
} from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export interface GoalItem {
  id: string;
  name: string;
  description?: string;
  metric: string;
  targetValue: number;
  currentValue: number;
  status: string;
  createdAt: string;
}

export default function GoalsAndActionsPage() {
  const [activeTab, setActiveTab] = useState<"goals" | "execution" | "outcomes">("goals");
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [dbGoals, setDbGoals] = useState<GoalItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [goalName, setGoalName] = useState("");
  const [goalMetric, setGoalMetric] = useState("Monthly Recurring Revenue ($)");
  const [goalTarget, setGoalTarget] = useState("100000");

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals");
      const data = await res.json();
      if (data.success && Array.isArray(data.goals)) {
        setDbGoals(data.goals);
      }
    } catch (err) {
      console.warn("Failed to fetch goals from /api/goals:", err);
    }
  };

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: goalName,
          metric: goalMetric,
          targetValue: Number(goalTarget),
          currentValue: 0,
        }),
      });
      setShowCreateModal(false);
      setGoalName("");
      fetchGoals();
    } catch (err) {
      console.error("Error creating goal:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#e4dac9] text-stone-900 overflow-hidden selection:bg-emerald-500">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Goals, Execution & Outcome Tracking" subtitle="Intelligence Loop Final Stages: Goals ➔ Action Execution ➔ Outcome Tracking" />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <Target className="h-3.5 w-3.5" />
                <span>Execution Flywheel • {currentOrgName}</span>
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                Goals, Action Execution & Outcome Tracking
              </h1>
              <p className="text-xs text-stone-600 max-w-xl">
                Assign actions, set targets derived from AI recommendations & forecasts, monitor live execution, and measure post-action business outcomes for <strong>{currentOrgName}</strong>.
              </p>
            </div>

            {/* Action Buttons & Tab Switcher */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Create Organization Goal</span>
              </button>

              <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300">
                <button
                  onClick={() => setActiveTab("goals")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                    activeTab === "goals"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Goals & Actions ({dbGoals.length + 1})
                </button>
                <button
                  onClick={() => setActiveTab("execution")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                    activeTab === "execution"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Execution Hub
                </button>
                <button
                  onClick={() => setActiveTab("outcomes")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                    activeTab === "outcomes"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Outcome Flywheel
                </button>
              </div>
            </div>
          </div>

          {/* Goals Tab */}
          {activeTab === "goals" && (
            <div className="space-y-4">
              {dbGoals.length === 0 ? (
                <div className="bg-white border border-stone-300 p-8 text-center space-y-4 rounded-3xl shadow-sm">
                  <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Target className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-black text-stone-900">No Organization Goals Set for {currentOrgName}</h4>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Goals created in AI Insights, Recommendations, or Forecasting for <strong>{currentOrgName}</strong> will appear here live.
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Goal for {currentOrgName} →</span>
                  </button>
                </div>
              ) : (
                dbGoals.map((g) => (
                  <div key={g.id} className="bg-white border border-emerald-300 p-6 rounded-3xl space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Active AI Goal • {currentOrgName}
                      </span>
                      <span className="text-xs font-mono text-stone-500 font-bold">Target: {g.targetValue?.toLocaleString()} ({g.metric})</span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900">{g.name}</h3>
                    <p className="text-xs text-stone-600">{g.description || "Created from AI Insights & Predictive Forecast scenarios."}</p>
                    <div className="pt-2 flex items-center justify-between border-t border-stone-200 text-xs text-stone-600">
                      <span>Status: Tracked Active</span>
                      <button onClick={() => setActiveTab("outcomes")} className="text-emerald-700 font-bold hover:underline">
                        Track Outcome Progress →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Execution Hub Tab */}
          {activeTab === "execution" && (
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900">Live Action Task Execution</h3>
              <p className="text-xs text-stone-600">Real-time status of assigned team tasks for <strong>{currentOrgName}</strong>.</p>
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <span>1. Reallocate ad budget to high-performing channels</span>
                  <span className="text-emerald-700 font-bold">Completed</span>
                </div>
                <div className="flex items-center justify-between text-stone-700 font-medium">
                  <span>2. Deploy Retargeting Pixel and Optimize Lead Capture</span>
                  <span className="text-amber-700 font-bold">In Progress (80%)</span>
                </div>
              </div>
            </div>
          )}

          {/* Outcomes Tab */}
          {activeTab === "outcomes" && (
            <div className="bg-white border border-emerald-300 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Outcome Flywheel: Fed back into Business Health Scorecard!</span>
              </div>
              <p className="text-xs text-stone-600">
                Action execution lowered CAC to $119.50, driving +$37k MRR expansion and boosting Business Health Score to 75.2/100.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow"
              >
                <span>Return to Main Dashboard →</span>
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* CREATE GOAL MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateGoal}
            className="bg-white border border-stone-300 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-900">Create New Goal for {currentOrgName}</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-600 text-xs">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reach $300K MRR by Q4"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Target Metric</label>
                <input
                  type="text"
                  value={goalMetric}
                  onChange={(e) => setGoalMetric(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Target Value</label>
                <input
                  type="number"
                  required
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
              <button type="button" onClick={() => setShowCreateModal(false)} className="bg-stone-100 border border-stone-300 px-4 py-2 rounded-xl text-xs font-semibold text-stone-700">Cancel</button>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30">Save Organization Goal</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

