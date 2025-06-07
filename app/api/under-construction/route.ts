import { type NextRequest, NextResponse } from "next/server"
import { getUnderConstructionSettings, updateUnderConstructionSettings } from "@/lib/data"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const settings = await getUnderConstructionSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching under construction settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authCookie = cookies().get("admin-auth")
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const updatedSettings = await updateUnderConstructionSettings(body)

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
    })
  } catch (error) {
    console.error("Error updating under construction settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
