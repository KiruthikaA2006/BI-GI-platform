"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CreditCard, Check, Zap, ShieldCheck, Download } from "lucide-react";
import { mockSubscriptions } from "@/lib/mock-data";
import { exportToPDF } from "@/lib/export-utils";

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState(mockSubscriptions);

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Billing & Subscriptions" subtitle="Manage tenant tier plans, usage limits, invoices & payment methods" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Active Subscription Banner */}
          <div className="bg-white border border-indigo-300 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Current Active Plan</span>
              <h2 className="text-2xl font-black text-stone-900 flex items-center gap-2">
                <span>Professional Plan</span>
                <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                  Active
                </span>
              </h2>
              <p className="text-xs text-stone-600">Renews on September 1, 2026 • ₹ 14,999 / month</p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Storage Usage</span>
                <span className="text-stone-900 font-black">1.2 GB / 5 GB</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Active Seats</span>
                <span className="text-stone-900 font-black">12 / 25 seats</span>
              </div>
            </div>
          </div>

          {/* Pricing Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white border p-6 rounded-3xl space-y-6 flex flex-col justify-between transition shadow-sm ${
                  plan.isCurrent
                    ? "border-indigo-500 ring-2 ring-indigo-500/20"
                    : "border-stone-300 hover:border-stone-400"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-stone-900">{plan.name}</h3>
                    {plan.isCurrent && (
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                        Current Plan
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-stone-900">{plan.price}</span>
                    <span className="text-xs text-stone-500 font-bold">{plan.period}</span>
                  </div>
                  <p className="text-xs text-stone-600">{plan.description}</p>

                  <div className="pt-4 border-t border-stone-200 space-y-2">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                        <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => alert(`Selected plan: ${plan.name}`)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${
                    plan.isCurrent
                      ? "bg-stone-100 text-stone-500 border border-stone-300 cursor-default"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow"
                  }`}
                >
                  {plan.isCurrent ? "Active Plan" : "Upgrade Plan"}
                </button>
              </div>
            ))}
          </div>

          {/* Billing History */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-base font-black text-stone-900">Billing History & Invoices</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-100 text-stone-600 uppercase text-[10px] border-b border-stone-200 font-bold">
                  <tr>
                    <th className="p-3">Invoice ID</th>
                    <th className="p-3">Billing Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr className="hover:bg-stone-50 transition">
                    <td className="p-3 font-mono font-bold text-stone-900">INV-2026-0801</td>
                    <td className="p-3 text-stone-600">Aug 1, 2026</td>
                    <td className="p-3 font-bold text-stone-900">₹ 14,999</td>
                    <td className="p-3"><span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">PAID</span></td>
                    <td className="p-3 text-right">
                      <button onClick={() => exportToPDF("Invoice_INV-2026-0801")} className="text-indigo-700 font-bold hover:underline">Download PDF</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-stone-50 transition">
                    <td className="p-3 font-mono font-bold text-stone-900">INV-2026-0701</td>
                    <td className="p-3 text-stone-600">Jul 1, 2026</td>
                    <td className="p-3 font-bold text-stone-900">₹ 14,999</td>
                    <td className="p-3"><span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">PAID</span></td>
                    <td className="p-3 text-right">
                      <button onClick={() => exportToPDF("Invoice_INV-2026-0701")} className="text-indigo-700 font-bold hover:underline">Download PDF</button>
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
