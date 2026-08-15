import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/tenant-auth";
import { requirePermission, PERMISSIONS } from "@/lib/permissions";
import { logAuditEvent } from "@/lib/audit";

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

    // Verify permission users.invite
    const hasPermission = await requirePermission(session.id, organizationId, PERMISSIONS.USERS_INVITE);
    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden: Missing users.invite permission" }, { status: 403 });
    }

    const body = await req.json();
    const { email, name, role, departmentId } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required for invitation" }, { status: 400 });
    }

    // Validate department belongs to same organization
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

    // Generate secure 32-byte invitation token & hash
    const plainToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(plainToken).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await prisma.organizationInvitation.create({
      data: {
        organizationId,
        email,
        name: name || null,
        role: role || "MEMBER",
        departmentId: departmentId || null,
        tokenHash,
        expiresAt,
        invitedBy: session.id,
        status: "pending",
      },
    });

    await logAuditEvent({
      organizationId,
      actorUserId: session.id,
      action: "USER_INVITED",
      metadata: { email, role, departmentId, invitationId: invitation.id },
    });

    return NextResponse.json({
      success: true,
      message: `Invitation generated and sent to ${email}`,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
        invitationLink: `http://localhost:3000/accept-invite?token=${plainToken}`,
      },
    });
  } catch (error) {
    console.error("POST /users/invite error:", error);
    return NextResponse.json({ success: false, error: "Failed to send invitation" }, { status: 500 });
  }
}
