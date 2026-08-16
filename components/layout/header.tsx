"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Building2,
  ChevronDown,
  Sparkles,
  Calendar,
  Filter,
  Plus,
  User,
  LogOut,
  Settings,
} from "lucide-react";

import { FlowNavigator } from "./flow-navigator";
import { getActiveOrganization, performLogout } from "@/lib/org-context";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({
  title = "Executive Overview",
  subtitle = "Real-time growth metrics & analytics",
}: HeaderProps) {
  const [selectedOrg, setSelectedOrg] = useState("Organization Workspace");
  const [userEmail, setUserEmail] = useState("admin@company.com");
  const [selectedTimeframe, setSelectedTimeframe] = useState("This Month");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setSelectedOrg(org.name);
    const storedEmail = localStorage.getItem("user_email");
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  return (
    <div className="sticky top-0 z-30">
      <FlowNavigator />
      <header className="bg-[#e4dac9]/95 backdrop-blur-md border-b border-stone-300/80 px-6 py-3 flex items-center justify-between gap-4">
        {/* Page Title */}
        <div>
          <h1 className="text-xl font-black text-stone-900 tracking-tight">{title}</h1>
        </div>

        {/* Action Controls & Right Header Items */}
        <div className="flex items-center gap-3">
          {/* Global Search Bar */}
          <Link
            href="/explorer"
            className="hidden md:flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-500 hover:text-stone-900 border border-stone-300 rounded-lg px-3 py-1.5 text-xs w-64 transition-all shadow-sm"
          >
            <Search className="h-3.5 w-3.5 text-stone-400" />
            <span className="flex-1 text-left truncate">Search KPIs, datasets, reports...</span>
            <kbd className="bg-stone-100 text-stone-600 text-[10px] px-1.5 py-0.5 rounded font-mono border border-stone-200">⌘K</kbd>
          </Link>

          {/* Dynamic Active Organization Indicator */}
          <Link href="/onboarding/organization" className="relative hidden lg:block">
            <div className="flex items-center gap-2 bg-white border border-stone-300 text-stone-800 rounded-lg px-3 py-1.5 text-xs font-bold hover:bg-stone-50 transition shadow-sm">
              <Building2 className="h-3.5 w-3.5 text-emerald-600" />
              <span className="max-w-[140px] truncate">{selectedOrg}</span>
              <ChevronDown className="h-3 w-3 text-stone-500" />
            </div>
          </Link>

          {/* AI Ask Assistant Trigger */}
          <Link
            href="/ai-insights"
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-1.5 text-xs font-bold shadow transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ask AI</span>
          </Link>

          {/* Alerts Bell */}
          <Link
            href="/alerts"
            className="relative p-2 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 transition shadow-sm"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-amber-500 rounded-full animate-pulse"></span>
          </Link>

          {/* User Profile Avatar Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-lg bg-white hover:bg-stone-50 transition border border-stone-300 shadow-sm"
            >
              <div className="h-7 w-7 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                EA
              </div>
              <ChevronDown className="h-3 w-3 text-stone-500 mr-1" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-stone-100">
                  <p className="text-xs font-bold text-stone-900 truncate">{selectedOrg} User</p>
                  <p className="text-[10px] text-stone-500 truncate">{userEmail}</p>
                </div>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 font-medium"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Profile & Account</span>
                </Link>
                <Link
                  href="/subscriptions"
                  className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 font-medium"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Billing & Subscription</span>
                </Link>
                <button
                  onClick={performLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 border-t border-stone-100 mt-1 font-semibold cursor-pointer text-left"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
