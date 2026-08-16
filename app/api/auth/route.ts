import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Role } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name: bodyName,
      email,
      password,
      role,
      action,
      designation: bodyDesignation,
      organizationId: bodyOrgId,
      organizationName: bodyOrgName,
    } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const activeOrgIdCookie = cookieStore.get("active_org_id")?.value;
    const activeOrgNameCookie = cookieStore.get("active_org_name")?.value;

    const chosenRole = (role || (action === "admin_login" ? Role.SUPER_ADMIN : Role.ORGANIZATION_ADMIN)) as Role;

    let targetOrgId: string | null = chosenRole === Role.SUPER_ADMIN
      ? null
      : bodyOrgId || (activeOrgIdCookie ? decodeURIComponent(activeOrgIdCookie) : null);

    let targetOrgName: string | null = chosenRole === Role.SUPER_ADMIN
      ? "Platform Administration"
      : bodyOrgName || (activeOrgNameCookie ? decodeURIComponent(activeOrgNameCookie) : null);

    let targetOrg: any = null;

    // Resolve or create target Organization in PostgreSQL
    if (chosenRole !== Role.SUPER_ADMIN) {
      try {
        if (targetOrgId || targetOrgName) {
          targetOrg = await prisma.organization.findFirst({
            where: {
              OR: [
                ...(targetOrgId ? [{ id: targetOrgId }, { slug: targetOrgId }] : []),
                ...(targetOrgName ? [{ name: targetOrgName }] : []),
              ],
            },
          });
        }

        if (!targetOrg && email) {
          const userMember = await prisma.organizationMember.findFirst({
            where: { user: { email } },
            include: { organization: true },
          });
          if (userMember?.organization) {
            targetOrg = userMember.organization;
          }
        }

        if (!targetOrg) {
          const fallbackName = targetOrgName || "Organization Workspace";
          const fallbackSlug = (targetOrgId || fallbackName).toLowerCase().replace(/[^a-z0-9]/g, "-");
          targetOrg = await prisma.organization.create({
            data: {
              id: targetOrgId || fallbackSlug,
              name: fallbackName,
              slug: fallbackSlug,
            },
          });
        }

        targetOrgId = targetOrg.id;
        targetOrgName = targetOrg.name;
      } catch (dbErr) {
        console.warn("PostgreSQL organization resolution warning:", dbErr);
      }
    }

    // Default designation based on role if not provided
    const defaultDesignation =
      bodyDesignation ||
      (chosenRole === Role.SUPER_ADMIN
        ? "Platform Administrator"
        : chosenRole === Role.ORGANIZATION_ADMIN
        ? "Organization Administrator"
        : chosenRole === Role.EXECUTIVE
        ? "Executive Leader"
        : chosenRole === Role.DEPARTMENT_MANAGER
        ? "Department Manager"
        : "Data Analyst");

    // Look up or create User in PostgreSQL database
    let dbUser: any = null;

    try {
      dbUser = await prisma.user.findUnique({
        where: { email },
        include: { organization: true, memberships: true },
      });

      if (!dbUser && (action === "signup" || action === "login" || action === "register")) {
        const emailPrefix = email.split("@")[0].replace(/[^a-zA-Z]/g, " ").trim();
        const formattedPrefix = emailPrefix ? emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1) : "Employee";
        const fullName = bodyName || formattedPrefix;

        dbUser = await prisma.user.create({
          data: {
            organizationId: targetOrgId,
            name: fullName,
            email,
            passwordHash: password || "hashed_secure_password",
            role: chosenRole,
            designation: defaultDesignation,
            status: "active",
          },
        });

        if (targetOrgId) {
          await prisma.organizationMember.upsert({
            where: {
              userId_organizationId: {
                userId: dbUser.id,
                organizationId: targetOrgId,
              },
            },
            create: {
              organizationId: targetOrgId,
              userId: dbUser.id,
              role: chosenRole,
              designation: defaultDesignation,
              status: "active",
            },
            update: {
              role: chosenRole,
              designation: defaultDesignation,
              status: "active",
            },
          });
        }
      }
    } catch (userErr) {
      console.warn("PostgreSQL User creation/lookup warning:", userErr);
    }

    const userName = dbUser?.name || bodyName || (email.split("@")[0].replace(/[^a-zA-Z]/g, " ") || "Employee User");

    const userSession = {
      id: dbUser?.id || `user_${chosenRole.toLowerCase()}_${Date.now()}`,
      name: userName,
      email,
      role: chosenRole,
      designation: dbUser?.designation || defaultDesignation,
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
      cookieStore.delete("org_session");
    } else {
      cookieStore.set("org_session", JSON.stringify(userSession), { path: "/" });
      cookieStore.delete("admin_session");
    }

    let redirectUrl = "/dashboard";
    if (chosenRole === Role.SUPER_ADMIN) redirectUrl = "/admin/dashboard";
    else if (chosenRole === Role.EXECUTIVE) redirectUrl = "/executive/command-center";
    else if (chosenRole === Role.DEPARTMENT_MANAGER) redirectUrl = "/manager/dashboard";
    else if (chosenRole === Role.ANALYST) redirectUrl = "/analyst/dashboard";
    else if (chosenRole === Role.ORGANIZATION_ADMIN) redirectUrl = "/dashboard";

    return NextResponse.json({
      success: true,
      message: action === "signup"
        ? `Account created successfully for ${userName} in ${targetOrgName || "Organization"}`
        : `Successfully authenticated as ${userName} (${chosenRole})`,
      redirectUrl,
      user: userSession,
    });
  } catch (error: any) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ success: false, message: `Authentication failed: ${error?.message || error}` }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("user_role")?.value;
  const orgCookie = cookieStore.get("org_session")?.value;
  const adminCookie = cookieStore.get("admin_session")?.value;

  if (userRole === "SUPER_ADMIN" && adminCookie) {
    return NextResponse.json({ authenticated: true, user: JSON.parse(adminCookie) });
  }
  if (orgCookie) {
    return NextResponse.json({ authenticated: true, user: JSON.parse(orgCookie) });
  }
  if (adminCookie) {
    return NextResponse.json({ authenticated: true, user: JSON.parse(adminCookie) });
  }

  return NextResponse.json({ authenticated: false, user: null });
}
