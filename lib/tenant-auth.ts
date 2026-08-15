import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { UserSession, getSessionFromToken } from "./auth";

export interface TenantContext {
  userId: string;
  userEmail: string;
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: string; // OWNER, ADMIN, MANAGER, MEMBER
}

/**
 * 1. Require Authenticated User
 */
export async function requireAuth(req?: Request): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const orgCookie = cookieStore.get("org_session")?.value;
  const adminCookie = cookieStore.get("admin_session")?.value;

  if (adminCookie) {
    try {
      return JSON.parse(adminCookie);
    } catch (e) {
      return null;
    }
  }

  if (orgCookie) {
    try {
      return JSON.parse(orgCookie);
    } catch (e) {
      return null;
    }
  }

  return null;
}

/**
 * 2. Verify Membership in PostgreSQL & Resolve Organization Context
 * Never trusts client-provided organization_id alone.
 */
export async function requireOrganization(
  userId: string,
  targetOrganizationId: string
): Promise<TenantContext | null> {
  if (!userId || !targetOrganizationId) return null;

  try {
    // Check in PostgreSQL OrganizationMember table
    const membership = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId: targetOrganizationId,
        },
      },
      include: {
        organization: true,
        user: true,
      },
    });

    if (membership && membership.organization) {
      return {
        userId: membership.userId,
        userEmail: membership.user.email,
        organizationId: membership.organization.id,
        organizationName: membership.organization.name,
        organizationSlug: membership.organization.slug,
        role: membership.role,
      };
    }

    // Fallback: If DB empty or demo mode, check if user's default organizationId matches
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (user && user.organizationId === targetOrganizationId && user.organization) {
      return {
        userId: user.id,
        userEmail: user.email,
        organizationId: user.organization.id,
        organizationName: user.organization.name,
        organizationSlug: user.organization.slug,
        role: "OWNER",
      };
    }

    return null;
  } catch (error) {
    console.error("Tenant resolution error:", error);
    return null;
  }
}

/**
 * 3. Resolve Current Active Organization for Request
 */
export async function getCurrentOrganization(userId: string): Promise<TenantContext | null> {
  const cookieStore = await cookies();
  const activeOrgId = cookieStore.get("active_org_id")?.value;

  if (activeOrgId) {
    const verified = await requireOrganization(userId, activeOrgId);
    if (verified) return verified;
  }

  // Find first accessible organization in PostgreSQL
  try {
    const firstMembership = await prisma.organizationMember.findFirst({
      where: { userId },
      include: { organization: true, user: true },
    });

    if (firstMembership && firstMembership.organization) {
      return {
        userId: firstMembership.userId,
        userEmail: firstMembership.user.email,
        organizationId: firstMembership.organization.id,
        organizationName: firstMembership.organization.name,
        organizationSlug: firstMembership.organization.slug,
        role: firstMembership.role,
      };
    }
  } catch (e) {
    // fallback
  }

  return null;
}

/**
 * 4. Require Role Permission
 */
export async function requireRole(
  userId: string,
  organizationId: string,
  allowedRoles: string[]
): Promise<boolean> {
  const context = await requireOrganization(userId, organizationId);
  if (!context) return false;
  return allowedRoles.includes(context.role.toUpperCase());
}

/**
 * 5. Row-Level Security & Tenant Filter Helper
 */
export function buildTenantWhereClause(organizationId: string) {
  return {
    organizationId: organizationId,
  };
}
