import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import { getSiteInfo, updateSiteInfo, getUnderConstructionSettings, updateUnderConstructionSettings } from "@/lib/data"

export async function GET(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }
  try {
    const siteInfo = await getSiteInfo()
    const underConstructionSettings = await getUnderConstructionSettings()
    return NextResponse.json({ siteInfo, underConstructionSettings })
  } catch (error) {
    console.error("API Error: Failed to fetch advanced settings:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch advanced settings" }), { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!isAuthenticated(request)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }
  try {
    const { siteInfo: newSiteInfo, underConstructionSettings: newUnderConstructionSettings } = await request.json()

    if (newSiteInfo) {
      await updateSiteInfo(newSiteInfo)
    }
    if (newUnderConstructionSettings) {
      await updateUnderConstructionSettings(newUnderConstructionSettings)
    }

    return new NextResponse(JSON.stringify({ message: "Advanced settings updated successfully" }), { status: 200 })
  } catch (error) {
    console.error("API Error: Failed to update advanced settings:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to update advanced settings" }), { status: 500 })
  }
}
