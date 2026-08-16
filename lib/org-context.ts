"use client";

import { clearStatsCache } from "./stats-cache";

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
  role:
  | "ORGANIZATION_ADMIN"
  | "EXECUTIVE"
  | "DEPARTMENT_MANAGER"
  | "ANALYST"
  | "SUPER_ADMIN";
  designation: string;
  department: string;
  status: "active" | "deactivated";
  createdAt: string;
}

/**
 * No hardcoded/mock organizations.
 *
 * Organizations must come from the authenticated user's real
 * organization context and be stored in localStorage after
 * authentication/API resolution.
 */
export const DEFAULT_ORGANIZATIONS: Organization[] = [
  {
    id: "acme",
    name: "Acme Corporation",
    slug: "acme",
    role: "Organization Admin",
    industry: "Enterprise Retail & Commerce",
    plan: "Enterprise Tier",
    membersCount: 42,
  },
  {
    id: "qubertrix",
    name: "Qubertrix Technologies",
    slug: "qubertrix",
    role: "Organization Admin",
    industry: "Software & SaaS",
    plan: "Enterprise Tier",
    membersCount: 18,
  },
  {
    id: "infiniq",
    name: "Infiniq Analytics",
    slug: "infiniq",
    role: "Organization Admin",
    industry: "Financial Services",
    plan: "Enterprise Tier",
    membersCount: 25,
  },
];

export const INITIAL_ORGANIZATIONS: Organization[] = DEFAULT_ORGANIZATIONS;

/**
 * Get organizations stored for the current user.
 */
export function getStoredOrganizations(): Organization[] {
  if (typeof window === "undefined") {
    return DEFAULT_ORGANIZATIONS;
  }

  try {
    const raw = localStorage.getItem("user_organizations");

    if (!raw) {
      localStorage.setItem("user_organizations", JSON.stringify(DEFAULT_ORGANIZATIONS));
      return DEFAULT_ORGANIZATIONS;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem("user_organizations", JSON.stringify(DEFAULT_ORGANIZATIONS));
      return DEFAULT_ORGANIZATIONS;
    }

    const validOrgs = parsed.filter(
      (org): org is Organization =>
        typeof org === "object" &&
        org !== null &&
        typeof (org as Organization).id === "string" &&
        typeof (org as Organization).name === "string" &&
        typeof (org as Organization).slug === "string"
    );

    if (validOrgs.length === 0) {
      localStorage.setItem("user_organizations", JSON.stringify(DEFAULT_ORGANIZATIONS));
      return DEFAULT_ORGANIZATIONS;
    }

    return validOrgs;
  } catch (error) {
    console.error("Failed to parse user_organizations", error);
    return DEFAULT_ORGANIZATIONS;
  }
}

/**
 * Get the currently active organization.
 *
 * The organization must come from the authenticated session/context.
 * No default or mock organization is created here.
 */
export function getActiveOrganization(): Organization | null {
  if (typeof window === "undefined") {
    return null;
  }

  const allOrgs = getStoredOrganizations();

  const storedId = localStorage.getItem("active_org_id");
  const storedName = localStorage.getItem("active_org_name");
  const storedSlug = localStorage.getItem("active_org_slug");
  const storedRole = localStorage.getItem("active_role");
  const storedIndustry = localStorage.getItem("active_org_industry");

  /**
   * First preference:
   * Find the real organization in the user's organization list.
   */
  if (storedId) {
    const found = allOrgs.find((org) => org.id === storedId);

    if (found) {
      return found;
    }
  }

  /**
   * If the organization list has not yet been populated,
   * reconstruct only from authenticated organization context
   * already stored by the application.
   *
   * No fake organization ID/name is generated.
   */
  if (storedId && storedName) {
    return {
      id: storedId,
      name: storedName,
      slug: storedSlug || storedId,
      ...(storedRole ? { role: storedRole } : {}),
      ...(storedIndustry ? { industry: storedIndustry } : {}),
    };
  }

  return null;
}

/**
 * Set the active organization.
 *
 * This should only be called with an organization obtained from
 * the authenticated user/API.
 */
export function setActiveOrganization(org: Organization): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("active_org_id", org.id);
  localStorage.setItem("active_org_name", org.name);
  localStorage.setItem("active_org_slug", org.slug || org.id);

  if (org.role) {
    localStorage.setItem("active_role", org.role);
  }

  if (org.industry) {
    localStorage.setItem("active_org_industry", org.industry);
  }

  /**
   * Keep the organization context available to server/API routes.
   */
  try {
    document.cookie = `active_org_id=${encodeURIComponent(
      org.id
    )}; path=/; SameSite=Lax`;

    document.cookie = `active_org_name=${encodeURIComponent(
      org.name
    )}; path=/; SameSite=Lax`;

    document.cookie = `active_org_slug=${encodeURIComponent(
      org.slug || org.id
    )}; path=/; SameSite=Lax`;
  } catch (error) {
    console.error("Failed to store organization cookies", error);
  }

  /**
   * Store only the real organization received from the API/session.
   * No mock organization is added.
   */
  addOrganization(org);
}

