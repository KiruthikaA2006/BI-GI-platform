import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/tenant-auth";
import { requirePermission, PERMISSIONS } from "@/lib/permissions";
import { logAuditEvent } from "@/lib/audit";

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

    // Permission check
    const hasPermission = await requirePermission(session.id, organizationId, PERMISSIONS.USERS_ASSIGN_ROLE);
    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden: Missing users.assign_role permission" }, { status: 403 });
    }

    const body = await req.json();
    const { role } = body;

    const allowedRoles = ["OWNER", "ADMIN", "MANAGER", "MEMBER"];
    const targetRole = String(role || "").toUpperCase();

    if (!allowedRoles.includes(targetRole)) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    // Verify member exists in THIS organization
    const member = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "User not found in organization" }, { status: 404 });
    }

    // Safeguard: Prevent demoting the ONLY owner
    if (member.role === "OWNER" && targetRole !== "OWNER") {
      const ownerCount = await prisma.organizationMember.count({
        where: { organizationId, role: "OWNER" },
      });

      if (ownerCount <= 1) {
        return NextResponse.json(
          { error: "Action Denied: Cannot demote the sole organization owner. Assign another owner first." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.organizationMember.update({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      data: { role: targetRole },
    });

    await logAuditEvent({
      organizationId,
      actorUserId: session.id,
      action: "ROLE_CHANGED",
      targetUserId: userId,
      metadata: { previousRole: member.role, newRole: targetRole },
    });

    return NextResponse.json({
      success: true,
      message: `User role updated to ${targetRole}`,
      role: updated.role,
    });
  } catch (error) {
    console.error("PATCH /role error:", error);
    return NextResponse.json({ success: false, error: "Failed to update user role" }, { status: 500 });
  }
}
