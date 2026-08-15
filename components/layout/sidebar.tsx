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
  Activity,
  Zap,
  UploadCloud,
} from "lucide-react";

interface SidebarProps {
  currentRole?: string;
}

export function Sidebar({ currentRole }: SidebarProps) {
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState("ORGANIZATION_ADMIN");

  useEffect(() => {
    // 1. Try fetching from /api/auth
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.role) {
          setActiveRole(data.user.role);
          try {
            localStorage.setItem("active_role", data.user.role);
          } catch (e) {}
        } else {
          try {
            const stored = localStorage.getItem("active_role");
            if (stored) setActiveRole(stored);
          } catch (e) {}
        }
      })
      .catch(() => {
        try {
          const stored = localStorage.getItem("active_role");
          if (stored) setActiveRole(stored);
        } catch (e) {}
      });
  }, []);

  const normalizedRole = (currentRole || activeRole).toUpperCase();

  // Define role-specific navigation menus
  const getNavItems = () => {
    if (normalizedRole === "SUPER_ADMIN") {
      return [
        { title: "Platform Overview", href: "/admin/dashboard", icon: LayoutDashboard },
        { title: "Organizations", href: "/admin/organizations", icon: Building2 },
        { title: "User Management", href: "/admin/users", icon: Users },
        { title: "Subscriptions", href: "/subscriptions", icon: CreditCard },
        { title: "System Monitoring", href: "/admin/monitoring", icon: Activity },
        { title: "Global Audit Logs", href: "/admin/audit-logs", icon: History },
      ];
    }

    if (normalizedRole === "EXECUTIVE") {
      return [
        { title: "Executive Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "High-Level KPIs", href: "/kpis", icon: Target },
        { title: "Strategic Forecasts", href: "/forecasts", icon: TrendingUp },
        { title: "AI Insights", href: "/ai-insights", icon: Sparkles, badge: "AI" },
        { title: "Executive Reports", href: "/reports", icon: FileText },
      ];
    }

    if (normalizedRole === "DEPARTMENT_MANAGER") {
      return [
        { title: "Manager Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Department KPIs", href: "/kpis", icon: Target },
        { title: "Team Workspace", href: "/workspace", icon: Building2 },
        { title: "Department Goals", href: "/goals", icon: Trophy },
        { title: "Alerts", href: "/alerts", icon: Bell, badge: "3" },
        { title: "Operational Reports", href: "/reports", icon: FileText },
      ];
    }

    if (normalizedRole === "ANALYST") {
      return [
        { title: "Analyst Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Data Ingestion", href: "/data-sources/import", icon: UploadCloud },
        { title: "Datasets", href: "/datasets", icon: TableProperties },
        { title: "Data Explorer", href: "/explorer", icon: Search },
        { title: "AI Insights", href: "/ai-insights", icon: Sparkles, badge: "AI" },
        { title: "Custom Reports", href: "/reports", icon: FileText },
      ];
    }

    // Default: ORGANIZATION_ADMIN
    return [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Workspace & Members", href: "/workspace", icon: Building2 },
      { title: "User Management", href: "/admin/users", icon: Users },
      { title: "Data Sources", href: "/data-sources", icon: Database },
      { title: "Datasets", href: "/datasets", icon: TableProperties },
      { title: "KPIs", href: "/kpis", icon: Target },
      { title: "Reports", href: "/reports", icon: FileText },
      { title: "Audit Logs", href: "/audit-logs", icon: History },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-40 text-slate-300">
      {/* Top Header Logo */}
      <div className="p-5 border-b border-slate-800 space-y-2">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-white text-base tracking-tight">BI-GI Platform</span>
            <span className="block text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
              Growth Intelligence
            </span>
          </div>
        </Link>

        {/* Active Role Indicator Badge */}
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Role Context:</span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
              normalizedRole === "SUPER_ADMIN"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : normalizedRole === "EXECUTIVE"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : normalizedRole === "DEPARTMENT_MANAGER"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                : normalizedRole === "ANALYST"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            {normalizedRole.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        <div>
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Navigation Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400 font-semibold border-l-2 border-indigo-500"
                      : "hover:bg-slate-800/60 hover:text-white text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        item.badge === "AI" ? "bg-indigo-500/20 text-indigo-300" : "bg-slate-800 text-slate-400"
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
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
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
                  : "Kiruthika Anand"}
              </span>
              <span className="block text-[9px] text-slate-400 truncate">{normalizedRole}</span>
            </div>
          </div>
          <Link
            href="/login"
            onClick={() => {
              try {
                localStorage.removeItem("active_role");
              } catch (e) {}
            }}
            className="text-xs text-slate-400 hover:text-white font-semibold"
          >
            Logout
          </Link>
        </div>
      </div>
    </aside>
  );
}
