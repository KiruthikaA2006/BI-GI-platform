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

    const updated = await prisma.organizationMember.update({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      data: { status: "active" },
    });

    await logAuditEvent({
      organizationId,
      actorUserId: session.id,
      action: "USER_REACTIVATED",
      targetUserId: userId,
    });

    return NextResponse.json({
      success: true,
      message: "User reactivated in this organization.",
      status: updated.status,
    });
  } catch (error) {
    console.error("POST /reactivate error:", error);
    return NextResponse.json({ success: false, error: "Failed to reactivate user" }, { status: 500 });
  }
}
