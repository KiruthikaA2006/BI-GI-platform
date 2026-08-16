"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Search, Filter, Database, Play, Download, Table, FileSpreadsheet, RefreshCw } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

export default function AnalystExplorerPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM business_dataset WHERE organization_id = active_tenant;");

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);

    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data);
        }
      })
      .catch((err) => console.error("Error fetching stats for analyst explorer:", err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = stats?.metrics;
  const regional = stats?.regional || [];
  const trends = stats?.trends || [];

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-cyan-500">
      <Sidebar currentRole="ANALYST" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Analyst Data Explorer" subtitle="Analyst Scope: Interactive Query Workbench & Slice-and-Dice Analytics" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800">Interactive Query Workbench • {currentOrgName}</span>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">Data Explorer & Query Workbench</h1>
              <p className="text-xs text-stone-600">Slice and dice transactional dataset rows, filter by department/region, and run SQL queries</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
                PostgreSQL RLS Active
              </span>
            </div>
          </div>

          {/* Query Filter Bar */}
          <div className="bg-white border border-stone-300 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-stone-500" />
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800"
              >
                <option value="All Regions">All Regions</option>
                <option value="North India">North India</option>
                <option value="South India">South India</option>
                <option value="West India">West India</option>
                <option value="East India">East India</option>
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800"
              >
                <option value="All Departments">All Departments</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Support">Support</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Execute Filtered Query</span>
            </button>
          </div>

          {/* SQL Sandbox Box */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <Play className="h-4 w-4 text-cyan-600" />
                <span>SQL Workbench Console</span>
              </h3>
              <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded border border-stone-200">
                PostgreSQL Engine
              </span>
            </div>

            <textarea
              rows={3}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full bg-stone-900 text-emerald-400 font-mono text-xs p-4 rounded-2xl border border-stone-800 focus:outline-none"
            />
          </div>

          {/* Region Breakdown Table */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-base font-black text-stone-900">Regional Data Aggregation Breakdown</h3>

            {regional.length > 0 ? (
              <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="p-3">Territory / Region</th>
                      <th className="p-3">Transaction Count</th>
                      <th className="p-3">Aggregated Amount (INR)</th>
                      <th className="p-3">Territory Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-white font-medium">
                    {regional.map((r: any, idx: number) => (
                      <tr key={idx} className="hover:bg-stone-50 transition">
                        <td className="p-3 font-bold text-stone-900">{r.region}</td>
                        <td className="p-3 font-mono font-bold text-stone-800">{r.sales} records</td>
                        <td className="p-3 font-mono font-bold text-indigo-700">₹{(r.revenue || 0).toLocaleString()}</td>
                        <td className="p-3">
                          <span className="bg-indigo-50 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-200">
                            {r.share}% Share
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 bg-stone-50 border border-stone-200 rounded-2xl text-center text-xs text-stone-600 font-bold">
                No dataset rows available to aggregate. Ingest CSV data in Data Ingestion to populate.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
