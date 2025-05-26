import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  console.log("🚀 Login API called")

  // Check rate limit
  const rateLimitResponse = rateLimit(req)
  if (rateLimitResponse) {
    console.log("⚠️ Rate limit exceeded")
    return rateLimitResponse
  }

  try {
    const body = await req.json()
    console.log("📝 Request body received:", {
      hasUsername: !!body.username,
      hasPassword: !!body.password,
      usernameLength: body.username?.length || 0,
      passwordLength: body.password?.length || 0,
    })

    const { username, password } = body

    if (!username || !password) {
      console.log("❌ Missing credentials")
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 })
    }

    console.log("🔐 Attempting authentication...")
    const result = await authenticateUser(username, password)
    console.log("✅ Authentication result:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("💥 Login error:", error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("AUTH_SECRET")) {
        return NextResponse.json(
          {
            success: false,
            message: "Server configuration error. Please check environment variables.",
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login. Please try again.",
      },
      { status: 500 },
    )
  }
}
