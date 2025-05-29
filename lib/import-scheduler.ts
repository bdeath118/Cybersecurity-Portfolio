import cron from "node-cron"
import { LinkedInIntegration, BadgeIntegration } from "./linkedin-integration"
import { getSiteInfo, addProject, addSkill, addDigitalBadge } from "./data"

export class ImportScheduler {
  private static instance: ImportScheduler
  private jobs: Map<string, cron.ScheduledTask> = new Map()

  static getInstance(): ImportScheduler {
    if (!ImportScheduler.instance) {
      ImportScheduler.instance = new ImportScheduler()
    }
    return ImportScheduler.instance
  }

  async scheduleImports() {
    const siteInfo = await getSiteInfo()
    const settings = siteInfo.autoImportSettings

    if (!settings?.linkedinEnabled) return

    // Schedule based on frequency
    const cronPattern = settings.importFrequency === "daily" ? "0 2 * * *" : "0 2 * * 0" // 2 AM daily or weekly

    // Clear existing job
    this.stopJob("linkedin-import")

    // Schedule new job
    const job = cron.schedule(
      cronPattern,
      async () => {
        await this.performImport()
      },
      {
        scheduled: false,
        timezone: "UTC",
      },
    )

    this.jobs.set("linkedin-import", job)
    job.start()

    console.log(`✅ Scheduled LinkedIn import: ${settings.importFrequency}`)
  }

  async performImport() {
    try {
      console.log("🔄 Starting automated import...")

      const siteInfo = await getSiteInfo()
      const linkedinUrl = siteInfo.linkedinProfileUrl

      if (!linkedinUrl) {
        console.log("❌ No LinkedIn URL configured")
        return
      }

      const linkedinIntegration = new LinkedInIntegration(linkedinUrl)
      const badgeIntegration = new BadgeIntegration()

      // Import projects
      const projects = await linkedinIntegration.extractProjects()
      for (const project of projects) {
        await addProject(project)
      }

      // Import skills
      const skills = await linkedinIntegration.extractSkills()
      for (const skill of skills) {
        await addSkill(skill)
      }

      // Import badges if enabled
      if (siteInfo.autoImportSettings?.badgesEnabled) {
        // Import from various platforms
        const credlyBadges = await badgeIntegration.importCredlyBadges("username") // Would use actual username
        for (const badge of credlyBadges) {
          await addDigitalBadge(badge)
        }
      }

      console.log("✅ Import completed successfully")
    } catch (error) {
      console.error("❌ Import failed:", error)
    }
  }

  stopJob(jobName: string) {
    const job = this.jobs.get(jobName)
    if (job) {
      job.stop()
      this.jobs.delete(jobName)
    }
  }

  stopAllJobs() {
    this.jobs.forEach((job) => job.stop())
    this.jobs.clear()
  }
}

// Initialize scheduler on module load
if (typeof window === "undefined") {
  // Only run on server side
  const scheduler = ImportScheduler.getInstance()
  scheduler.scheduleImports().catch(console.error)
}
