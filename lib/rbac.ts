import { Role } from "@/app/generated/prisma/enums";
import { UserSession } from "./auth";

export type PermissionAction = "view" | "create" | "edit" | "share" | "export" | "delete";

export interface ResourcePermissions {
  [key: string]: PermissionAction[];
}

export const ROLE_PERMISSIONS: Record<Role, ResourcePermissions> = {
  [Role.SUPER_ADMIN]: {
    organizations: ["view", "create", "edit", "delete"],
    subscriptions: ["view", "create", "edit", "delete"],
    users: ["view", "create", "edit", "delete"],
    system_monitoring: ["view", "export"],
    platform_audit_logs: ["view", "export"],
  },
  [Role.ORGANIZATION_ADMIN]: {
    data_sources: ["view", "create", "edit", "delete", "share"],
    datasets: ["view", "create", "edit", "delete", "export"],
    kpis: ["view", "create", "edit", "delete", "export"],
    dashboards: ["view", "create", "edit", "delete", "share", "export"],
    goals: ["view", "create", "edit", "delete"],
    reports: ["view", "create", "edit", "delete", "export"],
    forecasts: ["view", "create", "export"],
    insights: ["view", "create", "export"],
    alerts: ["view", "create", "edit", "delete"],
    org_users: ["view", "create", "edit", "delete"],
    audit_logs: ["view", "export"],
  },
  [Role.EXECUTIVE]: {
    dashboards: ["view", "export", "share"],
    kpis: ["view", "export"],
    goals: ["view"],
    reports: ["view", "export"],
    forecasts: ["view", "export"],
    insights: ["view", "export"],
    alerts: ["view"],
  },
  [Role.DEPARTMENT_MANAGER]: {
    dashboards: ["view", "create", "edit", "export"],
    kpis: ["view", "create", "edit", "export"],
    goals: ["view", "create", "edit"],
    reports: ["view", "create", "export"],
    forecasts: ["view"],
    insights: ["view"],
    alerts: ["view", "create"],
  },
  [Role.ANALYST]: {
    data_sources: ["view"],
    datasets: ["view", "create", "export"],
    kpis: ["view", "create", "edit"],
    dashboards: ["view", "create", "edit", "export"],
    reports: ["view", "create", "export"],
    forecasts: ["view"],
    insights: ["view"],
    explorer: ["view"],
  },
};

export function hasPermission(role: Role, resource: string, action: PermissionAction): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  const actions = permissions[resource];
  if (!actions) return false;
  return actions.includes(action);
}

export function assertTenantIsolation(userSession: UserSession, targetOrganizationId: string): boolean {
  if (userSession.role === Role.SUPER_ADMIN) {
    // Super admin is restricted from viewing organization business data directly
    return false;
  }
  return userSession.organizationId === targetOrganizationId;
}
