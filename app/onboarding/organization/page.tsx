"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, PlusCircle, CheckCircle2, ArrowRight, Shield, Globe, Users, ArrowLeft } from "lucide-react";
import { getStoredOrganizations, setActiveOrganization, Organization } from "@/lib/org-context";

export default function OrganizationCheckPage() {
  const router = useRouter();
  const [orgState, setOrgState] = useState<"has_org" | "no_org">("has_org");
  const [workspaces, setWorkspaces] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");

  // Form state for Create Organization route
  const [newOrgName, setNewOrgName] = useState("");
  const [industry, setIndustry] = useState("Software & SaaS");
  const [orgSize, setOrgSize] = useState("50-200 employees");

  useEffect(() => {
    const list = getStoredOrganizations();
    setWorkspaces(list);
    if (list.length > 0) {
      setSelectedOrgId(list[0].id);
      setOrgState("has_org");
    } else {
      setOrgState("no_org");
    }
  }, []);

  const handleSelectWorkspace = (org: Organization) => {
    setActiveOrganization(org);
    router.push("/login");
  };

  const handleCreateOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    const slug = newOrgName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "new-org";
    const newOrg: Organization = {
      id: slug,
      name: newOrgName,
      slug: slug,
      role: "Organization Admin",
      industry: industry,
      plan: "Enterprise Tier",
      membersCount: 1,
    };

    setActiveOrganization(newOrg);

    try {
      await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newOrgName, slug }),
      });
    } catch (err) {
      console.warn("Failed to persist organization in PostgreSQL:", err);
    }

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#e4dac9] text-stone-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/25">
          <Building2 className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-black text-stone-900 tracking-tight">ORGANIZATION SELECTION</h2>
        <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
          Step 1: Select or Create Your Company Workspace ➔ Next: Sign In
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white border border-stone-300 py-8 px-6 shadow-xl rounded-3xl sm:px-10 space-y-6">
          {/* Organization Branch Toggle */}
          <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-300">
            <button
              type="button"
              onClick={() => setOrgState("has_org")}
              className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                orgState === "has_org"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Select Existing Organization ({workspaces.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setOrgState("no_org")}
              className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                orgState === "no_org"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create New Organization</span>
            </button>
          </div>

          {/* Branch A: Has Organization (Workspace Selection) */}
          {orgState === "has_org" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Select Active Workspace Tenant
                </h3>
                <span className="text-[10px] text-emerald-800 font-bold uppercase bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {workspaces.length} Workspaces Available
                </span>
              </div>

              {workspaces.length > 0 ? (
                <div className="space-y-3">
                  {workspaces.map((ws) => (
                    <div
                      key={ws.id}
                      onClick={() => handleSelectWorkspace(ws)}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-500 transition cursor-pointer flex items-center justify-between group shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-base group-hover:text-emerald-700 transition">
                            {ws.name}
                          </span>
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-stone-200 text-stone-800 border border-stone-300">
                            {ws.role || "Organization Member"}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 flex items-center gap-3 font-medium">
                          <span>{ws.industry || "Enterprise Workspace"}</span>
                          <span>•</span>
                          <span>{ws.plan || "Enterprise Tier"}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-stone-600">
                            <Users className="h-3 w-3" /> {ws.membersCount || 1} team members
                          </span>
                        </p>
                      </div>

                      <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow">
                        <span>Select Workspace →</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-stone-50 border border-stone-200 rounded-2xl text-center space-y-3">
                  <p className="text-xs text-stone-600 font-bold">No workspaces created yet.</p>
                  <button
                    onClick={() => setOrgState("no_org")}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
                  >
                    Create Your First Organization →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Branch B: No Organization (Create Organization) */}
          {orgState === "no_org" && (
            <form onSubmit={handleCreateOrgSubmit} className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-xs text-indigo-900 font-medium">
                Create your company workspace to provision your tenant database, enable employee logins, and launch the BI-GI Growth Engine.
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Organization / Company Name
                </label>
                <input
                  type="text"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. Acme Corporation, TechCorp, Qubertrix..."
                  required
                  className="block w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-bold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-medium focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Software & SaaS">Software & SaaS</option>
                    <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Healthcare & Biotech">Healthcare & Biotech</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Company Size
                  </label>
                  <select
                    value={orgSize}
                    onChange={(e) => setOrgSize(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-medium focus:outline-none focus:border-indigo-600"
                  >
                    <option value="1-10 employees">1-10 employees</option>
                    <option value="11-50 employees">11-50 employees</option>
                    <option value="50-200 employees">50-200 employees</option>
                    <option value="200+ employees">200+ employees</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition shadow-indigo-600/30"
              >
                <span>Create Organization & Proceed to Sign In →</span>
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs font-bold text-stone-600">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-stone-900">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Landing Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
