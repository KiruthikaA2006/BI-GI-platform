"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, ArrowLeft, Globe, User, Building2 } from "lucide-react";
import { getActiveOrganization, registerOrgMember, Organization } from "@/lib/org-context";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [activeOrg, setActiveOrgState] = useState<Organization | null>(null);
  const [selectedRole, setSelectedRole] = useState<"ORGANIZATION_ADMIN" | "EXECUTIVE" | "DEPARTMENT_MANAGER" | "ANALYST" | "SUPER_ADMIN">("ORGANIZATION_ADMIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const org = getActiveOrganization();
    if (org) {
      setActiveOrgState(org);
      const domain = org.slug ? `${org.slug}.com` : "company.com";
      setEmail(`admin@${domain}`);
    }
  }, []);

  const roleOptions = [
    { id: "ORGANIZATION_ADMIN", label: "Organization Admin — Full Tenant Controls" },
    { id: "EXECUTIVE", label: "Executive — Growth & Revenue Cockpit" },
    { id: "DEPARTMENT_MANAGER", label: "Department Manager — Dept Metrics & Goals" },
    { id: "ANALYST", label: "Analyst — Data Pipeline & Dashboards" },
    { id: "SUPER_ADMIN", label: "Super Admin — Platform System Controls" },
  ];

  const handleRoleChange = (roleId: any) => {
    setSelectedRole(roleId);
    const domain = activeOrg?.slug ? `${activeOrg.slug}.com` : "company.com";
    if (roleId === "EXECUTIVE") setEmail(`ceo@${domain}`);
    else if (roleId === "DEPARTMENT_MANAGER") setEmail(`manager@${domain}`);
    else if (roleId === "ANALYST") setEmail(`analyst@${domain}`);
    else if (roleId === "SUPER_ADMIN") setEmail(`superadmin@platform.com`);
    else setEmail(`admin@${domain}`);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.setItem("active_role", selectedRole);
      localStorage.setItem("user_email", email);

      if (activeOrg) {
        // Register user and role under the active organization's members store
        const namePart = email.split("@")[0].replace(/[^a-zA-Z]/g, " ").trim();
        const formattedName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : "Employee User";

        registerOrgMember(activeOrg.id, {
          name: `${formattedName} (${selectedRole.replace("_", " ")})`,
          email: email,
          role: selectedRole,
          designation:
            selectedRole === "EXECUTIVE"
              ? "Executive Leader"
              : selectedRole === "DEPARTMENT_MANAGER"
              ? "Department Manager"
              : selectedRole === "ANALYST"
              ? "Senior Data Analyst"
              : "Organization Admin",
          department:
            selectedRole === "EXECUTIVE"
              ? "Executive Office"
              : selectedRole === "DEPARTMENT_MANAGER"
              ? "Operations & Sales"
              : selectedRole === "ANALYST"
              ? "Data Science"
              : "Organization Governance",
          status: "active",
        });
      }

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: selectedRole,
          organizationId: activeOrg?.id,
          organizationName: activeOrg?.name,
          action: authMode,
        }),
      });
      const data = await res.json();

      if (authMode === "signup") {
        router.push("/onboarding/profile");
      } else if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        if (selectedRole === "SUPER_ADMIN") router.push("/admin/dashboard");
        else if (selectedRole === "EXECUTIVE") router.push("/executive/command-center");
        else if (selectedRole === "DEPARTMENT_MANAGER") router.push("/manager/dashboard");
        else if (selectedRole === "ANALYST") router.push("/analyst/dashboard");
        else router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      if (selectedRole === "SUPER_ADMIN") router.push("/admin/dashboard");
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
          <Zap className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-black text-stone-900 tracking-tight">
          {authMode === "login" ? "ORGANIZATION EMPLOYEE SIGN IN" : "CREATE EMPLOYEE ACCOUNT"}
        </h2>

        {/* Dynamic Organization Banner Badge */}
        {activeOrg && (
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm">
            <Building2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Target Workspace: {activeOrg.name}</span>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Main White Card Container */}
        <div className="bg-white border border-stone-300 py-8 px-6 shadow-xl rounded-3xl sm:px-10 space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition ${
                authMode === "login"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Sign In (Existing Employee)
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("signup")}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition ${
                authMode === "signup"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Sign Up (New Employee → Save Role)
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleAuthSubmit}>
            {/* Target Role Dropdown */}
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

            {/* Work Email Address Input */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Organization Work Email ({activeOrg?.name})
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
                  placeholder={`employee@${activeOrg?.slug || "company"}.com`}
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

            {/* OAuth SSO Buttons */}
            <div className="pt-2">
              <span className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider text-center mb-2">
                Or Continue With Single Sign-On ({activeOrg?.name} SSO)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => router.push(authMode === "signup" ? "/onboarding/profile" : "/dashboard")}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-800 hover:bg-stone-100 transition shadow-sm"
                >
                  <Globe className="h-4 w-4 text-indigo-600" />
                  <span>Google Workspace</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push(authMode === "signup" ? "/onboarding/profile" : "/dashboard")}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold text-stone-800 hover:bg-stone-100 transition shadow-sm"
                >
                  <ShieldCheck className="h-4 w-4 text-purple-600" />
                  <span>GitHub SSO</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 transition shadow-indigo-600/30"
            >
              <span>
                {loading
                  ? "Authenticating Employee..."
                  : authMode === "signup"
                  ? `Save Role & Register in ${activeOrg?.name} →`
                  : `Sign In to ${activeOrg?.name || "Organization"} →`}
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
