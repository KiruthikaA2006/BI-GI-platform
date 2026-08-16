"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Header } from "@/components/layout/header";
import { AdminFlowNavigator } from "@/components/layout/admin-flow-navigator";
import { User, Shield, Key, Save, CheckCircle2 } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function AdminProfilePage() {
  const [name, setName] = useState("Kiruthika Anand");
  const [email, setEmail] = useState("admin@bigi-platform.io");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [role, setRole] = useState("SUPER_ADMIN");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.slug) {
      setEmail(`admin@${org.slug}.com`);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-emerald-500">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminFlowNavigator />
        <Header title="Admin Profile" subtitle="Admin Node: Super Admin Account & Security Settings" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-emerald-800">Admin Architecture Node: PROFILE</span>
              <h2 className="text-xl font-black text-stone-900">Super Admin Credentials & Account Settings</h2>
              <p className="text-xs text-stone-600">Manage administrator details, MFA security tokens, and personal credentials.</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
              <Shield className="h-6 w-6" />
            </div>
          </div>

          <form onSubmit={handleSave} className="bg-white border border-stone-300 p-6 rounded-3xl space-y-6 max-w-2xl shadow-sm text-stone-900">
            {saved && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Admin profile saved successfully!</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Assigned Platform Role</label>
                <input
                  type="text"
                  value="Super Administrator (SUPER_ADMIN)"
                  disabled
                  className="w-full bg-stone-100 border border-stone-300 rounded-xl px-3 py-2.5 text-emerald-800 font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>Update Profile</span>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
