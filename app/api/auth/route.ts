import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Role } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role, action } = body;

    const chosenRole = role || (action === "admin_login" ? Role.SUPER_ADMIN : Role.ORGANIZATION_ADMIN);

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
      email: email || `${chosenRole.toLowerCase()}@qubertrix.com`,
      role: chosenRole,
      organizationId: chosenRole === Role.SUPER_ADMIN ? null : "org_qubertrix_01",
      organizationName: chosenRole === Role.SUPER_ADMIN ? "Platform Administration" : "Qubertrix Technologies",
    };

    const cookieStore = await cookies();
    
    // Set user_role cookie and session cookie
    cookieStore.set("user_role", chosenRole, { path: "/" });

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
      message: `Successfully authenticated as ${chosenRole}`,
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
