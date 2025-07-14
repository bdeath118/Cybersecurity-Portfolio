import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log("Login API called with username:", username)
    console.log("Environment variables check:")
    console.log("- ADMIN_USERNAME:", process.env.ADMIN_USERNAME || "not set")
    console.log("- ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD ? "set" : "not set")

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Username and password are required",
        },
        { status: 400 },
      )
    }

    // Use the provided environment variables
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    console.log("Credential comparison:")
    console.log("- Expected username:", adminUsername)
    console.log("- Provided username:", username)
    console.log("- Username match:", username === adminUsername)
    console.log("- Password match:", password === adminPassword)

    // Check if environment variables are set
    if (!adminUsername || !adminPassword) {
      console.log("Environment variables not properly set, using fallback")
      return NextResponse.json(
        {
          success: false,
          error: "Admin credentials not configured. Please check environment variables.",
        },
        { status: 500 },
      )
    }

    if (username === adminUsername && password === adminPassword) {
      console.log("Authentication successful")

      // Set the authentication cookie
      cookies().set("admin-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
        sameSite: "lax",
      })

      return NextResponse.json({ success: true })
    }

    console.log("Authentication failed - credentials don't match")
    return NextResponse.json(
      {
        success: false,
        error: "Invalid username or password",
      },
      { status: 401 },
    )
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during login",
      },
      { status: 500 },
    )
  }
}
