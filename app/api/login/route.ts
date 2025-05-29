import { type NextRequest, NextResponse } from "next/server"
import { loginUser } from "@/lib/data"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("Login API called with:", { username, password: "***" })

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const isValid = await loginUser(username, password)

    if (isValid) {
      // Create a simple session
      const sessionData = {
        userId: "admin",
        username,
        timestamp: Date.now(),
      }

      const response = NextResponse.json({ success: true })

      // Set session cookie
      response.cookies.set("auth-session", JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
        sameSite: "lax",
      })

      return response
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
