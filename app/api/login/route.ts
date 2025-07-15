import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("=== LOGIN API DEBUG ===")
    console.log("Received login attempt for username:", username)

    // Get environment variables
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    console.log("Environment variables:")
    console.log("- ADMIN_USERNAME:", adminUsername || "NOT SET")
    console.log("- ADMIN_PASSWORD exists:", !!adminPassword)

    // Check credentials
    let isValid = false

    if (adminUsername && adminPassword) {
      console.log("Using environment credentials")
      isValid = username === adminUsername && password === adminPassword
      console.log("Username match:", username === adminUsername)
      console.log("Password match:", password === adminPassword)
    } else {
      console.log("Environment variables not set, using fallback")
      isValid = username === "admin" && password === "admin123"
      console.log("Using fallback credentials: admin/admin123")
      console.log("Username match:", username === "admin")
      console.log("Password match:", password === "admin123")
    }

    console.log("Login valid:", isValid)
    console.log("=== END LOGIN DEBUG ===")

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: "Login successful",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or password",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
