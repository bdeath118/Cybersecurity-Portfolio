import { NextResponse } from "next/server"

export async function GET() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    supabase: {
      url: "https://icustcymiynpwjfoogtc.supabase.co",
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    admin: {
      hasUsername: !!process.env.ADMIN_USERNAME,
      hasPassword: !!process.env.ADMIN_PASSWORD,
      username: process.env.ADMIN_USERNAME || "admin (fallback)",
    },
    deployment: {
      siteUrl: process.env.SITE_URL || process.env.VERCEL_URL || "localhost:3000",
      vercelUrl: process.env.VERCEL_URL,
    },
  }

  return NextResponse.json(debugInfo, {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
