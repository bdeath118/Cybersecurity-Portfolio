import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getUnderConstructionSettings } from "@/lib/data"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, static files, and admin paths
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/admin") ||
    pathname === "/under-construction" ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  try {
    // Check if under construction mode is enabled
    const settings = await getUnderConstructionSettings()

    if (settings.enabled && settings.allowAdminAccess) {
      // Check if user is authenticated admin
      const authCookie = request.cookies.get("admin-auth")

      // If not authenticated admin, redirect to under construction
      if (!authCookie || authCookie.value !== "authenticated") {
        return NextResponse.redirect(new URL("/under-construction", request.url))
      }
    }
  } catch (error) {
    console.error("Middleware error:", error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
