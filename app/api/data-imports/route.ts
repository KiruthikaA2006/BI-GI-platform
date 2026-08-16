import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { saveActiveDataset } from "@/lib/dataset-store";

/**
  1. GET /api/data-imports
  Retrieve all business dataset imports for the active organization from PostgreSQL database
 */
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const orgCookie = cookieStore.get("org_session")?.value;
    const adminCookie = cookieStore.get("admin_session")?.value;
    const activeOrgIdCookie = cookieStore.get("active_org_id")?.value;
    const activeOrgNameCookie = cookieStore.get("active_org_name")?.value;

    let userSession: any = null;
    if (adminCookie) {
      try { userSession = JSON.parse(adminCookie); } catch (e) {}
    } else if (orgCookie) {
      try { userSession = JSON.parse(orgCookie); } catch (e) {}
    }

    const orgId =
      (activeOrgIdCookie ? decodeURIComponent(activeOrgIdCookie) : null) ||
      userSession?.organizationId;

    const orgName =
      (activeOrgNameCookie ? decodeURIComponent(activeOrgNameCookie) : null) ||
      userSession?.organizationName;

    // If no authenticated organization can be resolved, return HTTP 401
    if (!orgId) {
      return NextResponse.json(
        { success: false, error: "Authentication required: No active organization session found" },
        { status: 401 }
      );
    }

    // Query PostgreSQL DataImport model strictly for orgId
    let dbImports: any[] = [];
    try {
      dbImports = await prisma.dataImport.findMany({
        where: { organizationId: orgId },
        include: { files: true },
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.warn("Database query for DataImport fallback:", dbErr);
    }

    // Format response
    const formattedImports = dbImports.map((imp) => {
      const totalRows = imp.files
        ? imp.files.reduce((acc: number, f: any) => acc + (f.rowCount || 0), 0)
        : 0;
      return {
        id: imp.id,
        organizationId: imp.organizationId,
        datasetName: imp.datasetName,
        uploadedBy: imp.uploadedBy,
        status: imp.status,
        createdAt: imp.createdAt,
        completedAt: imp.completedAt,
        filesCount: imp.files ? imp.files.length : 0,
        totalRows,
        files: imp.files || [],
      };
    });

    return NextResponse.json({
      success: true,
      organizationId: orgId,
      organizationName: orgName || orgId,
      imports: formattedImports,
    });
  } catch (error) {
    console.error("GET /api/data-imports error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data imports from database" },
      { status: 500 }
    );
  }
}

