import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/tenant-auth";
import { requirePermission, PERMISSIONS } from "@/lib/permissions";
import { logAuditEvent } from "@/lib/audit";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ organizationId: string; userId: string }> }
) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { organizationId, userId } = await params;

    // Check permission
    const hasPermission = await requirePermission(session.id, organizationId, PERMISSIONS.USERS_DEACTIVATE);
    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden: Missing users.deactivate permission" }, { status: 403 });
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

    // Prevent deactivating sole owner
    if (member.role === "OWNER") {
      const ownerCount = await prisma.organizationMember.count({
        where: { organizationId, role: "OWNER", status: "active" },
      });
      if (ownerCount <= 1) {
        return NextResponse.json(
          { error: "Action Denied: Cannot deactivate the sole active organization owner." },
          { status: 400 }
        );
      }
    }

    // Update status to deactivated ONLY for this organization membership
    const updated = await prisma.organizationMember.update({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      data: { status: "deactivated" },
    });

    await logAuditEvent({
      organizationId,
      actorUserId: session.id,
      action: "USER_DEACTIVATED",
      targetUserId: userId,
    });

    return NextResponse.json({
      success: true,
      message: "User deactivated in this organization.",
      status: updated.status,
    });
  } catch (error) {
    console.error("POST /deactivate error:", error);
    return NextResponse.json({ success: false, error: "Failed to deactivate user" }, { status: 500 });
  }
}
