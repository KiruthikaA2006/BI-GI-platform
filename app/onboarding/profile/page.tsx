"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, User, Building, Briefcase, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function CreateProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("Kiruthika Anand");
  const [jobTitle, setJobTitle] = useState("Head of Growth Analytics");
  const [department, setDepartment] = useState("Executive & Strategy");
  const [selectedRole, setSelectedRole] = useState("ORGANIZATION_ADMIN");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("user_name", fullName);
      localStorage.setItem("user_job", jobTitle);
      localStorage.setItem("user_dept", department);
    } catch (e) {}
    // Flowchart: Create Profile -> Organization Check
    router.push("/onboarding/organization");
  };

  return (
    <div className="min-h-screen bg-[#e4dac9] text-stone-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/25">
          <User className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">CREATE YOUR PROFILE</h2>
        <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
          Flowchart Stage: New User Onboarding Setup
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 space-y-6">
          <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-purple-400 flex-shrink-0" />
            <p className="text-xs text-purple-200">
              Your authentication was successful! Complete your user profile details before proceeding to <strong>Organization Check</strong>.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Job Title
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Executive & Strategy">Executive & Strategy</option>
                <option value="Sales & Revenue">Sales & Revenue Growth</option>
                <option value="Marketing & Acquisition">Marketing & Acquisition</option>
                <option value="Data Analytics & BI">Data Analytics & BI</option>
                <option value="Operations & Product">Operations & Product</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition shadow-purple-600/30"
            >
              <span>Save Profile & Proceed to Organization Check</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
