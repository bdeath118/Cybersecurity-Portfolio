// Environment variable verification utility
// This helps debug and verify all required environment variables

import type { SiteInfo } from "./types"

export interface EnvCheckResult {
  variable: string
  required: boolean
  present: boolean
  value?: string
  masked?: string
  status: "ok" | "missing" | "warning"
  message: string
}

export function checkEnvironmentVariables(): EnvCheckResult[] {
  const results: EnvCheckResult[] = []

  const requiredEnvVars = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "ADMIN_USERNAME",
    "ADMIN_PASSWORD",
    "AUTH_SECRET",
    "NEXTAUTH_URL",
    "SITE_URL",
  ]

  const missingVars: string[] = []
  const publicVars: string[] = []
  const sensitiveVars: string[] = []

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar)
    }
    if (envVar.startsWith("NEXT_PUBLIC_")) {
      publicVars.push(envVar)
    } else {
      sensitiveVars.push(envVar)
    }
  }

  const optionalIntegrations = [
    { name: "LINKEDIN_PROFILE_URL", type: "public" },
    { name: "CREDLY_USERNAME", type: "public" },
    { name: "CANVAS_API_KEY", type: "sensitive" },
    { name: "CANVAS_USER_ID", type: "sensitive" },
    { name: "TRYHACKME_USERNAME", type: "public" },
    { name: "HACKTHEBOX_USERNAME", type: "public" },
    { name: "GITHUB_USERNAME", type: "public" },
    { name: "HACKERONE_USERNAME", type: "public" },
    { name: "HACKERONE_API_TOKEN", type: "sensitive" },
    { name: "HACKTHEBOX_API_KEY", type: "sensitive" },
    { name: "EMAIL_ADDRESS", type: "public" },
  ]

  const integrationStatus: { name: string; configured: boolean; type: string }[] = []
  for (const integration of optionalIntegrations) {
    const configured = !!process.env[integration.name]
    integrationStatus.push({ name: integration.name, configured, type: integration.type })
  }

  // Check AUTH_SECRET (required)
  const authSecret = process.env.AUTH_SECRET
  results.push({
    variable: "AUTH_SECRET",
    required: true,
    present: !!authSecret,
    masked: authSecret ? `${authSecret.substring(0, 4)}...${authSecret.substring(authSecret.length - 4)}` : undefined,
    status: authSecret ? "ok" : "missing",
    message: authSecret ? `Present (${authSecret.length} characters)` : "Missing - This is required for authentication",
  })

  // Check ADMIN_USERNAME (required in production)
  const adminUsername = process.env.ADMIN_USERNAME
  const isProduction = process.env.NODE_ENV === "production"
  results.push({
    variable: "ADMIN_USERNAME",
    required: isProduction,
    present: !!adminUsername,
    value: adminUsername,
    status: adminUsername ? "ok" : isProduction ? "missing" : "warning",
    message: adminUsername
      ? `Set to: ${adminUsername}`
      : isProduction
        ? "Missing - Required in production"
        : "Not set - Will use default credentials (admin/admin123)",
  })

  // Check ADMIN_PASSWORD (required in production)
  const adminPassword = process.env.ADMIN_PASSWORD
  results.push({
    variable: "ADMIN_PASSWORD",
    required: isProduction,
    present: !!adminPassword,
    masked: adminPassword ? "*".repeat(adminPassword.length) : undefined,
    status: adminPassword ? "ok" : isProduction ? "missing" : "warning",
    message: adminPassword
      ? `Set (${adminPassword.length} characters)`
      : isProduction
        ? "Missing - Required in production"
        : "Not set - Will use default credentials (admin/admin123)",
  })

  // Check SITE_URL (optional with default)
  const siteUrl = process.env.SITE_URL
  results.push({
    variable: "SITE_URL",
    required: false,
    present: !!siteUrl,
    value: siteUrl || "Auto-detected from Vercel",
    status: "ok",
    message: siteUrl ? `Set to: ${siteUrl}` : "Will auto-detect from Vercel environment",
  })

  // Check NEXTAUTH_URL (optional in development)
  const nextAuthUrl = process.env.NEXTAUTH_URL
  results.push({
    variable: "NEXTAUTH_URL",
    required: isProduction,
    present: !!nextAuthUrl,
    value: nextAuthUrl,
    status: isProduction && !nextAuthUrl ? "missing" : "ok",
    message: nextAuthUrl
      ? `Set to: ${nextAuthUrl}`
      : isProduction
        ? "Missing - Required in production"
        : "Not set - Optional in development",
  })

  // Check LinkedIn Profile URL
  const linkedinProfileUrl = process.env.LINKEDIN_PROFILE_URL
  results.push({
    variable: "LINKEDIN_PROFILE_URL",
    required: false,
    present: !!linkedinProfileUrl,
    value: linkedinProfileUrl,
    status: linkedinProfileUrl ? "ok" : "warning",
    message: linkedinProfileUrl ? `Set to: ${linkedinProfileUrl}` : "Not set - LinkedIn auto-import disabled",
  })

  // Check Credly Username
  const credlyUsername = process.env.CREDLY_USERNAME
  results.push({
    variable: "CREDLY_USERNAME",
    required: false,
    present: !!credlyUsername,
    value: credlyUsername,
    status: credlyUsername ? "ok" : "warning",
    message: credlyUsername ? `Set to: ${credlyUsername}` : "Not set - Credly badge import disabled",
  })

  // Check Canvas API Key
  const canvasApiKey = process.env.CANVAS_API_KEY
  results.push({
    variable: "CANVAS_API_KEY",
    required: false,
    present: !!canvasApiKey,
    masked: canvasApiKey ? "*".repeat(canvasApiKey.length) : undefined,
    status: canvasApiKey ? "ok" : "warning",
    message: canvasApiKey ? `Set (${canvasApiKey.length} characters)` : "Not set - Canvas badge import disabled",
  })

  // Check Canvas User ID
  const canvasUserId = process.env.CANVAS_USER_ID
  results.push({
    variable: "CANVAS_USER_ID",
    required: false,
    present: !!canvasUserId,
    value: canvasUserId,
    status: canvasUserId ? "ok" : "warning",
    message: canvasUserId ? `Set to: ${canvasUserId}` : "Not set - Canvas badge import disabled",
  })

  // Check NODE_ENV
  const nodeEnv = process.env.NODE_ENV || "development"
  results.push({
    variable: "NODE_ENV",
    required: false,
    present: !!process.env.NODE_ENV,
    value: nodeEnv,
    status: "ok",
    message: `Environment: ${nodeEnv}`,
  })

  // Check TRYHACKME_USERNAME
  const tryhackmeUsername = process.env.TRYHACKME_USERNAME
  results.push({
    variable: "TRYHACKME_USERNAME",
    required: false,
    present: !!tryhackmeUsername,
    value: tryhackmeUsername,
    status: tryhackmeUsername ? "ok" : "warning",
    message: tryhackmeUsername ? `Set to: ${tryhackmeUsername}` : "Not set - TryHackMe auto-import disabled",
  })

  // Check HACKTHEBOX_USERNAME
  const hacktheboxUsername = process.env.HACKTHEBOX_USERNAME
  results.push({
    variable: "HACKTHEBOX_USERNAME",
    required: false,
    present: !!hacktheboxUsername,
    value: hacktheboxUsername,
    status: hacktheboxUsername ? "ok" : "warning",
    message: hacktheboxUsername ? `Set to: ${hacktheboxUsername}` : "Not set - HackTheBox auto-import disabled",
  })

  // Check GITHUB_USERNAME
  const githubUsername = process.env.GITHUB_USERNAME
  results.push({
    variable: "GITHUB_USERNAME",
    required: false,
    present: !!githubUsername,
    value: githubUsername,
    status: githubUsername ? "ok" : "warning",
    message: githubUsername ? `Set to: ${githubUsername}` : "Not set - GitHub auto-import disabled",
  })

  // Check HACKERONE_USERNAME
  const hackeroneUsername = process.env.HACKERONE_USERNAME
  results.push({
    variable: "HACKERONE_USERNAME",
    required: false,
    present: !!hackeroneUsername,
    value: hackeroneUsername,
    status: hackeroneUsername ? "ok" : "warning",
    message: hackeroneUsername ? `Set to: ${hackeroneUsername}` : "Not set - HackerOne auto-import disabled",
  })

  // Check HACKERONE_API_TOKEN
  const hackeroneApiToken = process.env.HACKERONE_API_TOKEN
  results.push({
    variable: "HACKERONE_API_TOKEN",
    required: false,
    present: !!hackeroneApiToken,
    masked: hackeroneApiToken ? "*".repeat(hackeroneApiToken.length) : undefined,
    status: hackeroneApiToken ? "ok" : "warning",
    message: hackeroneApiToken
      ? `Set (${hackeroneApiToken.length} characters)`
      : "Not set - HackerOne API token disabled",
  })

  // Check HACKTHEBOX_API_KEY
  const hacktheboxApiKey = process.env.HACKTHEBOX_API_KEY
  results.push({
    variable: "HACKTHEBOX_API_KEY",
    required: false,
    present: !!hacktheboxApiKey,
    masked: hacktheboxApiKey ? "*".repeat(hacktheboxApiKey.length) : undefined,
    status: hacktheboxApiKey ? "ok" : "warning",
    message: hacktheboxApiKey ? `Set (${hacktheboxApiKey.length} characters)` : "Not set - HackTheBox API key disabled",
  })

  // Check EMAIL_ADDRESS
  const emailAddress = process.env.EMAIL_ADDRESS
  results.push({
    variable: "EMAIL_ADDRESS",
    required: false,
    present: !!emailAddress,
    value: emailAddress,
    status: emailAddress ? "ok" : "warning",
    message: emailAddress ? `Set to: ${emailAddress}` : "Not set - Email address not provided",
  })

  return results
}

