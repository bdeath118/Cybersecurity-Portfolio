import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { validateUser } from "@/lib/data"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    console.log("🔐 Admin login attempt:", {
      username,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
    })

    // Validate credentials using environment variables
    const isValid = await validateUser(username, password)

    if (isValid) {
      console.log("✅ Admin authentication successful for:", username)

      // Set secure authentication cookie
      const cookieStore = cookies()
      cookieStore.set("admin-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })

      return NextResponse.json({
        success: true,
        message: "Authentication successful",
        timestamp: new Date().toISOString(),
      })
    } else {
      console.log("❌ Admin authentication failed for:", username)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or password",
          timestamp: new Date().toISOString(),
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("❌ Admin login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
