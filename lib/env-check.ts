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

  // Check ADMIN_USERNAME (optional but recommended)
  const adminUsername = process.env.ADMIN_USERNAME
  results.push({
    variable: "ADMIN_USERNAME",
    required: false,
    present: !!adminUsername,
    value: adminUsername,
    status: adminUsername ? "ok" : "warning",
    message: adminUsername ? `Set to: ${adminUsername}` : "Not set - Will use default credentials (admin/admin123)",
  })

  // Check ADMIN_PASSWORD (optional but recommended)
  const adminPassword = process.env.ADMIN_PASSWORD
  results.push({
    variable: "ADMIN_PASSWORD",
    required: false,
    present: !!adminPassword,
    masked: adminPassword ? "*".repeat(adminPassword.length) : undefined,
    status: adminPassword ? "ok" : "warning",
    message: adminPassword
      ? `Set (${adminPassword.length} characters)`
      : "Not set - Will use default credentials (admin/admin123)",
  })

  // Check SITE_URL (optional with default)
  const siteUrl = process.env.SITE_URL
  results.push({
    variable: "SITE_URL",
    required: false,
    present: !!siteUrl,
    value: siteUrl || "http://localhost:3000 (default)",
    status: "ok",
    message: siteUrl ? `Set to: ${siteUrl}` : "Using default: http://localhost:3000",
  })

  // Check NEXTAUTH_URL (optional in development)
  const nextAuthUrl = process.env.NEXTAUTH_URL
  const isProduction = process.env.NODE_ENV === "production"
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

  return results
}
