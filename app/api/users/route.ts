import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Role } from "@/app/generated/prisma/enums";

/**
 * GET /api/users
 * Retrieve all users/employees for the active organization from PostgreSQL database
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const activeOrgId = cookieStore.get("active_org_id")?.value;

    if (!activeOrgId) {
      return NextResponse.json(
        { success: false, error: "No active organization session found" },
        { status: 401 }
      );
    }

    // 1. Query registered organization members and users from PostgreSQL
    const members = await prisma.organizationMember.findMany({
      where: { organizationId: activeOrgId },
      include: {
        user: true,
        department: true,
      },
      orderBy: { createdAt: "desc" },
    });

    let dbUsers: any[] = [];
    if (members.length > 0) {
      dbUsers = members.map((m) => ({
        id: m.userId,
        memberId: m.id,
        name: m.user.name,
        email: m.user.email,
        designation: m.designation || m.user.designation || "Team Member",
        role: m.role || m.user.role,
        status: m.status || m.user.status,
        department: m.department ? { id: m.department.id, name: m.department.name } : null,
        createdAt: m.createdAt,
      }));
    } else {
      const users = await prisma.user.findMany({
        where: { organizationId: activeOrgId },
        orderBy: { createdAt: "desc" },
      });
      dbUsers = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        designation: u.designation || "Team Member",
        role: u.role,
        status: u.status,
        department: null,
        createdAt: u.createdAt,
      }));
    }

    // 2. Extract salespeople/employees/users found in uploaded DataRecord rows in PostgreSQL
    const dataRecords = await prisma.dataRecord.findMany({
      where: { organizationId: activeOrgId },
      take: 100,
    });

    const datasetUsersMap: Record<string, any> = {};
    dataRecords.forEach((rec) => {
      const row = rec.data as any;
      if (!row || typeof row !== "object") return;

      const userName = row.salesperson || row.sales_rep || row.employee || row.user_name || row.created_by || row.uploaded_by || row.manager;
      if (userName && typeof userName === "string" && userName.trim().length > 1) {
        const cleanedName = userName.trim();
        const key = cleanedName.toLowerCase();
        if (!datasetUsersMap[key]) {
          datasetUsersMap[key] = {
            id: `ds_user_${key.replace(/[^a-z0-9]/g, "_")}`,
            name: cleanedName,
            email: `${key.replace(/[^a-z0-9]/g, ".")}@org.com`,
            designation: "Sales Rep / Manager (Dataset)",
            role: "ANALYST",
            status: "active",
            department: { id: "dept_sales", name: "Sales & Operations" },
            source: "Uploaded Business Dataset",
            createdAt: rec.createdAt,
          };
        }
      }
    });

    const datasetUsers = Object.values(datasetUsersMap);

    // Merge registered DB users with dataset-derived users (eliminating duplicates)
    const existingEmails = new Set(dbUsers.map((u) => u.email.toLowerCase()));
    const finalUsers = [...dbUsers];

    datasetUsers.forEach((du) => {
      if (!existingEmails.has(du.email.toLowerCase())) {
        finalUsers.push(du);
      }
    });

    return NextResponse.json({
      success: true,
      organizationId: activeOrgId,
      users: finalUsers,
    });
  } catch (error: any) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch organization users from database" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Create a new user/employee in PostgreSQL attached to the active organization
 */
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const activeOrgId = cookieStore.get("active_org_id")?.value;

    const body = await req.json();
    const {
      name,
      email,
      password,
      role,
      designation,
      organizationId: bodyOrgId,
    } = body;

    const targetOrgId = bodyOrgId || activeOrgId;

    if (!targetOrgId || !email || !name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, email, or organization context" },
        { status: 400 }
      );
    }

    // Ensure Organization exists in PostgreSQL
    let org = await prisma.organization.findUnique({
      where: { id: targetOrgId },
    });

    if (!org) {
      org = await prisma.organization.create({
        data: {
          id: targetOrgId,
          name: "Organization Workspace",
          slug: targetOrgId.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        },
      });
    }

    const assignedRole = (role || "ANALYST") as Role;
    const userDesignation = designation || "Team Member";

    // Create or update User in PostgreSQL
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        organizationId: org.id,
        name,
        email,
        passwordHash: password || "secure_default_pass",
        role: assignedRole,
        designation: userDesignation,
        status: "active",
      },
      update: {
        organizationId: org.id,
        name,
        role: assignedRole,
        designation: userDesignation,
        status: "active",
      },
    });

    // Create or update OrganizationMember membership in PostgreSQL
    const member = await prisma.organizationMember.upsert({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: org.id,
        },
      },
      create: {
        organizationId: org.id,
        userId: user.id,
        role: assignedRole,
        designation: userDesignation,
        status: "active",
      },
      update: {
        role: assignedRole,
        designation: userDesignation,
        status: "active",
      },
    });

    return NextResponse.json({
      success: true,
      message: `User ${name} created and saved in PostgreSQL under ${org.name}`,
      user: {
        id: user.id,
        memberId: member.id,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        status: user.status,
        organizationId: org.id,
      },
    });
  } catch (error: any) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { success: false, error: `Failed to create employee user: ${error?.message || error}` },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users
 * Update an existing user/employee role, designation, or status in PostgreSQL
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, role, designation, status, name } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing user ID" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(role ? { role: role as Role } : {}),
        ...(designation ? { designation } : {}),
        ...(status ? { status } : {}),
      },
    });

    if (role || designation || status) {
      await prisma.organizationMember.updateMany({
        where: { userId: id },
        data: {
          ...(role ? { role } : {}),
          ...(designation ? { designation } : {}),
          ...(status ? { status } : {}),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully in PostgreSQL",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("PATCH /api/users error:", error);
    return NextResponse.json(
      { success: false, error: `Failed to update user: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
