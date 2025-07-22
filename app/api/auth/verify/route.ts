import { NextResponse } from "next/server"
import { validateUser } from "@/lib/data" // Assuming validateUser is in lib/data.ts

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return new NextResponse(JSON.stringify({ success: false, message: "Username and password are required." }), {
        status: 400,
      })
    }

    const isValid = await validateUser(username, password)

    if (isValid) {
      // In a real application, you would issue a JWT or set a session cookie here.
      // For this example, we'll just return a success message.
      return new NextResponse(JSON.stringify({ success: true, message: "Authentication successful." }), { status: 200 })
    } else {
      return new NextResponse(JSON.stringify({ success: false, message: "Invalid username or password." }), {
        status: 401,
      })
    }
  } catch (error: any) {
    console.error("Authentication API error:", error)
    return new NextResponse(JSON.stringify({ success: false, message: `Authentication failed: ${error.message}` }), {
      status: 500,
    })
  }
}
