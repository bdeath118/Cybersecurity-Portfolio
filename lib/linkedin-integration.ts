import axios from "axios"
import * as cheerio from "cheerio"
import type { LinkedInProfile, Project, Skill, DigitalBadge } from "./types"

export class LinkedInIntegration {
  private profileUrl: string

  constructor(profileUrl: string) {
    this.profileUrl = profileUrl
  }

  async scrapeProfile(): Promise<LinkedInProfile | null> {
    try {
      // Note: This is a simplified example. In production, you'd need to handle LinkedIn's anti-scraping measures
      // and potentially use their official API with proper authentication

      const response = await axios.get(this.profileUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        timeout: 10000,
      })

      const $ = cheerio.load(response.data)

      // Extract basic profile information
      const name = $("h1.text-heading-xlarge").first().text().trim()
      const headline = $("div.text-body-medium").first().text().trim()

      // Extract experience (simplified)
      const experience = []
      $('section[data-section="experience"] li').each((i, elem) => {
        const title = $(elem).find("h3").text().trim()
        const company = $(elem).find("h4").text().trim()
        const duration = $(elem).find("span.date-range").text().trim()
        const description = $(elem).find("p").text().trim()

        if (title && company) {
          experience.push({ title, company, duration, description })
        }
      })

      // Extract skills (simplified)
      const skills = []
      $('section[data-section="skills"] span.skill-name').each((i, elem) => {
        const name = $(elem).text().trim()
        const endorsements = Number.parseInt($(elem).siblings(".endorsement-count").text()) || 0

        if (name) {
          skills.push({ name, endorsements })
        }
      })

      // Extract projects (simplified)
      const projects = []
      $('section[data-section="projects"] li').each((i, elem) => {
        const name = $(elem).find("h3").text().trim()
        const description = $(elem).find("p").text().trim()
        const url = $(elem).find("a").attr("href")

        if (name) {
          projects.push({ name, description, url })
        }
      })

      return {
        name,
        headline,
        summary: headline, // Use headline as summary for now
        experience,
        skills,
        projects,
      }
    } catch (error) {
      console.error("Error scraping LinkedIn profile:", error)
      return null
    }
  }

  async extractProjects(): Promise<Project[]> {
    const profile = await this.scrapeProfile()
    if (!profile) return []

    return profile.projects.map((project, index) => ({
      id: `linkedin-${Date.now()}-${index}`,
      title: project.name,
      summary: project.description.substring(0, 150) + "...",
      description: project.description,
      technologies: project.skills || [],
      demoUrl: project.url,
      date: project.date || new Date().toISOString().split("T")[0],
      linkedinImported: true,
      lastUpdated: new Date().toISOString(),
    }))
  }

  async extractSkills(): Promise<Skill[]> {
    const profile = await this.scrapeProfile()
    if (!profile) return []

    return profile.skills.map((skill, index) => ({
      id: `linkedin-skill-${Date.now()}-${index}`,
      name: skill.name,
      level: Math.min(95, Math.max(60, skill.endorsements * 5)), // Convert endorsements to skill level
      category: "Professional Skills",
      linkedinImported: true,
      endorsements: skill.endorsements,
      lastUpdated: new Date().toISOString(),
    }))
  }
}

export class BadgeIntegration {
  async importCredlyBadges(username: string): Promise<DigitalBadge[]> {
    try {
      // Credly public API endpoint
      const response = await axios.get(`https://www.credly.com/users/${username}/badges.json`, {
        timeout: 10000,
      })

      return response.data.data.map((badge: any) => ({
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

  async importCanvasBadges(apiKey: string, userId: string): Promise<DigitalBadge[]> {
    try {
      // Canvas API endpoint for badges
      const response = await axios.get(`https://canvas.instructure.com/api/v1/users/${userId}/badges`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 10000,
      })

      return response.data.map((badge: any) => ({
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

  async importLinkedInBadges(profileUrl: string): Promise<DigitalBadge[]> {
    try {
      // This would require LinkedIn API access or scraping
      // For now, return empty array as LinkedIn badges require special handling
      console.log("LinkedIn badge import not yet implemented")
      return []
    } catch (error) {
      console.error("Error importing LinkedIn badges:", error)
      return []
    }
  }
}
