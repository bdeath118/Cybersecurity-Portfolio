import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Only protect dashboard routes
  if (path.startsWith("/admin/dashboard")) {
    const authCookie = request.cookies.get("admin-auth")

    console.log("Middleware checking auth for:", path)
    console.log("Auth cookie present:", !!authCookie)

    if (!authCookie || authCookie.value !== "authenticated") {
      console.log("Redirecting to login page")
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    console.log("Authentication successful, proceeding to dashboard")
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
}
