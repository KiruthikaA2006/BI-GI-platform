import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireOrganization } from "@/lib/tenant-auth";
import { requirePermission, PERMISSIONS } from "@/lib/permissions";
import { logAuditEvent } from "@/lib/audit";

// GET /api/organizations/:organizationId/users/:userId (User Detail)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ organizationId: string; userId: string }> }
) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { organizationId, userId } = await params;

    // Verify tenant membership of requester
    const tenantContext = await requireOrganization(session.id, organizationId);
    if (!tenantContext) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Query target user's membership in THIS organization
    const member = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      include: {
        user: true,
        department: true,
      },
    });

    if (!member) {
      return NextResponse.json({ error: "User not found in organization" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: member.userId,
        name: member.user.name,
        email: member.user.email,
        phone: member.phone || member.user.phone || "",
        designation: member.designation || member.user.designation || "",
        role: member.role,
        status: member.status,
        department: member.department ? { id: member.department.id, name: member.department.name } : null,
        createdAt: member.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}

// PATCH /api/organizations/:organizationId/users/:userId (Edit Profile & Department)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ organizationId: string; userId: string }> }
) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { organizationId, userId } = await params;

    // Check permissions
    const hasPermission = await requirePermission(session.id, organizationId, PERMISSIONS.USERS_EDIT);
    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden: Missing users.edit permission" }, { status: 403 });
    }

    const body = await req.json();
    const { name, phone, designation, departmentId } = body;

    // Verify member exists in THIS organization
    const existingMember = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });

    if (!existingMember) {
      return NextResponse.json({ error: "User not found in organization" }, { status: 404 });
    }

    // Verify department belongs to the SAME organization
    if (departmentId) {
      const dept = await prisma.department.findFirst({
        where: { id: departmentId, organizationId },
      });
      if (!dept) {
        return NextResponse.json(
          { error: "Forbidden: Department must belong to your organization" },
          { status: 400 }
        );
      }
    }

    // Update in PostgreSQL
    const updatedMember = await prisma.$transaction(async (tx) => {
      if (name) {
        await tx.user.update({
          where: { id: userId },
          data: { name },
        });
      }

      return await tx.organizationMember.update({
        where: {
          userId_organizationId: {
            userId,
            organizationId,
          },
        },
        data: {
          phone: phone !== undefined ? phone : existingMember.phone,
          designation: designation !== undefined ? designation : existingMember.designation,
          departmentId: departmentId !== undefined ? departmentId : existingMember.departmentId,
        },
        include: {
          user: true,
          department: true,
        },
      });
    });

    await logAuditEvent({
      organizationId,
      actorUserId: session.id,
      action: "USER_UPDATED",
      targetUserId: userId,
      metadata: { name, phone, designation, departmentId },
    });

    return NextResponse.json({
      success: true,
      message: "User profile updated successfully!",
      user: {
        id: updatedMember.userId,
        name: updatedMember.user.name,
        email: updatedMember.user.email,
        phone: updatedMember.phone,
        designation: updatedMember.designation,
        role: updatedMember.role,
        status: updatedMember.status,
        department: updatedMember.department,
      },
    });
  } catch (error) {
    console.error("PATCH /users/:userId error:", error);
    return NextResponse.json({ success: false, error: "Failed to update user profile" }, { status: 500 });
  }
}
