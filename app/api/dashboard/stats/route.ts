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
    const region = searchParams.get("region") || "All Regions";
    const department = searchParams.get("department") || "All Departments";
    const product = searchParams.get("product") || "All Products";

    const filter = { region, department, product };

    const cookieStore = await cookies();
    const activeOrgId = cookieStore.get("active_org_id")?.value || "acme-retail";
    const activeOrgName = cookieStore.get("active_org_name")?.value || "Acme Global Retail";

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
