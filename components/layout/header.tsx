"use client";

import React, { useState } from "react";
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

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({
  title = "Executive Overview",
  subtitle = "Real-time growth metrics & analytics for Qubertrix Technologies",
}: HeaderProps) {
  const [selectedOrg, setSelectedOrg] = useState("Qubertrix Technologies");
  const [selectedTimeframe, setSelectedTimeframe] = useState("This Month");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
          <span>Qubertrix Workspace</span>
          <span>/</span>
          <span className="text-slate-400">{title}</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
      </div>

      {/* Action Controls & Right Header Items */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <Link
          href="/explorer"
          className="hidden md:flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs w-64 transition-all"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span className="flex-1 text-left truncate">Search KPIs, datasets, reports...</span>
          <kbd className="bg-slate-700 text-slate-300 text-[10px] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </Link>

        {/* Timeframe Filter Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-slate-700 transition">
            <Calendar className="h-3.5 w-3.5 text-indigo-400" />
            <span>{selectedTimeframe}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
        </div>

        {/* Organization Switcher */}
        <div className="relative hidden lg:block">
          <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-slate-700 transition">
            <Building2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="max-w-[120px] truncate">{selectedOrg}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
        </div>

        {/* AI Ask Assistant Trigger */}
        <Link
          href="/ai-insights"
          className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Ask AI</span>
        </Link>

        {/* Alerts Bell */}
        <Link
          href="/alerts"
          className="relative p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-amber-500 rounded-full animate-pulse"></span>
        </Link>

        {/* User Profile Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition border border-slate-700"
          >
            <div className="h-7 w-7 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              KA
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400 mr-1" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-white">Kiruthika Anand</p>
                <p className="text-[10px] text-slate-400">kiruthika@qubertrix.com</p>
              </div>
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <User className="h-3.5 w-3.5" />
                <span>Profile & Account</span>
              </Link>
              <Link
                href="/subscriptions"
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Billing & Subscription</span>
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 border-t border-slate-800 mt-1"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
