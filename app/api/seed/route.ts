import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockMonthlyTrends, mockRegionalPerformance } from "@/lib/mock-data";

export async function POST() {
  try {
    // 1. Ensure Organization
    let org = await prisma.organization.findUnique({
      where: { slug: "qubertrix" },
    });

    if (!org) {
      org = await prisma.organization.create({
        data: {
          name: "Qubertrix Technologies",
          slug: "qubertrix",
        },
      });
    }

    // 2. Ensure DataSource
    let dataSource = await prisma.dataSource.findFirst({
      where: { organizationId: org.id },
    });

    if (!dataSource) {
      dataSource = await prisma.dataSource.create({
        data: {
          organizationId: org.id,
          name: "Q3 Sales Batch Import (Sales_2026.xlsx)",
          type: "XLSX",
          status: "connected",
          dataVolume: 45,
          syncFrequency: "Manual Upload",
          lastSyncAt: new Date(),
        },
      });
    }

    // 3. Generate 50 realistic transactions for seed
    const seedRows = [];
    const regions = ["South (Chennai / Blr)", "West (Mumbai / Pune)", "North (Delhi / NCR)", "East (Kolkata)"];
    const departments = ["Sales & Marketing", "Customer Success", "Product & Eng", "Finance & Ops"];

    for (let i = 1; i <= 50; i++) {
      const monthIndex = (i % 12);
      const rev = Math.round(150000 + Math.random() * 250000);
      const exp = Math.round(80000 + Math.random() * 120000);

      seedRows.push({
        id: `TXN_${1000 + i}`,
        date: `2026-${String(monthIndex + 1).padStart(2, "0")}-15`,
        revenue: rev,
        expense: exp,
        profit: rev - exp,
        region: regions[i % regions.length],
        department: departments[i % departments.length],
        customer: `Enterprise Client ${i}`,
        salesperson: `Account Rep ${(i % 5) + 1}`,
      });
    }

    // 4. Save to Dataset in PostgreSQL
    const dataset = await prisma.dataset.create({
      data: {
        organizationId: org.id,
        dataSourceId: dataSource.id,
        name: "Sales_2026_Sample_Dataset.xlsx",
        description: "PostgreSQL Data-Driven Sample Business Telemetry",
        rowCount: seedRows.length,
        columns: ["id", "date", "revenue", "expense", "profit", "region", "department", "customer", "salesperson"],
        data: seedRows as any,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Sample business dataset successfully seeded into PostgreSQL!",
      dataset,
    });
  } catch (error) {
    console.error("Seed API Error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
