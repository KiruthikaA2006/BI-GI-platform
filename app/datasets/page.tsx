"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TableProperties, Search, Database, Calendar, Eye, FileSpreadsheet, UploadCloud } from "lucide-react";
import { mockDatasets } from "@/lib/mock-data";

export default function DatasetsPage() {
  const [search, setSearch] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<any | null>(null);

  const filtered = mockDatasets.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Datasets" subtitle="Tenant dataset repository, schema schemas, and row Telemetry" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Managed Datasets</h2>
              <p className="text-xs text-slate-400">Structured table datasets available for BI querying & AI analysis</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search datasets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 w-64 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <Link
                href="/data-sources/import"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Import Dataset</span>
              </Link>
            </div>
          </div>

          {/* Datasets Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Dataset Name</th>
                  <th className="p-4">Source Connector</th>
                  <th className="p-4">Row Count</th>
                  <th className="p-4">Columns</th>
                  <th className="p-4">Last Updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((dataset) => (
                  <tr key={dataset.id} className="hover:bg-slate-800/50 transition">
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mt-0.5">
                          <TableProperties className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-bold text-white block text-sm">{dataset.name}</span>
                          <span className="text-slate-400 text-xs line-clamp-1">{dataset.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-800 text-indigo-300 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                        {dataset.dataSourceName}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">
                      {dataset.rowCount.toLocaleString()} rows
                    </td>
                    <td className="p-4 text-slate-400">
                      {dataset.columns.length} columns
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">{dataset.updatedAt}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedDataset(dataset)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg font-medium transition"
                      >
                        Inspect Schema
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal Inspector */}
          {selectedDataset && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">{selectedDataset.name} Schema</h3>
                  <button
                    onClick={() => setSelectedDataset(null)}
                    className="text-slate-400 hover:text-white text-xs font-bold"
                  >
                    ✕ Close
                  </button>
                </div>
                <p className="text-xs text-slate-400">{selectedDataset.description}</p>

                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Column Headers</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDataset.columns.map((col: string) => (
                      <span key={col} className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg text-xs font-mono text-indigo-300">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setSelectedDataset(null)}
                    className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-xl font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
