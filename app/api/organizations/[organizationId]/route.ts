import { NextResponse } from "next/server";
import { requireAuth, requireOrganization } from "@/lib/tenant-auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const orgId = resolvedParams.organizationId;

    // Verify membership in PostgreSQL
    const tenantContext = await requireOrganization(session.id, orgId);

    if (!tenantContext) {
      // Return 404 to avoid leaking whether another organization ID exists
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      organization: {
        id: tenantContext.organizationId,
        name: tenantContext.organizationName,
        slug: tenantContext.organizationSlug,
        role: tenantContext.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }
}
