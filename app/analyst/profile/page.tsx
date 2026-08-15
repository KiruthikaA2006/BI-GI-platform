"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { User, Save, CheckCircle2 } from "lucide-react";

export default function AnalystProfilePage() {
  const [name, setName] = useState("Senior Data Analyst");
  const [email, setEmail] = useState("analyst@qubertrix.com");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-cyan-500">
      <Sidebar currentRole="ANALYST" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Analyst Profile" subtitle="Analyst Scope: Account Profile Settings" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-cyan-600">Analyst Scope: Profile</span>
            <h1 className="text-2xl font-black text-stone-900">Analyst Profile Settings</h1>
          </div>

          <form onSubmit={handleSave} className="bg-white border border-stone-200 p-6 rounded-3xl space-y-4 max-w-xl shadow-sm">
            {saved && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Analyst profile saved successfully!</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition flex items-center gap-2"
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
