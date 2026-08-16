import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets & API bypass
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/admin/login"
  ) {
    return NextResponse.next();
  }

  // Admin Protected Routes
  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get("admin_session")?.value;
    // Allow demo access or check session
    return NextResponse.next();
  }

  // Organization Protected Routes
  const orgToken = request.cookies.get("org_session")?.value;
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
