import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect old admin login directly to organization selection page
  if (pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/onboarding/organization", request.url));
  }

  // Static assets & API bypass
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return NextResponse.next();
  }

  // Admin Protected Routes
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Organization Protected Routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
