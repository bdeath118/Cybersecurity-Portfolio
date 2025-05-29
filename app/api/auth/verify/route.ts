import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await verifySession()

    return NextResponse.json({
      authenticated: isAuthenticated,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ authenticated: false, error: "Verification failed" }, { status: 500 })
  }
}
