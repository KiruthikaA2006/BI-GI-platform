"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Trophy, CheckCircle2, Target, Plus, Clock, User, Award } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function ManagerGoalsPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [goals, setGoals] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [goalName, setGoalName] = useState("");
  const [metricName, setMetricName] = useState("Sales Conversion");
  const [targetValue, setTargetValue] = useState("");
  const [assignedTo, setAssignedTo] = useState("Sales Department Team");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchGoals = () => {
    fetch("/api/goals")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.goals)) {
          setGoals(data.goals);
        }
      })
      .catch((err) => console.error("Error fetching manager goals:", err));
  };

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !targetValue) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: goalName,
          metric: metricName,
          targetValue: Number(targetValue),
          currentValue: "0",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo,
          description,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setGoalName("");
        setTargetValue("");
        setDescription("");
        fetchGoals();
      }
    } catch (err) {
      console.error("Error creating goal:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-amber-500">
      <Sidebar currentRole="DEPARTMENT_MANAGER" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Department Goals & Milestones" subtitle="Manager Scope: Operational Target Metrics & Goal Assignments" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner White Card */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-700">Manager Scope: Department Goals</span>
              <h1 className="text-2xl font-black text-stone-900">Q3 Department Operational Growth Targets • {currentOrgName}</h1>
              <p className="text-xs text-stone-600">Target metrics assigned to Sales & Marketing team members for <strong>{currentOrgName}</strong>.</p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition flex items-center gap-2 w-fit"
            >
              <Plus className="h-4 w-4" />
              <span>Set New Department Goal</span>
            </button>
          </div>

          {/* Goals List */}
          <div className="space-y-4">
            {goals.length === 0 ? (
              <div className="bg-white border border-stone-300 p-8 md:p-12 rounded-3xl text-center space-y-4 shadow-sm">
                <div className="h-16 w-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Trophy className="h-8 w-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-xl font-black text-stone-900">No Department Goals Set for {currentOrgName}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Goal targets and milestones are strictly isolated per organization for <strong>{currentOrgName}</strong>. Click below to add a new department target.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Set Goal for {currentOrgName} →</span>
                </button>
              </div>
            ) : (
              goals.map((g) => (
                <div key={g.id} className="bg-white border border-amber-300 p-6 rounded-3xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" /> Active Department Target
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-500">Target: {g.targetValue?.toLocaleString()} ({g.metric})</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-stone-900">{g.name}</h3>
                    <p className="text-xs text-stone-600 mt-1">{g.description || "Operational goal set for department growth."}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal Form for Creating Goals */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
              <div className="bg-white border border-stone-300 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-600" />
                    <span>Set New Department Goal</span>
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-900 font-bold text-sm">✕</button>
                </div>

                <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Goal Name / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Increase Monthly Closed Deals to 1,600"
                      value={goalName}
                      onChange={(e) => setGoalName(e.target.value)}
                      required
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Target Metric</label>
                      <input
                        type="text"
                        value={metricName}
                        onChange={(e) => setMetricName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Target Value</label>
                      <input
                        type="number"
                        placeholder="1600"
                        value={targetValue}
                        onChange={(e) => setTargetValue(e.target.value)}
                        required
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Assigned Team / Member</label>
                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Objective Description</label>
                    <textarea
                      placeholder="Describe target outcome and operational strategy..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-bold"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow transition"
                    >
                      {isSubmitting ? "Saving..." : "Save Goal to PostgreSQL"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

