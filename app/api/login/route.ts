import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { validateUser } from "@/lib/data"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    console.log("🔐 Login attempt for username:", username)

    // Validate credentials
    const isValid = await validateUser(username, password)

    if (isValid) {
      console.log("✅ Login successful for:", username)

      // Set authentication cookie
      const cookieStore = cookies()
      cookieStore.set("admin-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })

      return NextResponse.json({ success: true })
    } else {
      console.log("❌ Login failed for:", username)
      return NextResponse.json({ success: false, error: "Invalid username or password" }, { status: 401 })
    }
  } catch (error) {
    console.error("❌ Login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
