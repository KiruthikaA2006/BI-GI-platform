import { NextResponse } from "next/server";
import { mockDataSources } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const dbSources = await prisma.dataSource.findMany();
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
    const body = await req.json();
    const { name, type, syncFrequency } = body;

    const newSource = {
      id: `ds_${Date.now()}`,
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
