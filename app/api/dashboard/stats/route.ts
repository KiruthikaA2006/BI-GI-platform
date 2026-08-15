import { NextResponse } from "next/server";
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

    // 1. Check Active Store dataset (from recent upload)
    let activeDataset = getActiveDataset();
    let rows: BusinessRow[] = [];
    let datasetMeta: any = null;

    if (activeDataset && activeDataset.data && activeDataset.data.length > 0) {
      rows = activeDataset.data;
      datasetMeta = {
        id: activeDataset.id,
        name: activeDataset.name,
        rowCount: activeDataset.rowCount,
        updatedAt: activeDataset.updatedAt,
      };
    } else {
      // 2. Query PostgreSQL Database
      try {
        const dbDataset = await prisma.dataset.findFirst({
          orderBy: { createdAt: "desc" },
        });

        if (dbDataset && dbDataset.data && Array.isArray(dbDataset.data) && (dbDataset.data as any[]).length > 0) {
          rows = dbDataset.data as BusinessRow[];
          datasetMeta = {
            id: dbDataset.id,
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
        datasetInfo: datasetMeta,
        metrics,
        trends,
        regional,
        forecasts,
        rawRowsCount: rows.length,
      });
    }

    // No dataset present yet
    return NextResponse.json({
      success: true,
      source: "none",
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
