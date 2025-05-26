import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Protect admin dashboard routes
  if (path.startsWith("/admin/dashboard")) {
    const authCookie = request.cookies.get("admin-auth")

    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
}
