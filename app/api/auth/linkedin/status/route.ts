import { NextResponse } from "next/server"
import { getToken } from "@/lib/auth-providers"

export async function GET() {
  const token = getToken("linkedin")

  return NextResponse.json({
    connected: !!token,
    expiresAt: token?.expiresAt || null,
  })
}
