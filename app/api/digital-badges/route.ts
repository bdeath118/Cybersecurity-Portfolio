import { NextResponse } from "next/server"
import { getDigitalBadges } from "@/lib/data"

export async function GET() {
  try {
    const badges = await getDigitalBadges()
    return NextResponse.json(badges)
  } catch (error) {
    console.error("Error fetching digital badges:", error)
    return NextResponse.json({ error: "Failed to fetch digital badges" }, { status: 500 })
  }
}