export function logEnvironmentStatus() {
  const results = checkEnvironmentVariables()

  console.log("\n🔍 Environment Variables Check:")
  console.log("================================")

  results.forEach((result) => {
    const icon = result.status === "ok" ? "✅" : result.status === "warning" ? "⚠️" : "❌"
    const requiredText = result.required ? "[REQUIRED]" : "[OPTIONAL]"

    console.log(`${icon} ${result.variable} ${requiredText}`)
    console.log(`   ${result.message}`)

    if (result.status === "missing" && result.required) {
      console.log(`   ❗ Action needed: Set this environment variable`)
    }
    console.log("")
  })

  const missingRequired = results.filter((r) => r.required && !r.present)
  if (missingRequired.length > 0) {
    console.log("❌ Missing required environment variables:")
    missingRequired.forEach((r) => console.log(`   - ${r.variable}`))
  } else {
    console.log("✅ All required environment variables are set!")
  }

  // Integration status
  const integrations = results.filter((r) =>
    [
      "LINKEDIN_PROFILE_URL",
      "CREDLY_USERNAME",
      "CANVAS_API_KEY",
      "TRYHACKME_USERNAME",
      "HACKTHEBOX_USERNAME",
      "GITHUB_USERNAME",
      "HACKERONE_USERNAME",
      "HACKERONE_API_TOKEN",
      "HACKTHEBOX_API_KEY",
    ].includes(r.variable),
  )
  const enabledIntegrations = integrations.filter((r) => r.present)

  console.log(`\n🔗 Integrations: ${enabledIntegrations.length}/${integrations.length} configured`)
  enabledIntegrations.forEach((r) => console.log(`   ✅ ${r.variable}`))

  return results
}

