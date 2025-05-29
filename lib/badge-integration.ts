import type { DigitalBadge } from "./types"
import { getToken, CredlyAuthProvider, CanvasAuthProvider } from "./auth-providers"

export class BadgeIntegration {
  // Import badges from Credly using OAuth
  async importCredlyBadges(): Promise<DigitalBadge[]> {
    try {
      // Get the stored token
      const tokenData = getToken("credly")
      if (!tokenData) {
        console.error("No Credly token found")
        return []
      }

      // Use the token to fetch badges
      const credlyAuth = new CredlyAuthProvider()
      const badges = await credlyAuth.getUserBadges(tokenData.accessToken)

      // Transform the badges to our format
      return badges.map((badge: any) => ({
        id: `credly-${badge.id}`,
        name: badge.badge_template.name,
        issuer: badge.badge_template.issuer.name,
        date: badge.issued_at.split("T")[0],
        description: badge.badge_template.description,
        badgeUrl: badge.badge_template.image_url,
        verificationUrl: badge.public_url,
        platform: "credly" as const,
        skills: badge.badge_template.skills?.map((skill: any) => skill.name) || [],
        image: badge.badge_template.image_url,
      }))
    } catch (error) {
      console.error("Error importing Credly badges:", error)
      return []
    }
  }

  // Import badges from Canvas using OAuth
  async importCanvasBadges(): Promise<DigitalBadge[]> {
    try {
      // Get the stored token
      const tokenData = getToken("canvas")
      if (!tokenData) {
        console.error("No Canvas token found")
        return []
      }

      // Check if Canvas user ID is available
      const userId = process.env.CANVAS_USER_ID
      if (!userId) {
        console.error("Canvas User ID not configured")
        return []
      }

      // Use the token to fetch badges
      const canvasAuth = new CanvasAuthProvider()
      const badges = await canvasAuth.getUserBadges(tokenData.accessToken, userId)

      // Transform the badges to our format
      return badges.map((badge: any) => ({
        id: `canvas-${badge.id}`,
        name: badge.name,
        issuer: badge.issuer || "Canvas",
        date: badge.issued_at?.split("T")[0] || new Date().toISOString().split("T")[0],
        description: badge.description || "",
        badgeUrl: badge.image_url,
        verificationUrl: badge.verification_url,
        platform: "canvas" as const,
        skills: [],
        image: badge.image_url,
      }))
    } catch (error) {
      console.error("Error importing Canvas badges:", error)
      return []
    }
  }

  // Import badges from LinkedIn
  async importLinkedInBadges(): Promise<DigitalBadge[]> {
    // LinkedIn doesn't have a direct badges API, but we could
    // potentially scrape the profile or use a different approach
    return []
  }
}
