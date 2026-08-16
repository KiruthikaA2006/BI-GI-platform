import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getActiveDataset } from "@/lib/dataset-store";
import {
  calculateExecutiveMetrics,
  calculateMonthlyTrends,
  calculateRegionalBreakdown,
  calculateStatisticalForecast,
  BusinessRow,
} from "@/lib/analytics";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const qOrgId = searchParams.get("orgId");
    const region = searchParams.get("region") || "All Regions";
    const department = searchParams.get("department") || "All Departments";
    const product = searchParams.get("product") || "All Products";

    const filter = { region, department, product };

    const cookieStore = await cookies();
    const activeOrgIdCookie = cookieStore.get("active_org_id")?.value;
    const activeOrgNameCookie = cookieStore.get("active_org_name")?.value;
    const orgSessionCookie = cookieStore.get("org_session")?.value;
    const adminSessionCookie = cookieStore.get("admin_session")?.value;

    let userSession: any = null;
    if (adminSessionCookie) {
      try { userSession = JSON.parse(adminSessionCookie); } catch (e) {}
    } else if (orgSessionCookie) {
      try { userSession = JSON.parse(orgSessionCookie); } catch (e) {}
    }

    const activeOrgId =
      qOrgId ||
      (activeOrgIdCookie ? decodeURIComponent(activeOrgIdCookie) : null) ||
      userSession?.organizationId ||
      "";

    const activeOrgName =
      (activeOrgNameCookie ? decodeURIComponent(activeOrgNameCookie) : null) ||
      userSession?.organizationName ||
      "Organization Workspace";

    if (!activeOrgId) {
      return NextResponse.json({
        success: true,
        rawRowsCount: 0,
        datasetInfo: null,
        organizationName: activeOrgName,
        metrics: calculateExecutiveMetrics([]),
        trends: calculateMonthlyTrends([]),
        regional: calculateRegionalBreakdown([]),
        forecasts: calculateStatisticalForecast([]),
      });
    }

    // 1. Check Active Store dataset for active organization
    let activeDataset = getActiveDataset(activeOrgId);
    let rows: BusinessRow[] = [];
    let datasetMeta: any = null;

    if (activeDataset && activeDataset.data && activeDataset.data.length > 0) {
      rows = activeDataset.data;
      datasetMeta = {
        id: activeDataset.id,
        organizationId: activeOrgId,
        name: activeDataset.name,
        rowCount: activeDataset.rowCount,
        updatedAt: activeDataset.updatedAt,
      };
    } else {
      // 2. Query PostgreSQL Database strictly for active organization
      try {
        const dbDataset = await prisma.dataset.findFirst({
          where: { organizationId: activeOrgId },
          orderBy: { createdAt: "desc" },
        });

        if (dbDataset && dbDataset.data && Array.isArray(dbDataset.data) && (dbDataset.data as any[]).length > 0) {
          rows = dbDataset.data as BusinessRow[];
          datasetMeta = {
            id: dbDataset.id,
            organizationId: dbDataset.organizationId,
            name: dbDataset.name,
            rowCount: dbDataset.rowCount,
            updatedAt: dbDataset.updatedAt.toISOString().replace("T", " ").substring(0, 19),
          };
        }
      } catch (dbErr) {
        console.warn("PostgreSQL query warning:", dbErr);
      }
    }

    if (rows.length > 0 && datasetMeta) {
      const metrics = calculateExecutiveMetrics(rows, filter);
      const trends = calculateMonthlyTrends(rows, filter);
      const regional = calculateRegionalBreakdown(rows, filter);
      const forecasts = calculateStatisticalForecast(rows);

      return NextResponse.json({
        success: true,
        source: "database",
        organizationId: activeOrgId,
        organizationName: activeOrgName,
        datasetInfo: datasetMeta,
        metrics,
        trends,
        regional,
        forecasts,
        rawRowsCount: rows.length,
      });
    }

    // No dataset present yet for this organization
    return NextResponse.json({
      success: true,
      source: "none",
      organizationId: activeOrgId,
      organizationName: activeOrgName,
      datasetInfo: null,
      metrics: null,
      trends: [],
      regional: [],
      forecasts: [],
      rawRowsCount: 0,
    });
  } catch (error) {
    console.error("Dashboard Stats API Error:", error);
    return NextResponse.json({
      success: true,
      source: "error_fallback",
      datasetInfo: null,
      metrics: null,
      trends: [],
      regional: [],
      forecasts: [],
      rawRowsCount: 0,
    });
  }
}
