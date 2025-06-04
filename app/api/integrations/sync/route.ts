import { NextResponse } from "next/server"
import { LinkedInIntegration, BadgeIntegration } from "@/lib/linkedin-integration"
import { getToken } from "@/lib/auth-providers"
import { addProject, addSkill, addDigitalBadge } from "@/lib/data"

export async function POST(request: Request) {
  try {
    const { platforms } = await request.json()

    if (!platforms || !Array.isArray(platforms)) {
      return NextResponse.json({ error: "Invalid platforms array" }, { status: 400 })
    }

    const results: Record<string, any> = {}

    for (const platform of platforms) {
      try {
        console.log(`Syncing data from ${platform}...`)

        switch (platform) {
          case "linkedin":
            const linkedinToken = getToken("linkedin")
            if (linkedinToken) {
              const linkedinIntegration = new LinkedInIntegration(process.env.LINKEDIN_PROFILE_URL || "")
              const projects = await linkedinIntegration.extractProjects()
              const skills = await linkedinIntegration.extractSkills()

              for (const project of projects) {
                await addProject(project)
              }

              for (const skill of skills) {
                await addSkill(skill)
              }

              results[platform] = {
                success: true,
                imported: {
                  projects: projects.length,
                  skills: skills.length,
                },
              }
            } else {
              results[platform] = {
                success: false,
                error: "Not connected",
              }
            }
            break

          case "credly":
            const credlyToken = getToken("credly")
            if (credlyToken) {
              const badgeIntegration = new BadgeIntegration()
              const badges = await badgeIntegration.importCredlyBadges()

              for (const badge of badges) {
                await addDigitalBadge(badge)
              }

              results[platform] = {
                success: true,
                imported: {
                  badges: badges.length,
                },
              }
            } else {
              results[platform] = {
                success: false,
                error: "Not connected",
              }
            }
            break

          case "canvas":
            const canvasToken = getToken("canvas")
            if (canvasToken) {
              const badgeIntegration = new BadgeIntegration()
              const badges = await badgeIntegration.importCanvasBadges()

              for (const badge of badges) {
                await addDigitalBadge(badge)
              }

              results[platform] = {
                success: true,
                imported: {
                  badges: badges.length,
                },
              }
            } else {
              results[platform] = {
                success: false,
                error: "Not connected",
              }
            }
            break

          default:
            results[platform] = {
              success: false,
              error: "Platform not supported for sync yet",
            }
        }
      } catch (error) {
        console.error(`Error syncing ${platform}:`, error)
        results[platform] = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in sync endpoint:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync integrations",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