export function getSiteInfoFromEnv(): SiteInfo {
  return {
    id: "env-site-info",
    site_name: process.env.SITE_NAME || "Cybersecurity Portfolio",
    title: process.env.SITE_TITLE || "My Cybersecurity Portfolio",
    description: process.env.SITE_DESCRIPTION || "A professional cybersecurity portfolio showcasing expertise.",
    seo_title: process.env.SEO_TITLE || "Cybersecurity Portfolio",
    seo_description: process.env.SEO_DESCRIPTION || "Professional cybersecurity portfolio.",
    keywords: process.env.KEYWORDS
      ? process.env.KEYWORDS.split(",").map((k) => k.trim())
      : ["cybersecurity", "portfolio"],
    site_url: process.env.SITE_URL || "http://localhost:3000",
    social_image_url: process.env.SOCIAL_IMAGE_URL || "/placeholder.svg",
    avatar_url: process.env.AVATAR_URL || "/placeholder.svg",
    linkedin_profile_url: process.env.LINKEDIN_PROFILE_URL || "",
    github_username: process.env.GITHUB_USERNAME || "",
    credly_username: process.env.CREDLY_USERNAME || "",
    hackerone_username: process.env.HACKERONE_USERNAME || "",
    hackthebox_username: process.env.HACKTHEBOX_USERNAME || "",
    email_address: process.env.EMAIL_ADDRESS || "",
    theme_color: process.env.THEME_COLOR || "#0ea5e9",
    twitter: process.env.TWITTER_HANDLE || "",
    admin_username: process.env.ADMIN_USERNAME || "admin",
    admin_password_hash: process.env.ADMIN_PASSWORD || "", // This should ideally be a hash
    last_updated: new Date().toISOString(),
  }
}
