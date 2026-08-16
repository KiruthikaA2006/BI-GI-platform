"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building,
  ShieldCheck,
  Database,
  Lock,
  Settings,
  History,
  User,
  Shield,
  LogOut,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  // Admin menu tree matching Screenshot 3
  const adminNav = [
    { title: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Departments", href: "/admin/departments", icon: Building },
    { title: "Roles & Permissions", href: "/admin/roles-permissions", icon: ShieldCheck },
    { title: "Data Sources", href: "/admin/data-sources", icon: Database },
    { title: "Data Access", href: "/admin/data-access", icon: Lock },
    { title: "Organization Settings", href: "/admin/organization-settings", icon: Settings },
    { title: "Audit Logs", href: "/admin/audit-logs", icon: History },
    { title: "Profile", href: "/admin/profile", icon: User },
  ];

  return (
    <aside className="w-64 bg-black border-r border-neutral-800 flex flex-col justify-between h-screen sticky top-0 z-40 text-neutral-300 shadow-2xl">
      {/* Top Header Logo */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800 bg-slate-950/60">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/25">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-white text-base tracking-tight">Platform Admin</span>
            <span className="block text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
              Super Admin Console
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        <div>
          <p className="px-3 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            ADMIN
          </p>
          <nav className="space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const hasExactMatch = adminNav.some((nav) => nav.href === pathname);
              const isActive = hasExactMatch
                ? item.href === pathname
                : item.href !== "/" && (pathname === item.href || pathname.startsWith(item.href + "/"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-emerald-600/20 text-emerald-400 font-semibold border-l-2 border-emerald-500"
                      : "hover:bg-slate-800/60 hover:text-white text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                    <span>{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer User Avatar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs">
              SA
            </div>
            <div>
              <p className="text-xs font-bold text-white">Kiruthika Anand</p>
              <p className="text-[10px] text-emerald-400">Super Admin</p>
            </div>
          </div>
          <Link href="/admin/login" className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
