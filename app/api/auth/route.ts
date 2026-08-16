import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Role } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role, action, organizationId: bodyOrgId, organizationName: bodyOrgName } = body;

    const cookieStore = await cookies();
    const activeOrgIdCookie = cookieStore.get("active_org_id")?.value;
    const activeOrgNameCookie = cookieStore.get("active_org_name")?.value;

    const chosenRole = role || (action === "admin_login" ? Role.SUPER_ADMIN : Role.ORGANIZATION_ADMIN);

    let targetOrgId: string | null = chosenRole === Role.SUPER_ADMIN
      ? null
      : bodyOrgId || (activeOrgIdCookie ? decodeURIComponent(activeOrgIdCookie) : null);

    let targetOrgName: string | null = chosenRole === Role.SUPER_ADMIN
      ? "Platform Administration"
      : bodyOrgName || (activeOrgNameCookie ? decodeURIComponent(activeOrgNameCookie) : null);

    // Resolve or verify real organization in PostgreSQL database for non-super admin users
    if (chosenRole !== Role.SUPER_ADMIN) {
      try {
        let dbOrg = null;

        // 1. Try finding existing organization in PostgreSQL by ID, slug, or name
        if (targetOrgId || targetOrgName) {
          dbOrg = await prisma.organization.findFirst({
            where: {
              OR: [
                ...(targetOrgId ? [{ id: targetOrgId }, { slug: targetOrgId }] : []),
                ...(targetOrgName ? [{ name: targetOrgName }] : []),
              ],
            },
          });
        }

        // 2. If not found, try finding existing user membership in PostgreSQL by email
        if (!dbOrg && email) {
          const userMember = await prisma.organizationMember.findFirst({
            where: { user: { email } },
            include: { organization: true },
          });
          if (userMember?.organization) {
            dbOrg = userMember.organization;
          } else {
            const user = await prisma.user.findUnique({
              where: { email },
              include: { organization: true },
            });
            if (user?.organization) {
              dbOrg = user.organization;
            }
          }
        }

        // 3. If organization exists in PostgreSQL, use its exact database ID & Name
        if (dbOrg) {
          targetOrgId = dbOrg.id;
          targetOrgName = dbOrg.name;
        } else {
          // 4. If organization does not exist in PostgreSQL yet, create it in Organization table
          const fallbackName = targetOrgName || "Organization Workspace";
          const fallbackSlug = (targetOrgId || fallbackName).toLowerCase().replace(/[^a-z0-9]/g, "-");
          const createdOrg = await prisma.organization.create({
            data: {
              id: targetOrgId || fallbackSlug,
              name: fallbackName,
              slug: fallbackSlug,
            },
          });
          targetOrgId = createdOrg.id;
          targetOrgName = createdOrg.name;
        }
      } catch (dbErr) {
        console.warn("PostgreSQL organization resolution warning:", dbErr);
      }
    }

    const userSession = {
      id: `user_${chosenRole.toLowerCase()}_01`,
      name:
        chosenRole === Role.SUPER_ADMIN
          ? "Platform Super Admin"
          : chosenRole === Role.ORGANIZATION_ADMIN
          ? "Kiruthika Anand (Org Admin)"
          : chosenRole === Role.EXECUTIVE
          ? "Chief Executive Officer"
          : chosenRole === Role.DEPARTMENT_MANAGER
          ? "Sales Department Manager"
          : "Senior Data Analyst",
      email: email || `${chosenRole.toLowerCase()}@${targetOrgId || "platform"}.com`,
      role: chosenRole,
      organizationId: targetOrgId,
      organizationName: targetOrgName,
    };

    // Set user_role cookie and session cookies
    cookieStore.set("user_role", chosenRole, { path: "/" });

    if (targetOrgId && targetOrgName) {
      cookieStore.set("active_org_id", targetOrgId, { path: "/" });
      cookieStore.set("active_org_name", targetOrgName, { path: "/" });
    }

    if (chosenRole === Role.SUPER_ADMIN) {
      cookieStore.set("admin_session", JSON.stringify(userSession), { path: "/" });
    } else {
      cookieStore.set("org_session", JSON.stringify(userSession), { path: "/" });
    }

    let redirectUrl = "/dashboard";
    if (chosenRole === Role.SUPER_ADMIN) redirectUrl = "/admin/dashboard";
    else if (chosenRole === Role.EXECUTIVE) redirectUrl = "/executive/command-center";
    else if (chosenRole === Role.DEPARTMENT_MANAGER) redirectUrl = "/manager/dashboard";
    else if (chosenRole === Role.ANALYST) redirectUrl = "/analyst/dashboard";
    else if (chosenRole === Role.ORGANIZATION_ADMIN) redirectUrl = "/dashboard";

    return NextResponse.json({
      success: true,
      message: `Successfully authenticated as ${chosenRole} for ${targetOrgName}`,
      redirectUrl,
      user: userSession,
    });
  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const orgCookie = cookieStore.get("org_session")?.value;
  const adminCookie = cookieStore.get("admin_session")?.value;

  if (adminCookie) {
    return NextResponse.json({ authenticated: true, user: JSON.parse(adminCookie) });
  }
  if (orgCookie) {
    return NextResponse.json({ authenticated: true, user: JSON.parse(orgCookie) });
  }

  return NextResponse.json({ authenticated: false, user: null });
}
