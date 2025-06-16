import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log("=== LOGIN API DEBUG ===")
    console.log("Received username:", username)
    console.log("Received password length:", password?.length)

    // Log all environment variables for debugging
    console.log("Environment variables:")
    console.log("- NODE_ENV:", process.env.NODE_ENV)
    console.log("- ADMIN_USERNAME:", process.env.ADMIN_USERNAME)
    console.log("- ADMIN_PASSWORD exists:", !!process.env.ADMIN_PASSWORD)
    console.log("- ADMIN_PASSWORD length:", process.env.ADMIN_PASSWORD?.length)

    if (!username || !password) {
      console.log("Missing username or password")
      return NextResponse.json(
        {
          success: false,
          error: "Username and password are required",
        },
        { status: 400 },
      )
    }

    // Get admin credentials from environment
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    console.log("Credential check:")
    console.log("- Admin username from env:", adminUsername)
    console.log("- Admin password from env exists:", !!adminPassword)
    console.log("- Username match:", username === adminUsername)
    console.log("- Password match:", password === adminPassword)

    // If no environment variables, use hardcoded defaults for development
    const fallbackUsername = "admin"
    const fallbackPassword = "admin123"

    let isValidLogin = false

    if (adminUsername && adminPassword) {
      // Use environment variables if available
      isValidLogin = username === adminUsername && password === adminPassword
      console.log("Using environment credentials")
    } else {
      // Use fallback credentials
      isValidLogin = username === fallbackUsername && password === fallbackPassword
      console.log("Using fallback credentials (admin/admin123)")
    }

    console.log("Login valid:", isValidLogin)

    if (isValidLogin) {
      console.log("Authentication successful - setting cookie")

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

    console.log("Authentication failed")
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
