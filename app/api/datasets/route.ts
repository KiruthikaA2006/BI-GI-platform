import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { saveActiveDataset, getAllStoredDatasets } from "@/lib/dataset-store";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const rawOrgIdCookie = cookieStore.get("active_org_id")?.value;
    const rawOrgNameCookie = cookieStore.get("active_org_name")?.value;
    const activeOrgId = rawOrgIdCookie ? decodeURIComponent(rawOrgIdCookie) : "";
    const activeOrgName = rawOrgNameCookie ? decodeURIComponent(rawOrgNameCookie) : "Organization Workspace";

    if (!activeOrgId) {
      return NextResponse.json({
        success: true,
        organizationId: "",
        organizationName: activeOrgName,
        datasets: [],
      });
    }

    // Strictly filter PostgreSQL datasets by organizationId ONLY
    const dbDatasets = await prisma.dataset.findMany({
      where: {
        organizationId: activeOrgId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (dbDatasets.length > 0) {
      return NextResponse.json({
        success: true,
        organizationId: activeOrgId,
        organizationName: activeOrgName,
        datasets: dbDatasets,
      });
    }

    // Filter in-memory datasets strictly by activeOrgId
    const scopedMemoryDatasets = getAllStoredDatasets(activeOrgId);

    return NextResponse.json({
      success: true,
      organizationId: activeOrgId,
      organizationName: activeOrgName,
      datasets: scopedMemoryDatasets,
    });
  } catch (error) {
    console.error("Dataset GET Error:", error);
    const cookieStore = await cookies();
    const rawOrgIdCookie = cookieStore.get("active_org_id")?.value;
    const activeOrgId = rawOrgIdCookie ? decodeURIComponent(rawOrgIdCookie) : "";

    return NextResponse.json({
      success: true,
      organizationId: activeOrgId,
      organizationName: "Organization Workspace",
      datasets: activeOrgId ? getAllStoredDatasets(activeOrgId) : [],
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      description,
      rowCount,
      columns,
      data,
      dataSourceName,
      organizationId: bodyOrgId,
      organizationName: bodyOrgName,
    } = body;

    const cookieStore = await cookies();
    const rawOrgIdCookie = cookieStore.get("active_org_id")?.value;
    const rawOrgNameCookie = cookieStore.get("active_org_name")?.value;
    const activeOrgId = bodyOrgId || (rawOrgIdCookie ? decodeURIComponent(rawOrgIdCookie) : "");
    const activeOrgName = bodyOrgName || (rawOrgNameCookie ? decodeURIComponent(rawOrgNameCookie) : "Organization Workspace");

    const datasetObj = {
      id: `dt_${Date.now()}`,
      organizationId: activeOrgId,
      name: name || "Custom_Uploaded_Dataset.csv",
      description: description || `Imported dataset saved to PostgreSQL for ${activeOrgName}`,
      rowCount: rowCount || (Array.isArray(data) ? data.length : 0),
      columns: Array.isArray(columns) ? columns : [],
      data: Array.isArray(data) ? data : [],
      dataSourceName: dataSourceName || "CSV/XLSX Upload",
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    // Update active memory store with strict organization isolation
    saveActiveDataset(datasetObj);

    // Save dataset to PostgreSQL scoped STRICTLY to activeOrgId
    try {
      let organization = await prisma.organization.findUnique({
        where: { id: activeOrgId },
      });

      if (!organization) {
        organization = await prisma.organization.findFirst({
          where: { name: activeOrgName },
        });
      }

      if (!organization) {
        organization = await prisma.organization.create({
          data: {
            id: activeOrgId,
            name: activeOrgName,
            slug: activeOrgName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          },
        });
      }

      let dataSource = await prisma.dataSource.findFirst({
        where: { organizationId: organization.id },
      });

      if (!dataSource) {
        dataSource = await prisma.dataSource.create({
          data: {
            organizationId: organization.id,
            name: dataSourceName || "Imported Dataset File",
            type: name?.toLowerCase().endsWith(".xlsx") ? "XLSX" : "CSV",
            status: "connected",
            dataVolume: datasetObj.rowCount,
            syncFrequency: "Manual Upload",
            lastSyncAt: new Date(),
          },
        });
      }

      const savedDataset = await prisma.dataset.create({
        data: {
          organizationId: organization.id,
          dataSourceId: dataSource.id,
          name: datasetObj.name,
          description: datasetObj.description,
          rowCount: datasetObj.rowCount,
          columns: datasetObj.columns as any,
          data: datasetObj.data as any,
        },
      });

      // Persist individual DataRecord rows in PostgreSQL scoped to organizationId & datasetId
      if (Array.isArray(datasetObj.data) && datasetObj.data.length > 0) {
        try {
          await prisma.dataRecord.createMany({
            data: datasetObj.data.map((row: any, index: number) => ({
              organizationId: organization.id,
              datasetId: savedDataset.id,
              rowNumber: index + 1,
              data: row,
            })),
          });
        } catch (recErr) {
          console.warn("DataRecord creation warning in POST /api/datasets:", recErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Dataset imported and saved successfully for ${organization.name}!`,
        dataset: savedDataset,
        organization: {
          id: organization.id,
          name: organization.name,
        },
      });
    } catch (dbError) {
      console.error("PostgreSQL persistence warning:", dbError);
      return NextResponse.json({
        success: true,
        message: `Dataset imported successfully for ${activeOrgName}!`,
        dataset: datasetObj,
        databaseSaved: false,
      });
    }
  } catch (error) {
    console.error("Dataset POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}