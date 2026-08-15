"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"ORGANIZATION_ADMIN" | "EXECUTIVE" | "DEPARTMENT_MANAGER" | "ANALYST">("ORGANIZATION_ADMIN");
  const [email, setEmail] = useState("kiruthika@qubertrix.com");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const orgRoles = [
    { id: "ORGANIZATION_ADMIN", label: "Organization Admin", desc: "Full Org Admin Controls", email: "kiruthika@qubertrix.com" },
    { id: "EXECUTIVE", label: "Executive", desc: "C-Level Growth & Revenue Cockpit", email: "ceo@qubertrix.com" },
    { id: "DEPARTMENT_MANAGER", label: "Manager", desc: "Department Metrics & Goals", email: "manager@qubertrix.com" },
    { id: "ANALYST", label: "Analyst", desc: "Data Exploration & Dashboards", email: "analyst@qubertrix.com" },
  ];

  const handleRoleSelect = (roleId: any, roleEmail: string) => {
    setSelectedRole(roleId);
    setEmail(roleEmail);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.setItem("active_role", selectedRole);
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole, action: "login" }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25">
          <Zap className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">ORGANIZATION PORTAL LOGIN</h2>
        <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
          BI-GI Platform • Tenant Workspace Sign In
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 space-y-6">
          {/* Quick Role Selector Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Your Organization Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {orgRoles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSelect(r.id, r.email)}
                  className={`p-3 rounded-xl border text-left transition ${
                    selectedRole === r.id
                      ? "bg-indigo-600/20 border-indigo-500 text-white font-semibold ring-1 ring-indigo-500"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <span className="block text-xs font-bold">{r.label}</span>
                  <span className="block text-[10px] text-slate-400">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Work Email Address
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
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 transition shadow-indigo-600/30"
            >
              <span>{loading ? "Signing In..." : `Sign In as ${selectedRole.replace("_", " ")}`}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Enterprise Landing Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
