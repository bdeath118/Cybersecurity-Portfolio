import { getSiteInfo, updateSiteInfo } from "./data"
import { getEnv } from "./env"

export async function initializeApplication() {
  try {
    console.log("🚀 Initializing cybersecurity portfolio application...")

    // Get environment configuration
    const env = getEnv()
    console.log("✅ Environment variables loaded")

    // Initialize site info with environment variables
    const currentSiteInfo = await getSiteInfo()

    // Update site info with environment variables if they exist
    const updates: any = {}

    if (env.SITE_URL && env.SITE_URL !== currentSiteInfo.siteUrl) {
      updates.siteUrl = env.SITE_URL
    }

    if (env.LINKEDIN_PROFILE_URL && env.LINKEDIN_PROFILE_URL !== currentSiteInfo.linkedinProfileUrl) {
      updates.linkedinProfileUrl = env.LINKEDIN_PROFILE_URL
    }

    if (Object.keys(updates).length > 0) {
      await updateSiteInfo(updates)
      console.log("✅ Site info updated with environment variables")
    }

    console.log("🎉 Application initialized successfully!")

    return {
      success: true,
      siteUrl: env.SITE_URL,
      environment: env.NODE_ENV,
      features: {
        adminDashboard: true,
        digitalBadges: true,
        linkedAccounts: true,
        autoImport: !!(env.LINKEDIN_PROFILE_URL || env.CREDLY_USERNAME),
      },
    }
  } catch (error) {
    console.error("❌ Error initializing application:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
