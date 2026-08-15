"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Trophy, Plus, Calendar, User, ArrowUpRight } from "lucide-react";
import { mockGoals } from "@/lib/mock-data";

export default function GoalsPage() {
  const [goals, setGoals] = useState(mockGoals);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Strategic Goals" subtitle="Target progress %, deadline tracking & milestone completion" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Company & Department Goals</h2>
              <p className="text-xs text-slate-400">Track key milestones, progress percentages, and deadlines</p>
            </div>
            <button
              onClick={() => alert("Goal Creation Dialog...")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Define New Goal</span>
            </button>
          </div>

          {/* Goals List */}
          <div className="space-y-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl space-y-4 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{goal.name}</h3>
                      <p className="text-xs text-slate-400">{goal.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-slate-400">
                    <div>
                      <span className="block text-[10px] uppercase text-slate-500 font-semibold">Owner</span>
                      <span className="text-white font-semibold">{goal.owner}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-slate-500 font-semibold">Target</span>
                      <span className="text-white font-bold">
                        {goal.metric === "Revenue" ? `₹ ${(goal.targetValue / 100000).toFixed(1)}L` : goal.targetValue}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-slate-500 font-semibold">Deadline</span>
                      <span className="text-indigo-400 font-medium">{goal.endDate}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Progress: <strong className="text-white">{goal.progress}%</strong></span>
                    <span className="text-slate-400">
                      Current: <strong className="text-emerald-400">{goal.metric === "Revenue" ? `₹ ${(goal.currentValue / 100000).toFixed(1)}L` : goal.currentValue}</strong>
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        goal.progress >= 70
                          ? "bg-gradient-to-r from-indigo-500 to-emerald-400"
                          : "bg-gradient-to-r from-amber-500 to-rose-500"
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
