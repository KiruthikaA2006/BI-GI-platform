"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Activity,
  History,
  Shield,
  LogOut,
  Zap,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const adminNav = [
    { title: "Admin Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Organizations", href: "/admin/organizations", icon: Building2 },
    { title: "Users & RBAC", href: "/admin/users", icon: Users },
    { title: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    { title: "System Monitoring", href: "/admin/system-monitoring", icon: Activity },
    { title: "Platform Audit Logs", href: "/admin/audit-logs", icon: History },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-40 text-slate-300">
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

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Super Admin Controls
          </p>
          <nav className="space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href);
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

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs">
              SA
            </div>
            <div>
              <p className="text-xs font-bold text-white">Super Admin</p>
              <p className="text-[10px] text-emerald-400">Platform Scope</p>
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
