import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimit } from "./lib/rate-limit"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Apply rate limiting to API routes
  if (pathname.startsWith("/api/")) {
    try {
      await rateLimit(request)
    } catch (error) {
      return new NextResponse("Too Many Requests", { status: 429 })
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const authCookie = request.cookies.get("auth-session")

    if (!authCookie) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    try {
      // Simple session validation
      const sessionData = JSON.parse(authCookie.value)
      if (!sessionData.userId || !sessionData.username) {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
    } catch {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
}
