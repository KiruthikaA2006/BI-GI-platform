"use client";

interface StatsCacheItem {
  data: any;
  timestamp: number;
}

const memoryCache: Record<string, StatsCacheItem> = {};
const CACHE_TTL_MS = 120000; // 2 minutes client cache

/**
 * Retrieve cached dashboard stats for the active organization.
 */
export function getCachedStats(orgId: string): any | null {
  if (!orgId || typeof window === "undefined") return null;
  const cached = memoryCache[orgId];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
}

/**
 * Store dashboard stats in client memory for instant section page transitions.
 */
export function setCachedStats(orgId: string, data: any): void {
  if (!orgId || typeof window === "undefined" || !data) return;
  memoryCache[orgId] = {
    data,
    timestamp: Date.now(),
  };
}

/**
 * Clear client-side stats cache on logout or organization switch.
 */
export function clearStatsCache(): void {
  for (const key in memoryCache) {
    delete memoryCache[key];
  }
}
