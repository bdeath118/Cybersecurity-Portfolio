// Environment variable verification utility
// This helps debug and verify all required environment variables

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
    ["LINKEDIN_PROFILE_URL", "CREDLY_USERNAME", "CANVAS_API_KEY"].includes(r.variable),
  )
  const enabledIntegrations = integrations.filter((r) => r.present)

  console.log(`\n🔗 Integrations: ${enabledIntegrations.length}/${integrations.length} configured`)
  enabledIntegrations.forEach((r) => console.log(`   ✅ ${r.variable}`))

  return results
}
