import { prisma } from "./prisma";

export async function logAuditEvent(params: {
  organizationId: string;
  actorUserId: string;
  action: string;
  targetUserId?: string;
  metadata?: Record<string, any>;
}) {
  try {
    // Sanitized metadata (never store plain tokens/passwords)
    const sanitizedMetadata = { ...params.metadata };
    delete sanitizedMetadata.password;
    delete sanitizedMetadata.token;
    delete sanitizedMetadata.tokenHash;

    await prisma.auditLog.create({
      data: {
        organizationId: params.organizationId,
        userId: params.actorUserId,
        action: params.action,
        entity: params.targetUserId ? "User" : "Organization",
        entityId: params.targetUserId || null,
        newValue: sanitizedMetadata as any,
        ipAddress: "127.0.0.1",
      },
    });
  } catch (error) {
    console.warn("Audit log creation warning:", error);
  }
}
