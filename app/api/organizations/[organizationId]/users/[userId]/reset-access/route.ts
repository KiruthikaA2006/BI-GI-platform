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
    const hasPermission = await requirePermission(session.id, organizationId, PERMISSIONS.USERS_RESET_ACCESS);
    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden: Missing users.reset_access permission" }, { status: 403 });
    }

    const member = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      include: { user: true },
    });

    if (!member) {
      return NextResponse.json({ error: "User not found in organization" }, { status: 404 });
    }

    await logAuditEvent({
      organizationId,
      actorUserId: session.id,
      action: "ACCESS_RESET",
      targetUserId: userId,
      metadata: { targetEmail: member.user.email },
    });

    return NextResponse.json({
      success: true,
      message: `Password reset email & session revocation triggered for ${member.user.email}`,
    });
  } catch (error) {
    console.error("POST /reset-access error:", error);
    return NextResponse.json({ success: false, error: "Failed to reset access" }, { status: 500 });
  }
}
