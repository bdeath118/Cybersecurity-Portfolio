// Integration configuration and validation
import { getEnv } from "./env"

export interface IntegrationConfig {
  name: string
  enabled: boolean
  requiredEnvVars: string[]
  optionalEnvVars: string[]
  oauthScopes?: string[]
  apiBaseUrl?: string
  redirectPath: string
}

export const INTEGRATIONS: Record<string, IntegrationConfig> = {
  linkedin: {
    name: "LinkedIn",
    enabled: true,
    requiredEnvVars: ["LINKEDIN_CLIENT_ID", "LINKEDIN_CLIENT_SECRET"],
    optionalEnvVars: ["LINKEDIN_PROFILE_URL"],
    oauthScopes: ["r_liteprofile", "r_emailaddress"],
    apiBaseUrl: "https://api.linkedin.com/v2",
    redirectPath: "/api/auth/linkedin/callback",
  },
  credly: {
    name: "Credly",
    enabled: true,
    requiredEnvVars: ["CREDLY_CLIENT_ID", "CREDLY_CLIENT_SECRET"],
    optionalEnvVars: ["CREDLY_USERNAME"],
    oauthScopes: ["read:badges"],
    apiBaseUrl: "https://api.credly.com/v1",
    redirectPath: "/api/auth/credly/callback",
  },
  canvas: {
    name: "Canvas LMS",
    enabled: true,
    requiredEnvVars: ["CANVAS_CLIENT_ID", "CANVAS_CLIENT_SECRET"],
    optionalEnvVars: ["CANVAS_API_KEY", "CANVAS_USER_ID", "CANVAS_DOMAIN"],
    oauthScopes: ["url:GET|/api/v1/users/:user_id/badges"],
    apiBaseUrl: "https://canvas.instructure.com/api/v1", // Default, can be overridden
    redirectPath: "/api/auth/canvas/callback",
  },
  github: {
    name: "GitHub",
    enabled: false, // Will be enabled when credentials are added
    requiredEnvVars: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
    optionalEnvVars: ["GITHUB_USERNAME"],
    oauthScopes: ["read:user", "public_repo"],
    apiBaseUrl: "https://api.github.com",
    redirectPath: "/api/auth/github/callback",
  },
  tryhackme: {
    name: "TryHackMe",
    enabled: false,
    requiredEnvVars: ["TRYHACKME_API_KEY"],
    optionalEnvVars: ["TRYHACKME_USERNAME"],
    apiBaseUrl: "https://tryhackme.com/api",
    redirectPath: "/api/auth/tryhackme/callback",
  },
  hackthebox: {
    name: "HackTheBox",
    enabled: false,
    requiredEnvVars: ["HACKTHEBOX_API_KEY"],
    optionalEnvVars: ["HACKTHEBOX_USERNAME"],
    apiBaseUrl: "https://www.hackthebox.com/api/v4",
    redirectPath: "/api/auth/hackthebox/callback",
  },
}

export function validateIntegration(integrationId: string): {
  valid: boolean
  missing: string[]
  configured: boolean
} {
  const integration = INTEGRATIONS[integrationId]
  if (!integration) {
    return { valid: false, missing: [], configured: false }
  }

  const env = getEnv()
  const missing: string[] = []

  // Check required environment variables
  integration.requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  })

  return {
    valid: missing.length === 0,
    missing,
    configured: integration.enabled && missing.length === 0,
  }
}

export function getIntegrationStatus(): Record<string, any> {
  const status: Record<string, any> = {}

  Object.keys(INTEGRATIONS).forEach((integrationId) => {
    const validation = validateIntegration(integrationId)
    const integration = INTEGRATIONS[integrationId]

    status[integrationId] = {
      name: integration.name,
      enabled: integration.enabled,
      configured: validation.configured,
      valid: validation.valid,
      missing: validation.missing,
      requiredEnvVars: integration.requiredEnvVars,
      optionalEnvVars: integration.optionalEnvVars,
    }
  })

  return status
}

export function getBaseUrl(): string {
  const env = getEnv()
  return env.SITE_URL || (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : "http://localhost:3000")
}

export function getRedirectUri(integrationId: string): string {
  const integration = INTEGRATIONS[integrationId]
  if (!integration) {
    throw new Error(`Unknown integration: ${integrationId}`)
  }

  return `${getBaseUrl()}${integration.redirectPath}`
}
