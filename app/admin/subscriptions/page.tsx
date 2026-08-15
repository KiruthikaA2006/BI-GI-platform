"use client";

import React from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Header } from "@/components/layout/header";
import { CreditCard, Check, Plus } from "lucide-react";
import { mockSubscriptions } from "@/lib/mock-data";

export default function AdminSubscriptionsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Super Admin — Subscriptions" subtitle="Configure subscription plans, usage quotas, and global pricing tiers" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Subscription Tier Catalog</h2>
              <p className="text-xs text-slate-400">Define feature flags, storage limits, and row count quotas for tenant plans</p>
            </div>
            <button
              onClick={() => alert("Creating new Subscription Tier...")}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create Plan Tier</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockSubscriptions.map((plan) => (
              <div key={plan.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <span className="text-xs font-bold text-emerald-400">{plan.price}</span>
                </div>
                <p className="text-xs text-slate-400">{plan.description}</p>
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  {plan.features.map((f, i) => (
                    <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