/**
  2. POST /api/data-imports
  Persist a new business dataset import (multiple CSV files) directly into PostgreSQL database tables:
  - DataImport
  - ImportFile
  - Dataset
  - DataSource
 */
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const orgCookie = cookieStore.get("org_session")?.value;
    const adminCookie = cookieStore.get("admin_session")?.value;
    const activeOrgIdCookie = cookieStore.get("active_org_id")?.value;
    const activeOrgNameCookie = cookieStore.get("active_org_name")?.value;

    let userSession: any = null;
    if (adminCookie) {
      try { userSession = JSON.parse(adminCookie); } catch (e) {}
    } else if (orgCookie) {
      try { userSession = JSON.parse(orgCookie); } catch (e) {}
    }

    if (!userSession) {
      return NextResponse.json(
        { success: false, error: "Authentication required: Log in to perform dataset imports" },
        { status: 401 }
      );
    }

    const userRole = (userSession.role || "ANALYST").toUpperCase();

    // REQUIRE AUTHORIZATION: Admin (SUPER_ADMIN, ORGANIZATION_ADMIN, OWNER) or Analyst (ANALYST)
    const allowedRoles = ["SUPER_ADMIN", "ORGANIZATION_ADMIN", "OWNER", "ANALYST"];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        {
          success: false,
          error: "Authorization Error: Only Admin and Analyst roles are permitted to perform business dataset imports.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { datasetName, files, organizationId: bodyOrgId, organizationName: bodyOrgName } = body;

    if (!datasetName || !files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing datasetName or files payload" },
        { status: 400 }
      );
    }

    // Resolve active tenant organization ID & Name
    const resolvedOrgId =
      bodyOrgId ||
      (activeOrgIdCookie ? decodeURIComponent(activeOrgIdCookie) : null) ||
      userSession.organizationId;

    const resolvedOrgName =
      bodyOrgName ||
      (activeOrgNameCookie ? decodeURIComponent(activeOrgNameCookie) : null) ||
      userSession.organizationName ||
      resolvedOrgId;

    if (!resolvedOrgId) {
      return NextResponse.json(
        { success: false, error: "Authentication required: Active organization context not found" },
        { status: 401 }
      );
    }

    // Verify organization exists in PostgreSQL Organization table
    let existingOrg = await prisma.organization.findFirst({
      where: {
        OR: [
          { id: resolvedOrgId },
          { slug: resolvedOrgId },
          { name: resolvedOrgName },
        ],
      },
    });

    // If org does not exist yet in DB, auto-provision organization record
    if (!existingOrg) {
      existingOrg = await prisma.organization.create({
        data: {
          id: resolvedOrgId,
          name: resolvedOrgName || "Organization Workspace",
          slug: resolvedOrgId.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        },
      });
    }

    const organizationId = existingOrg.id;
    const organizationName = existingOrg.name;

    const uploadedBy = userSession.name || userSession.email || "Authorized User";
    const totalRowsCount = files.reduce((acc: number, f: any) => acc + (f.rowCount || 0), 0);

    // Extract all parsed sampleData/rows from the uploaded CSV files
    const allRows: any[] = [];
    const allColumns: string[] = [];

    files.forEach((f: any) => {
      if (Array.isArray(f.sampleData) && f.sampleData.length > 0) {
        allRows.push(...f.sampleData);
      } else if (Array.isArray(f.rows) && f.rows.length > 0) {
        allRows.push(...f.rows);
      } else if (Array.isArray(f.data) && f.data.length > 0) {
        allRows.push(...f.data);
      }

      if (Array.isArray(f.columns)) {
        allColumns.push(...f.columns);
      }
    });

    // 1. Create DataSource in PostgreSQL
    let createdDataSource: any = null;
    try {
      createdDataSource = await prisma.dataSource.create({
        data: {
          organizationId,
          name: `CSV Ingestion - ${files[0]?.fileName || datasetName}`,
          type: "CSV",
          status: "connected",
          dataVolume: totalRowsCount,
          lastSyncAt: new Date(),
        },
      });
    } catch (e) {
      console.warn("DataSource creation warning:", e);
    }

    // 2. Create DataImport and associated ImportFiles in PostgreSQL
    const importRecord = await prisma.dataImport.create({
      data: {
        organizationId,
        datasetName,
        uploadedBy,
        status: "completed",
        completedAt: new Date(),
        files: {
          create: files.map((f: any) => ({
            organizationId,
            fileName: f.fileName,
            entityType: f.entityType || "general",
            rowCount: f.rowCount || 0,
            validRows: f.validRows || f.rowCount || 0,
            invalidRows: f.invalidRows || 0,
            status: "completed",
            columns: f.columns || [],
            sampleData: f.sampleData || f.rows || f.data || [],
            errors: f.warnings || f.errors || [],
          })),
        },
      },
      include: { files: true },
    });

    // 3. Create Dataset in PostgreSQL
    const createdDataset = await prisma.dataset.create({
      data: {
        organizationId,
        dataSourceId: createdDataSource?.id,
        name: datasetName,
        description: `Imported CSV Business Dataset for ${organizationName} (${totalRowsCount.toLocaleString()} rows)`,
        rowCount: totalRowsCount,
        columns: allColumns.length > 0 ? allColumns : files.map((f: any) => f.fileName),
        data: allRows.length > 0 ? allRows : files.map((f: any) => ({ fileName: f.fileName, entityType: f.entityType, rowCount: f.rowCount })),
      },
    });

    // 4. Save to active dataset store for instant in-memory telemetry
    saveActiveDataset({
      id: createdDataset.id || importRecord.id,
      organizationId,
      name: datasetName,
      description: `Imported Business Dataset for ${organizationName}`,
      rowCount: totalRowsCount,
      columns: allColumns,
      data: allRows,
      dataSourceName: "CSV Ingestion Pipeline",
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Dataset "${datasetName}" successfully stored in PostgreSQL database tables (DataImport, ImportFile, Dataset, DataSource)`,
      organizationId,
      organizationName,
      datasetId: createdDataset.id,
      importId: importRecord.id,
      import: {
        id: importRecord.id,
        organizationId,
        organizationName,
        datasetName,
        uploadedBy,
        status: "completed",
        createdAt: importRecord.createdAt,
        completedAt: importRecord.completedAt,
        filesCount: importRecord.files ? importRecord.files.length : 0,
        totalRows: totalRowsCount,
        files: importRecord.files || [],
      },
    });
  } catch (error: any) {
    console.error("POST /api/data-imports error:", error);
    return NextResponse.json(
      { success: false, error: `Failed to store imported CSV dataset in database: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
