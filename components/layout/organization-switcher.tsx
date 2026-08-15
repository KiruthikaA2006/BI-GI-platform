"use client";

import React, { useState, useEffect } from "react";
import { Building2, ChevronDown, Plus, Check, ShieldCheck, Lock } from "lucide-react";

export interface OrganizationItem {
  id: string;
  name: string;
  slug: string;
  role: string;
}

export function OrganizationSwitcher() {
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([
    { id: "org_qubertrix_01", name: "Qubertrix Technologies", slug: "qubertrix", role: "OWNER" },
    { id: "org_acme_02", name: "Acme Enterprise Corp", slug: "acme-enterprise", role: "MEMBER" },
  ]);
  const [activeOrg, setActiveOrg] = useState<OrganizationItem>(organizations[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgSlug, setNewOrgSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMyOrganizations = async () => {
    try {
      const res = await fetch("/api/organizations");
      const data = await res.json();
      if (data.success && data.organizations.length > 0) {
        setOrganizations(data.organizations);
        setActiveOrg(data.organizations[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMyOrganizations();
  }, []);

  const handleSwitchWorkspace = async (org: OrganizationItem) => {
    try {
      const res = await fetch("/api/organizations/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: org.id }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveOrg(org);
        setIsOpen(false);
      } else {
        alert("Workspace Switch Denied: " + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName || !newOrgSlug) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newOrgName, slug: newOrgSlug }),
      });
      const data = await res.json();

      if (data.success) {
        setOrganizations((prev) => [...prev, data.organization]);
        setActiveOrg(data.organization);
        setNewOrgName("");
        setNewOrgSlug("");
        setShowCreateModal(false);
        setIsOpen(false);
      } else {
        alert("Failed to create organization: " + data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Switcher Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-sm transition"
      >
        <Building2 className="h-4 w-4 text-emerald-400" />
        <div className="text-left max-w-[140px]">
          <span className="block truncate font-bold text-white text-xs">{activeOrg.name}</span>
          <span className="block text-[9px] text-slate-400 font-mono uppercase tracking-wider">{activeOrg.role}</span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in">
          <div className="px-3 py-1.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Workspaces</span>
            <span className="text-[10px] text-emerald-400 font-semibold">Tenant Isolated</span>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {organizations.map((org) => {
              const isActive = activeOrg.id === org.id;
              return (
                <button
                  key={org.id}
                  onClick={() => handleSwitchWorkspace(org)}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition ${
                    isActive ? "bg-emerald-600/20 text-emerald-300 font-semibold" : "hover:bg-slate-800 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className={`h-3.5 w-3.5 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                    <span className="truncate">{org.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                      {org.role}
                    </span>
                    {isActive && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 px-2 border-t border-slate-800">
            <button
              onClick={() => {
                setShowCreateModal(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-emerald-950/40 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Organization</span>
            </button>
          </div>
        </div>
      )}

      {/* Create Organization Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateOrganization}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Create Organization Workspace</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Creates a new isolated PostgreSQL organization. Executed inside an atomic database transaction assigning you as <strong className="text-emerald-400">OWNER</strong>.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => {
                    setNewOrgName(e.target.value);
                    setNewOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                  }}
                  placeholder="e.g. Acme Corporation"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Organization Slug (URL identifier)
                </label>
                <input
                  type="text"
                  required
                  value={newOrgSlug}
                  onChange={(e) => setNewOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  placeholder="e.g. acme-corp"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30 transition"
              >
                {isSubmitting ? "Executing Transaction..." : "Create Organization"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
