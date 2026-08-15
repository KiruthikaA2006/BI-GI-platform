import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MainDashboard } from "@/components/dashboard/main-dashboard";

export default function OrganizationDashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Organization Sidebar */}
      <Sidebar currentRole="ORGANIZATION_ADMIN" />

      {/* Workspace Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Executive Dashboard" subtitle="Real-time growth metrics & performance telemetry" />
        <main className="flex-1">
          <MainDashboard />
        </main>
      </div>
    </div>
  );
}
