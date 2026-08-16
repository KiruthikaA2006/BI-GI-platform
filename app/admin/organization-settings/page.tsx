"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Header } from "@/components/layout/header";
import { AdminFlowNavigator } from "@/components/layout/admin-flow-navigator";
import { Settings, Shield, Globe, Lock, Save, CheckCircle2 } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function AdminOrgSettingsPage() {
  const [orgName, setOrgName] = useState("Organization Workspace");
  const [domain, setDomain] = useState("organization.com");
  const [ssoEnforced, setSsoEnforced] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const active = getActiveOrganization();
    if (active) {
      if (active.name) setOrgName(active.name);
      if (active.slug) setDomain(`${active.slug}.com`);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-amber-500">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminFlowNavigator />
        <Header title="Organization Settings" subtitle="Admin Node: Configuration, Preferences & Security Settings" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-1 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-amber-800">Admin Architecture Node: ORG SETTINGS</span>
            <h2 className="text-xl font-black text-stone-900">Tenant Configuration & Security Parameters</h2>
            <p className="text-xs text-stone-600">Manage tenant identity, custom domain mapping, SSO SAML parameters, and security policies.</p>
          </div>

          <form onSubmit={handleSave} className="bg-white border border-stone-300 p-6 rounded-3xl space-y-6 max-w-3xl shadow-sm text-stone-900">
            {saved && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Organization settings updated successfully!</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-2">
                1. General Configuration
              </h3>
              <div>
                <label className="block text-stone-700 font-bold mb-1">Organization Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Primary Custom Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-medium"
                />
              </div>

              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-2 pt-4">
                2. Security & Single Sign-On (SSO)
              </h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 border border-stone-300">
                <div>
                  <span className="font-bold text-stone-900 block">Enforce Single Sign-On (SSO)</span>
                  <span className="text-stone-500 block text-[11px]">Require SAML 2.0 / OAuth for all tenant users</span>
                </div>
                <input
                  type="checkbox"
                  checked={ssoEnforced}
                  onChange={(e) => setSsoEnforced(e.target.checked)}
                  className="h-5 w-5 accent-amber-600"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Inactivity Session Timeout (Minutes)</label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-900 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Configuration</span>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
