import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveActiveDataset, getAllStoredDatasets } from "@/lib/dataset-store";

export async function GET() {
  try {
    const dbDatasets = await prisma.dataset.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (dbDatasets.length > 0) {
      return NextResponse.json({ success: true, datasets: dbDatasets });
    }
    return NextResponse.json({ success: true, datasets: getAllStoredDatasets() });
  } catch (error) {
    return NextResponse.json({ success: true, datasets: getAllStoredDatasets() });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, rowCount, columns, data, dataSourceName } = body;

    const datasetObj = {
      id: `dt_${Date.now()}`,
      name: name || "Custom_Uploaded_Dataset.csv",
      description: description || "Imported dataset saved to PostgreSQL",
      rowCount: rowCount || (Array.isArray(data) ? data.length : 0),
      columns: columns || [],
      data: data || [],
      dataSourceName: dataSourceName || "CSV/XLSX Upload",
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    // Always update active memory store so dashboard updates instantly
    saveActiveDataset(datasetObj);

    // Attempt PostgreSQL database persistence
    try {
      let org = await prisma.organization.findFirst();
      if (!org) {
        org = await prisma.organization.create({
          data: { name: "Qubertrix Technologies", slug: "qubertrix" },
        });
      }

      let dataSource = await prisma.dataSource.findFirst({
        where: { organizationId: org.id },
      });
      if (!dataSource) {
        dataSource = await prisma.dataSource.create({
          data: {
            organizationId: org.id,
            name: dataSourceName || "Imported Dataset File",
            type: name?.endsWith(".xlsx") ? "XLSX" : "CSV",
            status: "connected",
            dataVolume: 25,
            syncFrequency: "Manual Upload",
            lastSyncAt: new Date(),
          },
        });
      }

      await prisma.dataset.create({
        data: {
          organizationId: org.id,
          dataSourceId: dataSource.id,
          name: datasetObj.name,
          description: datasetObj.description,
          rowCount: datasetObj.rowCount,
          columns: datasetObj.columns,
          data: datasetObj.data as any,
        },
      });
    } catch (dbErr) {
      console.warn("PostgreSQL persistence warning (using active memory store):", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Dataset imported successfully!",
      dataset: datasetObj,
    });
  } catch (error) {
    console.error("Dataset POST Error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
