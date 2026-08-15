import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/tenant-auth";

// GET /api/organizations — Get My Organizations (only where user has membership)
export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query memberships in PostgreSQL
    const memberships = await prisma.organizationMember.findMany({
      where: { userId: session.id },
      include: {
        organization: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (memberships.length > 0) {
      const orgList = memberships.map((m) => ({
        id: m.organization.id,
        name: m.organization.name,
        slug: m.organization.slug,
        role: m.role,
        ownerId: m.organization.ownerId,
        createdAt: m.organization.createdAt,
      }));

      return NextResponse.json({ success: true, organizations: orgList });
    }

    // Fallback: If User table has default organization
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { organization: true },
    });

    if (user && user.organization) {
      return NextResponse.json({
        success: true,
        organizations: [
          {
            id: user.organization.id,
            name: user.organization.name,
            slug: user.organization.slug,
            role: "OWNER",
            ownerId: user.organization.ownerId,
            createdAt: user.organization.createdAt,
          },
        ],
      });
    }

    return NextResponse.json({ success: true, organizations: [] });
  } catch (error) {
    console.error("GET /api/organizations error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/organizations — Create Organization (PostgreSQL Transaction: Create Org + Membership role=OWNER)
export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Organization name and slug are required" }, { status: 400 });
    }

    const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");

    // Check slug uniqueness
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: sanitizedSlug },
    });

    if (existingOrg) {
      return NextResponse.json({ error: "Organization slug already exists" }, { status: 409 });
    }

    // Execute in PostgreSQL Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Organization with ownerId
      const org = await tx.organization.create({
        data: {
          name,
          slug: sanitizedSlug,
          ownerId: session.id,
        },
      });

      // 2. Create OrganizationMembership assigning user as OWNER
      const membership = await tx.organizationMember.create({
        data: {
          organizationId: org.id,
          userId: session.id,
          role: "OWNER",
        },
      });

      return { org, membership };
    });

    // Set active workspace cookie to newly created organization
    const cookieStore = await cookies();
    cookieStore.set("active_org_id", result.org.id, { path: "/" });

    return NextResponse.json({
      success: true,
      message: "Organization created successfully in PostgreSQL transaction!",
      organization: {
        id: result.org.id,
        name: result.org.name,
        slug: result.org.slug,
        role: "OWNER",
        ownerId: result.org.ownerId,
        createdAt: result.org.createdAt,
      },
    });
  } catch (error) {
    console.error("POST /api/organizations error:", error);
    return NextResponse.json({ success: false, error: "Failed to create organization" }, { status: 500 });
  }
}
