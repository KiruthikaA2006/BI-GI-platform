"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CreditCard, Check, Zap, ShieldCheck, Download } from "lucide-react";
import { mockSubscriptions } from "@/lib/mock-data";

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState(mockSubscriptions);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Billing & Subscriptions" subtitle="Manage tenant tier plans, usage limits, invoices & payment methods" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Active Subscription Banner */}
          <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Current Plan</span>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>Professional Plan</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">Renews on September 1, 2026 • ₹ 14,999 / month</p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Storage Usage</span>
                <span className="text-white font-bold">1.2 GB / 5 GB</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Active Users</span>
                <span className="text-white font-bold">12 / 25 seats</span>
              </div>
            </div>
          </div>

          {/* Pricing Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-slate-900 border p-6 rounded-2xl space-y-6 flex flex-col justify-between transition ${
                  plan.isCurrent
                    ? "border-indigo-500 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-500"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    {plan.isCurrent && (
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                        Current Plan
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400">{plan.period}</span>
                  </div>
                  <p className="text-xs text-slate-400">{plan.description}</p>

                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => alert(`Selected plan: ${plan.name}`)}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition ${
                    plan.isCurrent
                      ? "bg-slate-800 text-slate-300 cursor-default"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                  }`}
                >
                  {plan.isCurrent ? "Active Plan" : "Upgrade Plan"}
                </button>
              </div>
            ))}
          </div>

          {/* Billing History */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Billing History & Invoices</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Invoice ID</th>
                    <th className="p-3">Billing Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-white">INV-2026-0801</td>
                    <td className="p-3 text-slate-400">Aug 1, 2026</td>
                    <td className="p-3 font-bold text-white">₹ 14,999</td>
                    <td className="p-3"><span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">PAID</span></td>
                    <td className="p-3 text-right">
                      <button onClick={() => alert("Downloading Invoice PDF...")} className="text-indigo-400 hover:underline">Download PDF</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-white">INV-2026-0701</td>
                    <td className="p-3 text-slate-400">Jul 1, 2026</td>
                    <td className="p-3 font-bold text-white">₹ 14,999</td>
                    <td className="p-3"><span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">PAID</span></td>
                    <td className="p-3 text-right">
                      <button onClick={() => alert("Downloading Invoice PDF...")} className="text-indigo-400 hover:underline">Download PDF</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
