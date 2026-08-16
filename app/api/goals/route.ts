import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/goals
 * Retrieve active organization goals from PostgreSQL database
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

    const goals = await prisma.goal.findMany({
      where: { organizationId: activeOrgId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      organizationId: activeOrgId,
      goals,
    });
  } catch (error: any) {
    console.error("GET /api/goals error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch goals from database" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/goals
 * Create a new goal in PostgreSQL attached to the active organization
 */
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const activeOrgId = cookieStore.get("active_org_id")?.value;

    const body = await req.json();
    const {
      name,
      description,
      metric,
      targetValue,
      currentValue,
      organizationId: bodyOrgId,
    } = body;

    const targetOrgId = bodyOrgId || activeOrgId;

    if (!targetOrgId || !name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name or organization context" },
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

    const createdGoal = await prisma.goal.create({
      data: {
        organizationId: org.id,
        name,
        description: description || "Created from AI Recommendation & Predictive Forecast",
        metric: metric || "Monthly Revenue ($)",
        targetValue: Number(targetValue) || 100000,
        currentValue: Number(currentValue) || 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Default 90-day goal
        status: "active",
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          organizationId: org.id,
          action: "UPDATE_GOAL",
          entity: "Goal",
          entityId: createdGoal.id,
          newValue: `Set target goal "${name}" (${metric}: ${targetValue})`,
          ipAddress: "103.24.18.92",
        },
      });
    } catch (auditErr) {
      console.warn("AuditLog creation error:", auditErr);
    }

    return NextResponse.json({
      success: true,
      message: `Goal "${name}" created and saved in PostgreSQL under ${org.name}`,
      goal: createdGoal,
    });
  } catch (error: any) {
    console.error("POST /api/goals error:", error);
    return NextResponse.json(
      { success: false, error: `Failed to create goal: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
