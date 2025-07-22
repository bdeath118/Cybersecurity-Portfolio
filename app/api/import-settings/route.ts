import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getIntegrationStatus, updateIntegrationStatus } from "@/lib/data" // Assuming these are data functions

export async function GET(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }
  try {
    const status = await getIntegrationStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error("API Error: Failed to fetch integration status:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch integration status" }), { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }
  try {
    const { platform, updates } = await request.json()
    if (!platform || !updates) {
      return new NextResponse(JSON.stringify({ error: "Platform and updates are required" }), { status: 400 })
    }
    const updatedStatus = await updateIntegrationStatus(platform, updates)
    return NextResponse.json(updatedStatus)
  } catch (error) {
    console.error("API Error: Failed to update integration status:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to update integration status" }), { status: 500 })
  }
}
