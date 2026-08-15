"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Users,
  Receipt,
  Target,
  Sparkles,
  ArrowUpRight,
  Download,
  Database,
  UploadCloud,
  RefreshCw,
  ShieldAlert,
  ChevronRight,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { RoleDashboardView } from "./role-dashboard-view";

export function MainDashboard() {
  const [selectedRole, setSelectedRole] = useState<string>("ORGANIZATION_ADMIN");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [timeRange, setTimeRange] = useState("YTD");

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [seeding, setSeeding] = useState(false);

  // Synchronize authenticated role on mount
  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.role) {
          setSelectedRole(data.user.role);
          try {
            localStorage.setItem("active_role", data.user.role);
          } catch (e) {}
        } else {
          try {
            const storedRole = localStorage.getItem("active_role");
            if (storedRole) setSelectedRole(storedRole);
          } catch (e) {}
        }
      })
      .catch(() => {
        try {
          const storedRole = localStorage.getItem("active_role");
          if (storedRole) setSelectedRole(storedRole);
        } catch (e) {}
      });
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const url = `/api/dashboard/stats?region=${encodeURIComponent(selectedRegion)}&department=${encodeURIComponent(
        selectedDepartment
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [selectedRegion, selectedDepartment, timeRange]);

  const handleSeedDemoData = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await fetchDashboardStats();
      } else {
        alert("Seed Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  const hasData = dashboardData?.metrics && dashboardData?.source === "database";

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Banner / Dataset Source Indicator */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Live PostgreSQL Analytics</h2>
              {hasData && (
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Data-Driven DB
                </span>
              )}
            </div>
            {hasData ? (
              <p className="text-xs text-slate-400 mt-0.5">
                Data Source: <strong className="text-indigo-300">{dashboardData.datasetInfo.name}</strong> •{" "}
                <span className="text-slate-300">{dashboardData.datasetInfo.rowCount.toLocaleString()} records</span> •{" "}
                <span className="text-slate-400">Updated: {dashboardData.datasetInfo.updatedAt}</span>
              </p>
            ) : (
              <p className="text-xs text-amber-400 mt-0.5">No dataset uploaded yet. Seed sample or upload CSV/XLSX.</p>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Role Indicator Badge */}
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Active Session:</span>
            <span className="text-indigo-400 font-bold uppercase">{selectedRole.replace("_", " ")}</span>
          </div>

          <Link
            href="/data-sources/import"
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl px-3 py-2 font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Upload Dataset</span>
          </Link>
        </div>
      </div>

      {/* EMPTY STATE VIEW */}
      {!hasData && !loading && (
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl text-center space-y-5 max-w-xl mx-auto shadow-2xl">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertCircle className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">No Business Data Connected</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Upload your CSV/XLSX file or seed a sample dataset into PostgreSQL to dynamically generate real-time analytics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleSeedDemoData}
              disabled={seeding}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              {seeding ? "Seeding to PostgreSQL..." : "⚡ Seed Sample Dataset into PostgreSQL"}
            </button>
            <Link
              href="/data-sources/import"
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              Upload CSV / XLSX File
            </Link>
          </div>
        </div>
      )}

      {/* ROLE TAILORED DASHBOARD VIEW */}
      {hasData && (
        <RoleDashboardView role={selectedRole} data={dashboardData} />
      )}
    </div>
  );
}
