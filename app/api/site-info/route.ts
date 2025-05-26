import { NextResponse } from "next/server"
import { getSiteInfo } from "@/lib/data"

export async function GET() {
  try {
    const siteInfo = await getSiteInfo()
    return NextResponse.json(siteInfo)
  } catch (error) {
    console.error("Error fetching site info:", error)

    // Return default site info if there's an error
    const defaultSiteInfo = {
      name: "John Doe",
      title: "Cybersecurity Professional",
      description:
        "Passionate cybersecurity professional specializing in penetration testing, incident response, and security architecture.",
      email: "john.doe@example.com",
      github: "https://github.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "https://twitter.com/johndoe",
      theme: {
        primaryColor: "#3b82f6",
        secondaryColor: "#1e40af",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
      },
      icon: "/images/avatar-photo.jpg",
      backgroundImage: "/images/background.jpeg",
      backgroundOpacity: 80,
    }

    return NextResponse.json(defaultSiteInfo)
  }
}
