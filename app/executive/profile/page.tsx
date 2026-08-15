"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { Users, Save, CheckCircle2 } from "lucide-react";

export default function ExecutiveProfilePage() {
  const [name, setName] = useState("CEO Executive");
  const [email, setEmail] = useState("ceo@qubertrix.com");
  const [saved, setSaved] = useState(false);

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
        <Header title="Executive Profile" subtitle="Executive Node: Profile & Preferences" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-indigo-400">Executive Flow Node: PROFILE</span>
            <h2 className="text-xl font-black text-white">Executive Profile Settings</h2>
          </div>

          <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 max-w-xl">
            {saved && (
              <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-2xl flex items-center gap-2 text-xs text-emerald-300 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Executive profile updated successfully!</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Profile</span>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
