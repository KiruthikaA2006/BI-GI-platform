"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, ArrowLeft, Globe, User, Building2, Shield } from "lucide-react";
import { getActiveOrganization, getStoredOrganizations, setActiveOrganization, registerOrgMember, Organization } from "@/lib/org-context";

export default function LoginPage() {
  const router = useRouter();
  const [authPortal, setAuthPortal] = useState<"org" | "superadmin">("org");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [activeOrg, setActiveOrgState] = useState<Organization | null>(null);
  const [selectedRole, setSelectedRole] = useState<"ORGANIZATION_ADMIN" | "EXECUTIVE" | "DEPARTMENT_MANAGER" | "ANALYST">("ORGANIZATION_ADMIN");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let org: Organization | null = null;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const qOrgId = params.get("orgId");
      if (qOrgId) {
        const allOrgs = getStoredOrganizations();
        const found = allOrgs.find((o) => o.id === qOrgId || o.slug === qOrgId);
        if (found) {
          setActiveOrganization(found);
          org = found;
        }
      }
    }

    if (!org) {
      org = getActiveOrganization();
    }

    if (org) {
      setActiveOrgState(org);
      const domain = org.slug ? `${org.slug}.com` : "company.com";
      setEmail(`organisationadmin@${domain}`);
    }
  }, []);

  const roleOptions = [
    { id: "ORGANIZATION_ADMIN", label: "Organization Admin — Full Tenant Controls" },
    { id: "EXECUTIVE", label: "Executive — Growth & Revenue Cockpit" },
    { id: "DEPARTMENT_MANAGER", label: "Department Manager — Dept Metrics & Goals" },
    { id: "ANALYST", label: "Analyst — Data Pipeline & Dashboards" },
  ];

  const handleRoleChange = (roleId: any) => {
    setSelectedRole(roleId);
    const domain = activeOrg?.slug ? `${activeOrg.slug}.com` : "company.com";
    if (roleId === "EXECUTIVE") setEmail(`ceo@${domain}`);
    else if (roleId === "DEPARTMENT_MANAGER") setEmail(`manager@${domain}`);
    else if (roleId === "ANALYST") setEmail(`analyst@${domain}`);
    else setEmail(`organisationadmin@${domain}`);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const targetRole = authPortal === "superadmin" ? "SUPER_ADMIN" : selectedRole;
      const targetEmail = authPortal === "superadmin" ? (email.includes("@") ? email : "admin@bigi-platform.io") : email;

      localStorage.setItem("active_role", targetRole);
      localStorage.setItem("user_email", targetEmail);

      const namePart = targetEmail.split("@")[0].replace(/[^a-zA-Z]/g, " ").trim();
      const formattedName = fullName.trim() || (namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : "Employee User");

      if (authPortal === "org" && activeOrg) {
        registerOrgMember(activeOrg.id, {
          name: formattedName,
          email: targetEmail,
          role: targetRole as any,
          designation:
            targetRole === "EXECUTIVE"
              ? "Executive Leader"
              : targetRole === "DEPARTMENT_MANAGER"
              ? "Department Manager"
              : targetRole === "ANALYST"
              ? "Senior Data Analyst"
              : "Organization Admin",
          department:
            targetRole === "EXECUTIVE"
              ? "Executive Office"
              : targetRole === "DEPARTMENT_MANAGER"
              ? "Operations & Sales"
              : targetRole === "ANALYST"
              ? "Data Science"
              : "Organization Governance",
          status: "active",
        });
      }

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formattedName,
          email: targetEmail,
          password,
          role: targetRole,
          organizationId: authPortal === "superadmin" ? null : activeOrg?.id,
          organizationName: authPortal === "superadmin" ? "Platform Administration" : activeOrg?.name,
          action: authPortal === "superadmin" ? "admin_login" : authMode,
        }),
      });
      const data = await res.json();

      if (authPortal === "superadmin" || targetRole === "SUPER_ADMIN") {
        router.push("/admin/dashboard");
      } else if (authMode === "signup") {
        router.push("/onboarding/profile");
      } else if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        if (targetRole === "EXECUTIVE") router.push("/executive/command-center");
        else if (targetRole === "DEPARTMENT_MANAGER") router.push("/manager/dashboard");
        else if (targetRole === "ANALYST") router.push("/analyst/dashboard");
        else router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      if (authPortal === "superadmin" || (selectedRole as string) === "SUPER_ADMIN") router.push("/admin/dashboard");
      else if (selectedRole === "EXECUTIVE") router.push("/executive/command-center");
      else if (selectedRole === "DEPARTMENT_MANAGER") router.push("/manager/dashboard");
      else if (selectedRole === "ANALYST") router.push("/analyst/dashboard");
      else router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e4dac9] text-stone-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25">
          {authPortal === "superadmin" ? <Shield className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
        </div>
        <h2 className="text-3xl font-black text-stone-900 tracking-tight uppercase">
          {authPortal === "superadmin"
            ? "SUPER ADMIN PLATFORM PORTAL"
            : authMode === "login"
            ? "ORGANIZATION EMPLOYEE SIGN IN"
            : "CREATE EMPLOYEE ACCOUNT"}
        </h2>

        {/* Dynamic Organization Banner Badge */}
        {authPortal === "org" && activeOrg && (
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm">
            <Building2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Target Workspace: {activeOrg.name}</span>
          </div>
        )}

        {authPortal === "superadmin" && (
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-800 px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm">
            <Shield className="h-3.5 w-3.5 text-purple-600" />
            <span>Platform Infrastructure Super Admin Controls</span>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Main White Card Container */}
        <div className="bg-white border border-stone-300 py-8 px-6 shadow-xl rounded-3xl sm:px-10 space-y-6">
          {/* Top Portal Switcher (Organization vs Super Admin) */}
          <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-300 gap-1">
            <button
              type="button"
              onClick={() => {
                setAuthPortal("org");
                if (activeOrg) setEmail(`organisationadmin@${activeOrg.slug || "company"}.com`);
              }}
              className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                authPortal === "org"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Organization Portal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthPortal("superadmin");
                setEmail("admin@bigi-platform.io");
              }}
              className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                authPortal === "superadmin"
                  ? "bg-purple-700 text-white shadow-md"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Super Admin Portal</span>
            </button>
          </div>

          {/* Mode Switcher Tabs (Only for Org Portal) */}
          {authPortal === "org" && (
            <div className="flex bg-stone-50 p-1 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  authMode === "login"
                    ? "bg-white text-stone-900 border border-stone-300 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Sign In (Existing Employee)
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  authMode === "signup"
                    ? "bg-white text-stone-900 border border-stone-300 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Sign Up (New Employee → Save Role)
              </button>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleAuthSubmit}>
            {/* Target Role Dropdown for Org Portal */}
            {authPortal === "org" && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Select Employee Role to Store in Organization</span>
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-bold focus:outline-none focus:border-indigo-600"
                >
                  {roleOptions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Super Admin Notice */}
            {authPortal === "superadmin" && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 space-y-1">
                <span className="font-bold block">Super Administrator Access</span>
                <p className="text-[11px] text-purple-700">Access full cross-tenant infrastructure, analytics telemetry, user management, and system logs.</p>
              </div>
            )}

            {/* Full Name Input (Signup Mode) */}
            {authPortal === "org" && authMode === "signup" && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-stone-400" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={authMode === "signup"}
                    placeholder="Jane Doe"
                    className="block w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-medium placeholder-stone-400 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            )}

            {/* Work Email Address Input */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {authPortal === "superadmin" ? "Super Admin Email Address" : `Organization Work Email (${activeOrg?.name || "Workspace"})`}
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-stone-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={authPortal === "superadmin" ? "admin@bigi-platform.io" : `employee@${activeOrg?.slug || "company"}.com`}
                  className="block w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-medium placeholder-stone-400 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-stone-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 font-medium placeholder-stone-400 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white transition ${
                authPortal === "superadmin"
                  ? "bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 shadow-purple-700/30"
                  : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/30"
              }`}
            >
              <span>
                {loading
                  ? "Authenticating..."
                  : authPortal === "superadmin"
                  ? "Sign In to Super Admin Dashboard →"
                  : authMode === "signup"
                  ? `Save Role & Register in ${activeOrg?.name} →`
                  : `Sign In as Organization Admin / Employee →`}
              </span>
            </button>
          </form>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs font-bold text-stone-600">
            <Link href="/onboarding/organization" className="inline-flex items-center gap-1 hover:text-stone-900">
              <ArrowLeft className="h-3.5 w-3.5" /> Change Target Organization
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