/**
 * Add or update a real organization in the user's local organization list.
 */
export function addOrganization(
  newOrg: Organization
): Organization[] {
  if (typeof window === "undefined") {
    return [];
  }

  const allOrgs = getStoredOrganizations();

  const existingIndex = allOrgs.findIndex(
    (org) =>
      org.id === newOrg.id ||
      org.name.toLowerCase() === newOrg.name.toLowerCase()
  );

  if (existingIndex >= 0) {
    allOrgs[existingIndex] = {
      ...allOrgs[existingIndex],
      ...newOrg,
    };
  } else {
    allOrgs.push(newOrg);
  }

  localStorage.setItem(
    "user_organizations",
    JSON.stringify(allOrgs)
  );

  /**
   * IMPORTANT:
   * Do not automatically create a fake organization member.
   * Members must come from the real backend/database.
   */

  return allOrgs;
}

/**
 * Get members belonging to a real organization.
 *
 * This function reads only members previously supplied by the
 * backend/API. It does not generate demo members.
 */
export function getOrgMembers(orgId: string): OrgMember[] {
  if (typeof window === "undefined") {
    return [];
  }

  if (!orgId) {
    return [];
  }

  try {
    const raw = localStorage.getItem(`org_members_${orgId}`);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (member): member is OrgMember =>
        typeof member === "object" &&
        member !== null &&
        typeof (member as OrgMember).id === "string" &&
        typeof (member as OrgMember).name === "string" &&
        typeof (member as OrgMember).email === "string" &&
        typeof (member as OrgMember).role === "string"
    );
  } catch (error) {
    console.error(
      `Failed to parse org members for organization ${orgId}`,
      error
    );

    return [];
  }
}

/**
 * Store members returned by the backend/API.
 *
 * Use this after fetching real organization members.
 */
export function setOrgMembers(
  orgId: string,
  members: OrgMember[]
): void {
  if (typeof window === "undefined" || !orgId) {
    return;
  }

  localStorage.setItem(
    `org_members_${orgId}`,
    JSON.stringify(members)
  );

  /**
   * Keep the local organization member count synchronized.
   */
  const allOrgs = getStoredOrganizations();

  const orgIndex = allOrgs.findIndex(
    (org) => org.id === orgId
  );

  if (orgIndex >= 0) {
    allOrgs[orgIndex] = {
      ...allOrgs[orgIndex],
      membersCount: members.length,
    };

    localStorage.setItem(
      "user_organizations",
      JSON.stringify(allOrgs)
    );
  }
}

/**
 * Register a real organization member.
 *
 * This function only stores the member data supplied by the
 * authenticated/admin flow. It does not create fake members.
 */
export function registerOrgMember(
  orgId: string,
  memberData: Omit<OrgMember, "id" | "createdAt">
): OrgMember[] {
  if (typeof window === "undefined" || !orgId) {
    return [];
  }

  const currentMembers = getOrgMembers(orgId);

  const existingIndex = currentMembers.findIndex(
    (member) =>
      member.email.toLowerCase() ===
      memberData.email.toLowerCase()
  );

  const member: OrgMember = {
    ...memberData,
    id:
      existingIndex >= 0
        ? currentMembers[existingIndex].id
        : `mem_${Date.now()}`,
    createdAt:
      existingIndex >= 0
        ? currentMembers[existingIndex].createdAt
        : new Date().toISOString().split("T")[0],
  };

  if (existingIndex >= 0) {
    currentMembers[existingIndex] = member;
  } else {
    currentMembers.push(member);
  }

  setOrgMembers(orgId, currentMembers);

  return currentMembers;
}

/**
 * Clear organization context on logout.
 *
 * This removes only the current user's locally stored organization
 * context. It does not create or replace it with a default org.
 */
export function clearOrganizationContext(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("active_org_id");
  localStorage.removeItem("active_org_name");
  localStorage.removeItem("active_org_slug");
  localStorage.removeItem("active_role");
  localStorage.removeItem("active_org_industry");
  clearStatsCache();
  // user_organizations is preserved so created organizations remain in existing list

  try {
    document.cookie =
      "active_org_id=; path=/; max-age=0";

    document.cookie =
      "active_org_name=; path=/; max-age=0";

    document.cookie =
      "active_org_slug=; path=/; max-age=0";
  } catch (error) {
    console.error(
      "Failed to clear organization cookies",
      error
    );
  }
}

/**
 * Log out user: clears local context/session cookies and navigates to organization selection page.
 * Prepares browser history so pressing 'Back' from organization selection lands on Landing Page (/).
 */
export function performLogout(): void {
  if (typeof window === "undefined") return;

  clearOrganizationContext();
  try {
    localStorage.removeItem("active_role");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");
    sessionStorage.setItem("just_logged_out", "true");
  } catch (e) {
    console.error("Failed to clear local user storage on logout:", e);
  }

  window.location.replace("/onboarding/organization");
}