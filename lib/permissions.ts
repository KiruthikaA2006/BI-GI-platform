import { requireOrganization } from "./tenant-auth";

export const PERMISSIONS = {
  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_INVITE: "users.invite",
  USERS_EDIT: "users.edit",
  USERS_DEACTIVATE: "users.deactivate",
  USERS_ASSIGN_ROLE: "users.assign_role",
  USERS_ASSIGN_DEPARTMENT: "users.assign_department",
  USERS_RESET_ACCESS: "users.reset_access",
  DEPARTMENTS_VIEW: "departments.view",
  DEPARTMENTS_CREATE: "departments.create",
  DEPARTMENTS_EDIT: "departments.edit",
  DEPARTMENTS_DELETE: "departments.delete",
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];

const ROLE_PERMISSIONS_MAP: Record<string, string[]> = {
  OWNER: Object.values(PERMISSIONS),
  ADMIN: Object.values(PERMISSIONS),
  ORGANIZATION_ADMIN: Object.values(PERMISSIONS),
  MANAGER: [PERMISSIONS.USERS_VIEW, PERMISSIONS.DEPARTMENTS_VIEW],
  DEPARTMENT_MANAGER: [PERMISSIONS.USERS_VIEW, PERMISSIONS.DEPARTMENTS_VIEW],
  MEMBER: [PERMISSIONS.USERS_VIEW, PERMISSIONS.DEPARTMENTS_VIEW],
  EXECUTIVE: [PERMISSIONS.USERS_VIEW, PERMISSIONS.DEPARTMENTS_VIEW],
  ANALYST: [PERMISSIONS.USERS_VIEW, PERMISSIONS.DEPARTMENTS_VIEW],
};

/**
 * Server-side permission validator
 */
export async function requirePermission(
  userId: string,
  organizationId: string,
  permissionKey: PermissionKey
): Promise<boolean> {
  const tenantContext = await requireOrganization(userId, organizationId);
  if (!tenantContext) return false;

  const role = tenantContext.role.toUpperCase();
  const allowedPermissions = ROLE_PERMISSIONS_MAP[role] || [];
  return allowedPermissions.includes(permissionKey);
}
