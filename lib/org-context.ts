"use client";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  role?: string;
  industry?: string;
  plan?: string;
  membersCount?: number;
}

export interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: string; // "ORGANIZATION_ADMIN" | "EXECUTIVE" | "DEPARTMENT_MANAGER" | "ANALYST" | "SUPER_ADMIN"
  designation: string;
  department: string;
  status: "active" | "deactivated";
  createdAt: string;
}

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: "qubertrix",
    name: "Qubertrix Technologies",
    slug: "qubertrix",
    role: "Organization Admin",
    industry: "Enterprise AI & Software",
    plan: "Enterprise Tier",
    membersCount: 4,
  },
  {
    id: "acme-retail",
    name: "Acme Global Retail",
    slug: "acme-retail",
    role: "Organization Admin",
    industry: "Retail & E-commerce",
    plan: "Business Tier",
    membersCount: 3,
  },
  {
    id: "apex-finance",
    name: "Apex Financial Group",
    slug: "apex-finance",
    role: "Executive Viewer",
    industry: "Fintech & Banking",
    plan: "Pro Tier",
    membersCount: 2,
  },
  {
    id: "horizon-health",
    name: "Horizon Healthcare Systems",
    slug: "horizon-health",
    role: "Organization Admin",
    industry: "Healthcare & Biotech",
    plan: "Enterprise Tier",
    membersCount: 3,
  },
];

export function getStoredOrganizations(): Organization[] {
  if (typeof window === "undefined") return INITIAL_ORGANIZATIONS;
  try {
    const raw = localStorage.getItem("user_organizations");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse user_organizations", e);
  }
  return INITIAL_ORGANIZATIONS;
}

export function getActiveOrganization(): Organization {
  const allOrgs = getStoredOrganizations();
  if (typeof window === "undefined") return allOrgs[0];

  const storedId = localStorage.getItem("active_org_id");
  const storedName = localStorage.getItem("active_org_name");

  if (storedId) {
    const found = allOrgs.find((o) => o.id === storedId);
    if (found) return found;
  }

  if (storedName) {
    const found = allOrgs.find((o) => o.name === storedName);
    if (found) return found;
    return {
      id: storedName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name: storedName,
      slug: storedName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      role: localStorage.getItem("active_role") || "Organization Admin",
      industry: localStorage.getItem("active_org_industry") || "Software & SaaS",
      plan: "Enterprise Tier",
      membersCount: 1,
    };
  }

  return allOrgs[0];
}

export function setActiveOrganization(org: Organization) {
  if (typeof window === "undefined") return;
  localStorage.setItem("active_org_id", org.id);
  localStorage.setItem("active_org_name", org.name);
  localStorage.setItem("active_org_slug", org.slug || org.id);
  if (org.industry) localStorage.setItem("active_org_industry", org.industry);

  // Automatically ensure org exists in user_organizations list
  addOrganization(org);
}

export function addOrganization(newOrg: Organization): Organization[] {
  if (typeof window === "undefined") return [newOrg];

  const allOrgs = getStoredOrganizations();
  const existingIdx = allOrgs.findIndex((o) => o.id === newOrg.id || o.name.toLowerCase() === newOrg.name.toLowerCase());

  if (existingIdx >= 0) {
    allOrgs[existingIdx] = { ...allOrgs[existingIdx], ...newOrg };
  } else {
    allOrgs.push(newOrg);
  }

  localStorage.setItem("user_organizations", JSON.stringify(allOrgs));

  // Initialize creator member if no members exist for this org
  const existingMembers = getOrgMembers(newOrg.id);
  if (existingMembers.length === 0) {
    const creatorMember: OrgMember = {
      id: "mem_" + Date.now(),
      name: `${newOrg.name} Lead Admin`,
      email: `admin@${newOrg.slug}.com`,
      role: newOrg.role || "ORGANIZATION_ADMIN",
      designation: "Organization Owner & Admin",
      department: "Executive & Admin",
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    localStorage.setItem(`org_members_${newOrg.id}`, JSON.stringify([creatorMember]));
  }

  return allOrgs;
}

export function getOrgMembers(orgId: string): OrgMember[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(`org_members_${orgId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse org members", e);
  }

  // Default initial members for built-in organizations
  const activeOrg = getStoredOrganizations().find((o) => o.id === orgId);
  const orgName = activeOrg ? activeOrg.name : "Organization";
  const domain = activeOrg ? activeOrg.slug + ".com" : "company.com";

  const defaultMembers: OrgMember[] = [
    {
      id: `mem_${orgId}_1`,
      name: `${orgName} Lead Admin`,
      email: `admin@${domain}`,
      role: "ORGANIZATION_ADMIN",
      designation: "Head of Organization & Governance",
      department: "Executive Management",
      status: "active",
      createdAt: "2026-01-15",
    },
    {
      id: `mem_${orgId}_2`,
      name: `Chief Executive Officer`,
      email: `ceo@${domain}`,
      role: "EXECUTIVE",
      designation: "Chief Executive Officer",
      department: "Executive Strategy",
      status: "active",
      createdAt: "2026-02-01",
    },
    {
      id: `mem_${orgId}_3`,
      name: `Department Manager`,
      email: `manager@${domain}`,
      role: "DEPARTMENT_MANAGER",
      designation: "Operations Manager",
      department: "Sales & Operations",
      status: "active",
      createdAt: "2026-02-10",
    },
    {
      id: `mem_${orgId}_4`,
      name: `Senior Data Analyst`,
      email: `analyst@${domain}`,
      role: "ANALYST",
      designation: "Senior BI & Data Analyst",
      department: "Data & Analytics",
      status: "active",
      createdAt: "2026-03-01",
    },
  ];

  localStorage.setItem(`org_members_${orgId}`, JSON.stringify(defaultMembers));
  return defaultMembers;
}

export function registerOrgMember(orgId: string, memberData: Omit<OrgMember, "id" | "createdAt">): OrgMember[] {
  if (typeof window === "undefined") return [];

  const currentMembers = getOrgMembers(orgId);
  const newMember: OrgMember = {
    ...memberData,
    id: "mem_" + Date.now(),
    createdAt: new Date().toISOString().split("T")[0],
  };

  // Replace member if email already exists or add new
  const existingIdx = currentMembers.findIndex((m) => m.email.toLowerCase() === memberData.email.toLowerCase());
  if (existingIdx >= 0) {
    currentMembers[existingIdx] = newMember;
  } else {
    currentMembers.push(newMember);
  }

  localStorage.setItem(`org_members_${orgId}`, JSON.stringify(currentMembers));

  // Update org membersCount in stored organizations
  const allOrgs = getStoredOrganizations();
  const orgIdx = allOrgs.findIndex((o) => o.id === orgId);
  if (orgIdx >= 0) {
    allOrgs[orgIdx].membersCount = currentMembers.length;
    localStorage.setItem("user_organizations", JSON.stringify(allOrgs));
  }

  return currentMembers;
}
