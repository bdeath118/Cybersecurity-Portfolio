import { NextResponse } from "next/server"

export async function GET() {
  if (process.env.NODE_ENV === "development") {
    return NextResponse.json({
      adminUsername: process.env.ADMIN_USERNAME || "admin",
      adminPassword: process.env.ADMIN_PASSWORD || "admin123", // Only expose in development
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "***SET***" : "***NOT SET***",
      supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "***SET***" : "***NOT SET***",
      linkedinProfileUrl: process.env.LINKEDIN_PROFILE_URL,
      credlyUsername: process.env.CREDLY_USERNAME,
      githubUsername: process.env.GITHUB_USERNAME,
      hackeroneUsername: process.env.HACKERONE_USERNAME,
      tryhackmeUsername: process.env.TRYHACKME_USERNAME,
      hacktheboxUsername: process.env.HACKTHEBOX_USERNAME,
      canvasApiKey: process.env.CANVAS_API_KEY ? "***SET***" : "***NOT SET***",
      canvasUserId: process.env.CANVAS_USER_ID,
      // Add other relevant environment variables here, but mask sensitive ones
    })
  } else {
    return NextResponse.json({ message: "Debug endpoint is only available in development mode." }, { status: 403 })
  }
}
