"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Shield, Building2, ArrowRight, CheckCircle2, UserCheck, Sparkles, Lock, Mail, Users } from "lucide-react";

export default function LandingPortalSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"SUPER_ADMIN" | "ORGANIZATION_ADMIN" | "EXECUTIVE" | "DEPARTMENT_MANAGER" | "ANALYST">("ORGANIZATION_ADMIN");
  const [email, setEmail] = useState("kiruthika@qubertrix.com");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const rolesList = [
    {
      id: "SUPER_ADMIN",
      title: "Super Admin",
      portal: "PLATFORM ADMIN PORTAL",
      badge: "Platform Scope",
      color: "emerald",
      desc: "Full system control, tenant provisioning & DB telemetry",
      email: "admin@bigi-platform.io",
      target: "/admin/dashboard",
    },
    {
      id: "ORGANIZATION_ADMIN",
      title: "Organization Admin",
      portal: "ORGANIZATION PORTAL",
      badge: "Tenant Scope",
      color: "indigo",
      desc: "Tenant user management, data sources & settings",
      email: "kiruthika@qubertrix.com",
      target: "/dashboard",
    },
    {
      id: "EXECUTIVE",
      title: "Executive",
      portal: "ORGANIZATION PORTAL",
      badge: "Tenant Scope",
      color: "blue",
      desc: "Revenue growth, company KPIs, forecasts & AI insights",
      email: "ceo@qubertrix.com",
      target: "/dashboard",
    },
    {
      id: "DEPARTMENT_MANAGER",
      title: "Manager",
      portal: "ORGANIZATION PORTAL",
      badge: "Tenant Scope",
      color: "purple",
      desc: "Department performance, team goals & operational reports",
      email: "manager@qubertrix.com",
      target: "/dashboard",
    },
    {
      id: "ANALYST",
      title: "Analyst",
      portal: "ORGANIZATION PORTAL",
      badge: "Tenant Scope",
      color: "cyan",
      desc: "Data exploration, CSV/XLSX imports & custom reports",
      email: "analyst@qubertrix.com",
      target: "/dashboard",
    },
  ];

  const activeRoleObj = rolesList.find((r) => r.id === selectedRole) || rolesList[1];

  const handleRoleSelect = (roleItem: any) => {
    setSelectedRole(roleItem.id);
    setEmail(roleItem.email);
  };

  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: selectedRole,
          action: selectedRole === "SUPER_ADMIN" ? "admin_login" : "login",
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(data.redirectUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-white text-xl tracking-tight">BI-GI PLATFORM</h1>
            <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block">
              Multi-Tenant Authentication & Role Portal Selector
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <Link
            href="/login"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-xl border border-slate-700 transition"
          >
            Organization Portal
          </Link>
          <Link
            href="/admin/login"
            className="bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5"
          >
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span>Platform Admin</span>
          </Link>
        </div>
      </header>

      {/* Main Role Picker Workspace */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Role Selector</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Choose Role & Sign In
          </h2>
          <p className="text-xs text-slate-400">
            Click any role below to automatically switch credentials and enter the corresponding portal
          </p>
        </div>

        {/* Role Cards Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {rolesList.map((r) => {
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleSelect(r)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 relative ${
                  isSelected
                    ? r.color === "emerald"
                      ? "bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500 shadow-xl shadow-emerald-600/20"
                      : "bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500 shadow-xl shadow-indigo-600/20"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        r.color === "emerald"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      }`}
                    >
                      {r.badge}
                    </span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{r.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{r.desc}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 truncate">
                  {r.email}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Role Interactive Login Form */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-xl mx-auto w-full space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Selected Target Role</span>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{activeRoleObj.title}</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700">
                  {activeRoleObj.portal}
                </span>
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>

          <form onSubmit={handleDirectLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Account Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg font-bold text-sm text-white transition ${
                selectedRole === "SUPER_ADMIN"
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
              }`}
            >
              {loading ? "Signing In..." : `Login as ${activeRoleObj.title} →`}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-8 py-4 text-center text-xs text-slate-500">
        BI-GI PLATFORM © 2026 Qubertrix Technologies • Enterprise Multi-Tenant Intelligence Engine
      </footer>
    </div>
  );
}
