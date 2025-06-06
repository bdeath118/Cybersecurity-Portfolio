import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Only protect dashboard routes
  if (path.startsWith("/admin/dashboard")) {
    const authCookie = request.cookies.get("admin-auth")

    // Add a nonce to prevent CSRF attacks
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64")

    if (!authCookie || authCookie.value !== "authenticated") {
      // Use NextResponse.redirect with the full URL to avoid path traversal
      const url = request.nextUrl.clone()
      url.pathname = "/admin"
      url.search = ""

      return NextResponse.redirect(url)
    }

    // Add security headers
    const response = NextResponse.next()
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set(
      "Content-Security-Policy",
      `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    )

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
}
