"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getActiveOrganization } from "@/lib/org-context";
import { getCachedStats, setCachedStats } from "@/lib/stats-cache";

interface TelemetryContextType {
  stats: any;
  loading: boolean;
  currentOrgName: string;
  refreshStats: () => Promise<void>;
}

const TelemetryContext = createContext<TelemetryContextType>({
  stats: null,
  loading: false,
  currentOrgName: "Organization Workspace",
  refreshStats: async () => {},
});

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");

  const loadTelemetry = useCallback(async () => {
    if (typeof window === "undefined") return;
    const active = getActiveOrganization();
    if (!active) return;

    const orgId = active.id || "default";
    if (active.name) setCurrentOrgName(active.name);

    // Instant Client Cache lookup for 0ms page rendering
    const cached = getCachedStats(orgId);
    if (cached) {
      setStats(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }

    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data);
        setCachedStats(orgId, data);
        if (data.organizationName) setCurrentOrgName(data.organizationName);
      }
    } catch (err) {
      console.warn("Telemetry fetch background sync warning:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTelemetry();
  }, [loadTelemetry]);

  return (
    <TelemetryContext.Provider value={{ stats, loading, currentOrgName, refreshStats: loadTelemetry }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  return useContext(TelemetryContext);
}
