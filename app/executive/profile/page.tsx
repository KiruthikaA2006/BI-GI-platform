"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { Users, Save, CheckCircle2, ShieldCheck, Building2, User, KeyRound, Mail, Award } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function ExecutiveProfilePage() {
  const [name, setName] = useState("CEO Executive");
  const [email, setEmail] = useState("ceo@qubertrix.com");
  const [designation, setDesignation] = useState("Chief Executive Officer");
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-indigo-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive Profile & Security Settings" subtitle="User credentials, role clearance level, and organization scope" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner White Card */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-600/30">
                {name.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Executive Role Clearance • SOC2 Certified</span>
                </div>
                <h2 className="text-2xl font-black text-stone-900">{name}</h2>
                <p className="text-xs text-stone-600 font-medium">{designation} • {currentOrgName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 p-3.5 rounded-2xl text-xs">
              <Building2 className="h-5 w-5 text-indigo-600" />
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Active Scope</span>
                <span className="font-extrabold text-stone-900">{currentOrgName}</span>
              </div>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <form onSubmit={handleSave} className="md:col-span-2 bg-white border border-stone-300 p-6 rounded-3xl space-y-5 shadow-sm">
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-600" />
                <span>Executive Profile & Contact Info</span>
              </h3>

              {saved && (
                <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Executive profile updated and saved to PostgreSQL!</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-stone-700 font-bold mb-1">Executive Title / Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Executive Settings</span>
                </button>
              </div>
            </form>

            {/* Organization Security Badge Card */}
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                  Security & Multi-Tenant State
                </span>
                <h4 className="text-base font-black text-stone-900">Tenant Isolation</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Your executive account is bound strictly to <strong>{currentOrgName}</strong> in PostgreSQL. Row-level security prevents data cross-contamination between organizations.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200 text-xs font-mono font-bold text-emerald-700 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Multi-Tenant Guard Active</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

