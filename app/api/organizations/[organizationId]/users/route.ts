import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireOrganization } from "@/lib/tenant-auth";
import { requirePermission, PERMISSIONS } from "@/lib/permissions";
import { logAuditEvent } from "@/lib/audit";

// GET /api/organizations/:organizationId/users
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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const roleFilter = searchParams.get("role") || "ALL";
    const deptFilter = searchParams.get("department") || "ALL";
    const statusFilter = searchParams.get("status") || "ALL";

    // Query organization members from PostgreSQL
    const members = await prisma.organizationMember.findMany({
      where: {
        organizationId,
        ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
        ...(roleFilter !== "ALL" ? { role: roleFilter } : {}),
        ...(deptFilter !== "ALL" ? { departmentId: deptFilter } : {}),
      },
      include: {
        user: true,
        department: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const userList = members
      .map((m) => ({
        id: m.userId,
        membershipId: m.id,
        name: m.user.name,
        email: m.user.email,
        phone: m.phone || m.user.phone || "N/A",
        designation: m.designation || m.user.designation || "Team Member",
        role: m.role,
        status: m.status,
        department: m.department ? { id: m.department.id, name: m.department.name } : null,
        createdAt: m.createdAt,
      }))
      .filter((u) => {
        if (!search) return true;
        return (
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.designation.toLowerCase().includes(search)
        );
      });

    return NextResponse.json({ success: true, users: userList });
  } catch (error) {
    console.error("GET /api/organizations/[organizationId]/users error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/organizations/:organizationId/users (Create User)
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

    // Verify permission users.create
    const hasPermission = await requirePermission(session.id, organizationId, PERMISSIONS.USERS_CREATE);
    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden: Missing users.create permission" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, phone, designation, role, departmentId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // If departmentId is provided, verify it belongs to the SAME organization
    if (departmentId) {
      const dept = await prisma.department.findFirst({
        where: { id: departmentId, organizationId },
      });
      if (!dept) {
        return NextResponse.json(
          { error: "Invalid Department: Department must belong to your organization" },
          { status: 400 }
        );
      }
    }

    // Execute User + OrganizationMember creation in PostgreSQL transaction
    const result = await prisma.$transaction(async (tx) => {
      // Find or create user account
      let user = await tx.user.findUnique({ where: { email } });
      if (!user) {
        user = await tx.user.create({
          data: {
            name,
            email,
            phone,
            designation,
            passwordHash: "$2a$12$eImiTXuWVxfM37uY4JANjO5E/u0pQ2H3YhJ8f9/A5G1B2C3D4E5F", // default hash
            organizationId,
          },
        });
      }

      // Check if membership already exists
      const existingMember = await tx.organizationMember.findUnique({
        where: {
          userId_organizationId: {
            userId: user.id,
            organizationId,
          },
        },
      });

      if (existingMember) {
        throw new Error("User is already a member of this organization");
      }

      const membership = await tx.organizationMember.create({
        data: {
          organizationId,
          userId: user.id,
          departmentId: departmentId || null,
          role: role || "MEMBER",
          status: "active",
          phone,
          designation,
        },
        include: {
          department: true,
        },
      });

      return { user, membership };
    });

    await logAuditEvent({
      organizationId,
      actorUserId: session.id,
      action: "USER_CREATED",
      targetUserId: result.user.id,
      metadata: { name, email, role, departmentId },
    });

    return NextResponse.json({
      success: true,
      message: "User created and added to organization!",
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        phone: result.membership.phone,
        designation: result.membership.designation,
        role: result.membership.role,
        status: result.membership.status,
        department: result.membership.department,
      },
    });
  } catch (error: any) {
    console.error("POST /api/organizations/[organizationId]/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create user" },
      { status: 400 }
    );
  }
}
