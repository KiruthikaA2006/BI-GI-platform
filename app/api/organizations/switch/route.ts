import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAuth, requireOrganization } from "@/lib/tenant-auth";

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
    }

    // Server-side membership validation in PostgreSQL
    const tenantContext = await requireOrganization(session.id, organizationId);

    if (!tenantContext) {
      return NextResponse.json(
        { error: "Access Denied: You are not a member of this organization workspace." },
        { status: 403 }
      );
    }

    // Set active workspace cookie
    const cookieStore = await cookies();
    cookieStore.set("active_org_id", tenantContext.organizationId, { path: "/" });

    return NextResponse.json({
      success: true,
      message: `Active workspace switched to ${tenantContext.organizationName}`,
      activeOrganization: {
        id: tenantContext.organizationId,
        name: tenantContext.organizationName,
        slug: tenantContext.organizationSlug,
        role: tenantContext.role,
      },
    });
  } catch (error) {
    console.error("Workspace switch error:", error);
    return NextResponse.json({ error: "Failed to switch active organization" }, { status: 500 });
  }
}
