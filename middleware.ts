import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySession } from "./lib/auth"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Protect admin dashboard routes
  if (path.startsWith("/admin/dashboard")) {
    const isAuthenticated = await verifySession()

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
}

