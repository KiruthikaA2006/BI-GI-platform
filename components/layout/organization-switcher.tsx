"use client";

import React, { useState, useEffect } from "react";
import { Building2, ChevronDown, Plus, Check, ShieldCheck, Lock } from "lucide-react";
import { getStoredOrganizations, getActiveOrganization, setActiveOrganization, Organization } from "@/lib/org-context";

export function OrganizationSwitcher() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrg, setActiveOrg] = useState<Organization>({
    id: "qubertrix",
    name: "Qubertrix Technologies",
    slug: "qubertrix",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgSlug, setNewOrgSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const list = getStoredOrganizations();
    const current = getActiveOrganization();
    setOrganizations(list);
    setActiveOrg(current);
  }, []);

  const handleSwitchWorkspace = (org: Organization) => {
    setActiveOrganization(org);
    setActiveOrg(org);
    setIsOpen(false);
    window.location.reload();
  };

  const handleCreateOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    setIsSubmitting(true);
    const slug = newOrgSlug || newOrgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newOrg: Organization = {
      id: slug + "-" + Date.now().toString().slice(-4),
      name: newOrgName,
      slug: slug,
      role: "OWNER",
      industry: "Software & SaaS",
      plan: "Enterprise Tier",
    };

    setActiveOrganization(newOrg);
    setOrganizations((prev) => [...prev, newOrg]);
    setActiveOrg(newOrg);
    setNewOrgName("");
    setNewOrgSlug("");
    setShowCreateModal(false);
    setIsSubmitting(false);
    window.location.reload();
  };

  return (
    <div className="relative">
      {/* Switcher Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 rounded-xl px-3.5 py-2 text-xs font-bold shadow-sm transition"
      >
        <Building2 className="h-4 w-4 text-emerald-600" />
        <div className="text-left max-w-[140px]">
          <span className="block truncate font-bold text-stone-900 text-xs">{activeOrg.name}</span>
          <span className="block text-[9px] text-stone-500 font-mono uppercase tracking-wider">{activeOrg.role || "MEMBER"}</span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-stone-500 ml-1" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white border border-stone-300 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
          <div className="px-3 py-1.5 border-b border-stone-200 flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">My Workspaces</span>
            <span className="text-[10px] text-emerald-700 font-bold">Tenant Isolated</span>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {organizations.map((org) => {
              const isActive = activeOrg.id === org.id;
              return (
                <button
                  key={org.id}
                  onClick={() => handleSwitchWorkspace(org)}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition ${
                    isActive ? "bg-emerald-50 text-emerald-800 font-bold" : "hover:bg-stone-50 text-stone-700 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className={`h-3.5 w-3.5 ${isActive ? "text-emerald-600" : "text-stone-400"}`} />
                    <span className="truncate">{org.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-mono">
                      {org.role || "MEMBER"}
                    </span>
                    {isActive && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 px-2 border-t border-stone-200">
            <button
              onClick={() => {
                setShowCreateModal(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Organization</span>
            </button>
          </div>
        </div>
      )}

      {/* Create Organization Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateOrganization}
            className="bg-white border border-stone-300 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-stone-900">Create Organization Workspace</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Creates a new isolated organization workspace for your company. All employees joining will be scoped strictly to this tenant.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
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
                  placeholder="e.g. Acme Corporation, TechCorp..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Organization Slug (URL identifier)
                </label>
                <input
                  type="text"
                  required
                  value={newOrgSlug}
                  onChange={(e) => setNewOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  placeholder="e.g. acme-corp"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-mono text-emerald-800 font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="bg-stone-100 text-stone-700 px-4 py-2 rounded-xl text-xs font-bold border border-stone-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition"
              >
                {isSubmitting ? "Creating..." : "Create Organization"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
