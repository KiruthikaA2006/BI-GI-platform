"use client";

import React, { useState, useEffect } from "react";
import { Building2, ShieldCheck } from "lucide-react";
import { getActiveOrganization, Organization } from "@/lib/org-context";

export function OrganizationSwitcher() {
  const [activeOrg, setActiveOrg] = useState<Organization>({
    id: "acme",
    name: "Acme Corporation",
    slug: "acme",
    role: "Organization Admin",
  });

  useEffect(() => {
    const current = getActiveOrganization();
    if (current) {
      setActiveOrg(current);
    }
  }, []);

  return (
    <div className="flex items-center gap-2.5 bg-white border border-stone-300 text-stone-800 rounded-xl px-3.5 py-2 text-xs font-bold shadow-sm">
      <Building2 className="h-4 w-4 text-emerald-600" />
      <div className="text-left max-w-[200px]">
        <span className="block truncate font-bold text-stone-900 text-xs">{activeOrg.name}</span>
        <span className="block text-[9px] text-stone-500 font-mono uppercase tracking-wider">
          {activeOrg.role || "Active Tenant"}
        </span>
      </div>
      <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
        <ShieldCheck className="h-3 w-3 text-emerald-600" />
        <span className="hidden sm:inline">Active</span>
      </div>
    </div>
  );
}
