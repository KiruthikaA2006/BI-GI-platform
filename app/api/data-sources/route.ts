import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mockDataSources } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const activeOrgIdCookie = cookieStore.get("active_org_id")?.value;
    const orgCookie = cookieStore.get("org_session")?.value;
    const adminCookie = cookieStore.get("admin_session")?.value;

    let userSession: any = null;
    if (adminCookie) {
      try { userSession = JSON.parse(adminCookie); } catch (e) {}
    } else if (orgCookie) {
      try { userSession = JSON.parse(orgCookie); } catch (e) {}
    }

    const activeOrgId =
      (activeOrgIdCookie ? decodeURIComponent(activeOrgIdCookie) : null) ||
      userSession?.organizationId;

    if (!activeOrgId) {
      return NextResponse.json({ success: true, dataSources: [] });
    }

    const dbSources = await prisma.dataSource.findMany({
      where: { organizationId: activeOrgId },
      orderBy: { lastSyncAt: "desc" },
    });

    return NextResponse.json({ success: true, dataSources: dbSources });
  } catch (error) {
    return NextResponse.json({ success: true, dataSources: [] });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const rawOrgIdCookie = cookieStore.get("active_org_id")?.value;
    const activeOrgId = rawOrgIdCookie ? decodeURIComponent(rawOrgIdCookie) : "";

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
