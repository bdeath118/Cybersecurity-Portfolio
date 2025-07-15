import { NextResponse } from "next/server"
import { getSiteInfo } from "@/lib/data"

export async function GET() {
  try {
    const siteInfo = await getSiteInfo()
    return NextResponse.json(siteInfo)
  } catch (error) {
    console.error("Error fetching site info:", error)

    // Return fallback data
    return NextResponse.json({
      name: "Cybersecurity Professional",
      title: "Cybersecurity Portfolio",
      description: "Professional cybersecurity portfolio",
      email: "contact@example.com",
      theme: {
        primary: "#3b82f6",
        secondary: "#1e40af",
        accent: "#06b6d4",
      },
      background_image: "/images/background.jpeg",
      background_opacity: 0.7,
    })
  }
}
