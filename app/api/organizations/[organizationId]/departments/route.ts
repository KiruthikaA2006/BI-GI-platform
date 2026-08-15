import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireOrganization } from "@/lib/tenant-auth";
import { requirePermission, PERMISSIONS } from "@/lib/permissions";
import { logAuditEvent } from "@/lib/audit";

// GET /api/organizations/:organizationId/departments
export async function GET(
  req: Request,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { organizationId } = await params;

    // Verify tenant membership
    const tenantContext = await requireOrganization(session.id, organizationId);
    if (!tenantContext) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const departments = await prisma.department.findMany({
      where: { organizationId },
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const deptList = departments.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description || "",
      memberCount: d._count.members,
      createdAt: d.createdAt,
    }));

    return NextResponse.json({ success: true, departments: deptList });
  } catch (error) {
    console.error("GET /departments error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/organizations/:organizationId/departments (Create Department)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { organizationId } = await params;

    // Check permission departments.create
    const hasPermission = await requirePermission(session.id, organizationId, PERMISSIONS.DEPARTMENTS_CREATE);
    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden: Missing departments.create permission" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Department name is required" }, { status: 400 });
    }

    // Check duplicate department name within THIS organization
    const existing = await prisma.department.findUnique({
      where: {
        organizationId_name: {
          organizationId,
          name,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A department with this name already exists in your organization" },
        { status: 409 }
      );
    }

    const department = await prisma.department.create({
      data: {
        organizationId,
        name,
        description: description || null,
      },
    });

    await logAuditEvent({
      organizationId,
      actorUserId: session.id,
      action: "DEPARTMENT_CREATED",
      metadata: { name, departmentId: department.id },
    });

    return NextResponse.json({
      success: true,
      message: "Department created successfully!",
      department,
    });
  } catch (error) {
    console.error("POST /departments error:", error);
    return NextResponse.json({ success: false, error: "Failed to create department" }, { status: 500 });
  }
}
