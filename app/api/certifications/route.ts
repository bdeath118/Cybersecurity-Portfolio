import { NextResponse } from "next/server"
import { getCertifications } from "@/lib/data"

export async function GET() {
  try {
    const certifications = await getCertifications()
    return NextResponse.json(certifications)
  } catch (error) {
    console.error("Error fetching certifications:", error)
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 })
  }
}
