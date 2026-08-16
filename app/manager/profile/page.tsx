"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { User, Save, CheckCircle2, ShieldCheck, Building2 } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function ManagerProfilePage() {
  const [name, setName] = useState("Sales Department Manager");
  const [email, setEmail] = useState("manager@qubertrix.com");
  const [department, setDepartment] = useState("Sales & Marketing");
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
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-blue-500">
      <Sidebar currentRole="DEPARTMENT_MANAGER" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Manager Profile & Security Settings" subtitle="Account credentials, department scope, and security settings" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner White Card */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-600/30">
                {name.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Department Manager Clearance Level</span>
                </div>
                <h2 className="text-2xl font-black text-stone-900">{name}</h2>
                <p className="text-xs text-stone-600 font-medium">{department} • {currentOrgName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 p-3.5 rounded-2xl text-xs">
              <Building2 className="h-5 w-5 text-blue-600" />
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
                <User className="h-4 w-4 text-blue-600" />
                <span>Manager Profile & Contact Information</span>
              </h3>

              {saved && (
                <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Manager profile updated and saved!</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-stone-700 font-bold mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Manager Profile</span>
                </button>
              </div>
            </form>

            {/* Tenant Security Card */}
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Tenant Isolation Active
                </span>
                <h4 className="text-base font-black text-stone-900">Organization Guard</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Your Department Manager account is bound strictly to <strong>{currentOrgName}</strong>. Data telemetry and team rosters are isolated per organization.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200 text-xs font-mono font-bold text-emerald-700 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Row Level Multi-Tenant Guard Active</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

