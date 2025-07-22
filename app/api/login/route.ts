import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  const { username, password } = await request.json()

  const adminUsername = process.env.ADMIN_USERNAME || "admin"
  const adminPasswordHash = process.env.ADMIN_PASSWORD
    ? await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    : await bcrypt.hash("admin123", 10) // Fallback for development

  if (username === adminUsername && (await bcrypt.compare(password, adminPasswordHash))) {
    // Set a secure, HTTP-only cookie for session management
    cookies().set("auth_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "lax",
    })

    return NextResponse.json({ message: "Login successful" }, { status: 200 })
  } else {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
  }
}
