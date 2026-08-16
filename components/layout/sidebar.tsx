"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  TableProperties,
  Target,
  Trophy,
  FileText,
  TrendingUp,
  Sparkles,
  Bell,
  Search,
  History,
  Building2,
  Users,
  CreditCard,
  Zap,
  Activity,
  Lock,
  User,
  Building,
  ShieldCheck,
  CheckCircle2,
  Shield,
  RefreshCw,
} from "lucide-react";
import { performLogout } from "@/lib/org-context";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  section?: string;
  badge?: string;
}

interface SidebarProps {
  currentRole?: string;
}

export function Sidebar({ currentRole }: SidebarProps) {
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState("ORGANIZATION_ADMIN");

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.role) {
          setActiveRole(data.user.role);
          try {
            localStorage.setItem("active_role", data.user.role);
          } catch (e) { }
        } else {
          try {
            const stored = localStorage.getItem("active_role");
            if (stored) setActiveRole(stored);
          } catch (e) { }
        }
      })
      .catch(() => {
        try {
          const stored = localStorage.getItem("active_role");
          if (stored) setActiveRole(stored);
        } catch (e) { }
      });
  }, []);

  // Path-based dynamic role context resolution (100% route isolation)
  let resolvedRole = currentRole || activeRole;
  if (pathname.startsWith("/admin")) resolvedRole = "SUPER_ADMIN";
  else if (pathname.startsWith("/executive")) resolvedRole = "EXECUTIVE";
  else if (pathname.startsWith("/manager")) resolvedRole = "DEPARTMENT_MANAGER";
  else if (pathname.startsWith("/analyst")) resolvedRole = "ANALYST";
  else if (resolvedRole === "SUPER_ADMIN" || !resolvedRole) resolvedRole = "ORGANIZATION_ADMIN";

  const normalizedRole = resolvedRole.toUpperCase();

  // Define role-specific navigation menus with isolated sub-routes
  const getNavItems = (): NavItem[] => {
    if (normalizedRole === "SUPER_ADMIN") {
      return [
        { title: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
        { title: "Users", href: "/admin/users", icon: Users },
        { title: "Departments", href: "/admin/departments", icon: Building2 },
        { title: "Roles & Permissions", href: "/admin/roles-permissions", icon: Shield },
        { title: "Data Sources", href: "/admin/data-sources", icon: Database },
        { title: "Data Access", href: "/admin/data-access", icon: Lock },
        { title: "Organization Settings", href: "/admin/organization-settings", icon: Building2 },
        { title: "Audit Logs", href: "/admin/audit-logs", icon: History },
        { title: "Profile", href: "/admin/profile", icon: Users },
      ];
    }

    if (normalizedRole === "EXECUTIVE") {
      return [
        { title: "Command Center", href: "/executive/command-center", icon: LayoutDashboard },
        { title: "Business Health", href: "/executive/business-health", icon: Activity },
        { title: "KPIs", href: "/executive/kpis", icon: Target },
        { title: "AI Insights", href: "/executive/ai-insights", icon: Sparkles, badge: "AI" },
        { title: "Trends", href: "/executive/trends", icon: TrendingUp },
        { title: "Forecasts", href: "/executive/forecasts", icon: TrendingUp },
        { title: "Recommendations", href: "/executive/recommendations", icon: Zap },
        { title: "Goals & Actions", href: "/executive/goals", icon: Trophy },
        { title: "Reports", href: "/executive/reports", icon: FileText },
        { title: "Profile", href: "/executive/profile", icon: Users },
      ];
    }

    if (normalizedRole === "DEPARTMENT_MANAGER") {
      return [
        { title: "Manager Dashboard", href: "/manager/dashboard", icon: LayoutDashboard },
        { title: "Department KPIs", href: "/manager/kpis", icon: Target },
        { title: "Team Workspace", href: "/manager/workspace", icon: Building2 },
        { title: "Department Goals", href: "/manager/goals", icon: Trophy },
        { title: "Alerts & Notifications", href: "/manager/alerts", icon: Bell, badge: "3" },
        { title: "Operational Reports", href: "/manager/reports", icon: FileText },
        { title: "My Profile", href: "/manager/profile", icon: User },
      ];
    }

    if (normalizedRole === "ANALYST") {
      return [
        { title: "Analyst Dashboard", href: "/analyst/dashboard", icon: LayoutDashboard },
        { title: "Datasets", href: "/analyst/datasets", icon: TableProperties },
        { title: "Data Preparation", href: "/analyst/preparation", icon: RefreshCw },
        { title: "Analysis", href: "/analyst/analysis", icon: Search },
        { title: "Visualizations", href: "/analyst/visualizations", icon: TrendingUp },
        { title: "AI Insights", href: "/analyst/ai-insights", icon: Sparkles, badge: "AI" },
        { title: "Reports", href: "/analyst/reports", icon: FileText },
        { title: "My Profile", href: "/analyst/profile", icon: User },
      ];
    }

    // Default: ORGANIZATION_ADMIN / Tenant Scope
    return [
      { title: "Main Dashboard", href: "/dashboard", icon: LayoutDashboard, section: "Business Health" },
      { title: "Data Center", href: "/data-center", icon: Database, section: "Pillars", badge: "6 Pipeline Stages" },
      { title: "Dashboards & Reports", href: "/dashboards", icon: TableProperties, section: "Pillars" },
      { title: "AI Insights", href: "/ai-insights", icon: Sparkles, section: "Pillars", badge: "AI" },
      { title: "Forecasting", href: "/forecasts", icon: TrendingUp, section: "Execution Loop" },
      { title: "AI Recommendations", href: "/ai-insights/recommendations", icon: Zap, section: "Execution Loop" },
      { title: "Goals & Actions", href: "/goals", icon: Target, section: "Execution Loop" },
      { title: "Workspace & Members", href: "/workspace", icon: Building2, section: "Workspace" },
      { title: "User Management", href: "/users", icon: Users, section: "Workspace" },
      { title: "Audit Logs", href: "/audit-logs", icon: History, section: "Workspace" },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-black border-r border-neutral-800 flex flex-col justify-between h-screen sticky top-0 z-40 text-neutral-300 shadow-2xl">
      {/* Top Header Logo */}
      <div className="p-5 border-b border-neutral-800 bg-neutral-950/80 space-y-2">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight">BI-GI Platform</span>
            <span className="block text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
              Growth Intelligence
            </span>
          </div>
        </Link>

        {/* Active Role Indicator Badge */}
        <div className="bg-neutral-900 p-2 rounded-xl border border-neutral-800 flex items-center justify-between">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Role:</span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${normalizedRole === "SUPER_ADMIN"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : normalizedRole === "EXECUTIVE"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : normalizedRole === "DEPARTMENT_MANAGER"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : normalizedRole === "ANALYST"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
          >
            {normalizedRole.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        <div>
          <p className="px-3 text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-2">
            {normalizedRole.replace("_", " ")} MENU
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const hasExactMatch = navItems.some((nav) => nav.href === pathname);
              const isActive = hasExactMatch
                ? item.href === pathname
                : item.href !== "/" && (pathname === item.href || pathname.startsWith(item.href + "/"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                      ? "bg-neutral-900 text-white font-bold border-l-2 border-amber-400 shadow-md shadow-amber-400/10"
                      : "hover:bg-neutral-900/80 hover:text-white text-neutral-400"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-amber-400" : "text-neutral-400"}`} />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${item.badge === "AI" ? "bg-purple-500/20 text-purple-300" : "bg-neutral-800 text-neutral-400"
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-black text-xs">
              {normalizedRole.charAt(0)}
            </div>
            <div className="text-left max-w-[110px]">
              <span className="block text-xs font-bold text-white truncate">
                {normalizedRole === "EXECUTIVE"
                  ? "CEO Executive"
                  : normalizedRole === "ANALYST"
                    ? "Data Analyst"
                    : normalizedRole === "DEPARTMENT_MANAGER"
                      ? "Sales Manager"
                      : normalizedRole === "SUPER_ADMIN"
                        ? "Platform Admin"
                        : "Kiruthika Anand"}
              </span>
              <span className="block text-[9px] text-neutral-400 truncate">{normalizedRole}</span>
            </div>
          </div>
          <button
            onClick={performLogout}
            className="text-xs text-neutral-400 hover:text-white font-semibold cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
