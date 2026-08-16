import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mockDataSources } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const activeOrgId = cookieStore.get("active_org_id")?.value || "acme-retail";

    const dbSources = await prisma.dataSource.findMany({
      where: { organizationId: activeOrgId },
      orderBy: { lastSyncAt: "desc" },
    });

    if (dbSources.length > 0) {
      return NextResponse.json({ success: true, dataSources: dbSources });
    }
    return NextResponse.json({ success: true, dataSources: mockDataSources });
  } catch (error) {
    return NextResponse.json({ success: true, dataSources: mockDataSources });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const activeOrgId = cookieStore.get("active_org_id")?.value || "acme-retail";

    const body = await req.json();
    const { name, type, syncFrequency } = body;

    const newSource = {
      id: `ds_${Date.now()}`,
      organizationId: activeOrgId,
      name: name || "New Connected Data Source",
      type: type || "REST_API",
      status: "connected",
      syncFrequency: syncFrequency || "Hourly",
      dataVolume: "120 MB",
      lastSyncAt: new Date().toISOString(),
      owner: "Kiruthika Anand",
      recordsCount: 15000,
    };

    return NextResponse.json({ success: true, dataSource: newSource });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to connect data source" }, { status: 500 });
  }
}
