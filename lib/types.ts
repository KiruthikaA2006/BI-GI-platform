import { Role, DataSourceType, InsightType, ReportFrequency } from "@/app/generated/prisma/enums";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId: string;
  organizationName: string;
  avatarUrl?: string;
}

export interface KPICardData {
  id: string;
  name: string;
  metric: string;
  value: number;
  target?: number;
  unit?: string;
  category?: string;
  trend?: number;
  previousValue?: number;
  status: "on_track" | "at_risk" | "behind";
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
  sales: number;
  target: number;
}

export interface RegionalSalesData {
  region: string;
  sales: number;
  revenue: number;
  growth: number;
  customers: number;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  section?: string;
  requiredRoles?: Role[];
}
