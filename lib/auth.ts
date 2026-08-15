import { Role } from "@/app/generated/prisma/enums";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId: string | null;
  organizationName: string | null;
  avatarUrl?: string;
}

export const DEMO_SUPER_ADMIN_SESSION: UserSession = {
  id: "user_super_01",
  name: "Platform Super Admin",
  email: "admin@bigi-platform.io",
  role: Role.SUPER_ADMIN,
  organizationId: null,
  organizationName: "Platform Administration",
};

export const DEMO_ORG_ADMIN_SESSION: UserSession = {
  id: "user_org_01",
  name: "Kiruthika Anand",
  email: "kiruthika@qubertrix.com",
  role: Role.ORGANIZATION_ADMIN,
  organizationId: "org_qubertrix_01",
  organizationName: "Qubertrix Technologies",
};

export function getSessionFromToken(token?: string): UserSession | null {
  if (!token) return null;
  if (token === "demo_super_admin_token") return DEMO_SUPER_ADMIN_SESSION;
  if (token === "demo_org_admin_token" || token === "demo_jwt_token_qubertrix_2026") return DEMO_ORG_ADMIN_SESSION;
  return null;
}

export function isPlatformAdmin(role: Role): boolean {
  return role === Role.SUPER_ADMIN;
}

export function isOrgMember(session: UserSession | null, targetOrgId: string): boolean {
  if (!session) return false;
  // Super admin cannot view org data unless explicitly invited or authorized
  if (session.role === Role.SUPER_ADMIN) return false;
  return session.organizationId === targetOrgId;
}
