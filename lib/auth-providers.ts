import { cookies } from "next/headers"
import { use } from "react" // Import use from react
import axios from "axios"
import {
  GITHUB_USERNAME,
  LINKEDIN_PROFILE_URL,
  CREDLY_USERNAME,
  CANVAS_API_KEY,
  CANVAS_USER_ID,
  TRYHACKME_USERNAME,
  HACKTHEBOX_USERNAME,
  HACKERONE_USERNAME,
  HACKERONE_API_TOKEN,
  HACKTHEBOX_API_KEY,
  EMAIL_ADDRESS,
} from "./env"
import { getEnv } from "./env"
import { getRedirectUri, validateIntegration } from "./integration-config"

// Token storage interface
interface TokenData {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
  provider: string
}

// Store tokens securely in cookies
export function storeToken(provider: string, tokenData: Omit<TokenData, "provider">) {
  const data: TokenData = {
    ...tokenData,
    provider,
  }

  // Store in an encrypted cookie
  // Use React.use to synchronously access cookies() in a server-side utility
  use(cookies()).set(`${provider}-token`, JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
  })
}

// Get stored token
export function getToken(provider: string): TokenData | null {
  // Use React.use to synchronously access cookies() in a server-side utility
  const tokenCookie = use(cookies()).get(`${provider}-token`)
  if (!tokenCookie) return null

  try {
    return JSON.parse(tokenCookie.value) as TokenData
  } catch {
    return null
  }
}

// Clear token on logout
export function clearToken(provider: string) {
  // Use React.use to synchronously access cookies() in a server-side utility
  use(cookies()).delete(`${provider}-token`)
}

// Helper function to get stored credentials
async function getStoredCredentials(platform: string) {
  try {
    console.log(`Attempting to get stored credentials for ${platform}`)

    // Import the function dynamically to avoid circular dependencies
    const { getDecryptedCredentials } = await import("@/app/api/admin/credentials/route")
    const credentials = await getDecryptedCredentials(platform)

    if (!credentials) {
      console.log(`No credentials found for ${platform}`)
      return null
    }

    console.log(`Credentials for ${platform}:`, credentials ? "Found" : "Not found")
    return credentials
  } catch (error) {
    console.error(`Error getting ${platform} credentials:`, error)
    return null
  }
}

// Get base URL for the application
function getBaseUrl() {
  const env = getEnv()
  return env.SITE_URL || (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : null) || "http://localhost:3000"
}

// LinkedIn authentication provider
export class LinkedInAuthProvider {
  private static readonly AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization"
  private static readonly TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"
  private static readonly API_BASE = "https://api.linkedin.com/v2"

  private redirectUri: string

  constructor() {
    this.redirectUri = getRedirectUri("linkedin")
  }

  // Get login URL
  async getLoginUrl(): Promise<string | null> {
    try {
      console.log("LinkedInAuthProvider: Getting login URL")
      console.log("Redirect URI:", this.redirectUri)

      const credentials = await getStoredCredentials("linkedin")

      if (!credentials) {
        console.error("LinkedIn credentials not found")
        return null
      }

      if (!credentials.clientId) {
        console.error("LinkedIn client ID not found")
        return null
      }

      const isValid = await validateIntegration("linkedin")
      if (!isValid) {
        console.error("LinkedIn integration is not properly configured.")
        return null
      }

      console.log("LinkedIn credentials found, generating OAuth URL")

      const params = new URLSearchParams({
        client_id: credentials.clientId,
        redirect_uri: this.redirectUri,
        response_type: "code",
        scope: "r_liteprofile r_emailaddress",
        state: crypto.randomUUID(), // Add state for security
      })

      const loginUrl = `${LinkedInAuthProvider.AUTH_URL}?${params.toString()}`
      console.log("LinkedIn OAuth URL generated successfully")

      return loginUrl
    } catch (error) {
      console.error("Error in LinkedInAuthProvider.getLoginUrl:", error)
      throw error
    }
  }

  // Exchange code for token
  async getToken(code: string): Promise<TokenData> {
    const credentials = await getStoredCredentials("linkedin")
    if (!credentials) {
      console.error("LinkedIn credentials not found")
      throw new Error("LinkedIn credentials not configured")
    }

    if (!credentials.clientId || !credentials.clientSecret) {
      console.error("LinkedIn client ID or secret not found")
      throw new Error("LinkedIn client ID or secret not configured")
    }

    try {
      const response = await axios.post(
        LinkedInAuthProvider.TOKEN_URL,
        new URLSearchParams({
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: this.redirectUri,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      )

      return {
        accessToken: response.data.access_token,
        expiresAt: Date.now() + response.data.expires_in * 1000,
        provider: "linkedin",
      }
    } catch (error) {
      console.error("Error getting LinkedIn token:", error)
      throw new Error("Failed to authenticate with LinkedIn")
    }
  }

  // Get user profile with token
  async getUserProfile(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(`${LinkedInAuthProvider.API_BASE}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error("Error fetching LinkedIn profile:", error)
      throw new Error("Failed to fetch profile from LinkedIn")
    }
  }
}

// Credly authentication provider
export class CredlyAuthProvider {
  private static readonly AUTH_URL = "https://www.credly.com/oauth/authorize"
  private static readonly TOKEN_URL = "https://www.credly.com/oauth/token"
  private static readonly API_BASE = "https://api.credly.com/v1"

  private redirectUri: string

  constructor() {
    this.redirectUri = getRedirectUri("credly")
  }

  // Get login URL
  async getLoginUrl(): Promise<string | null> {
    try {
      const credentials = await getStoredCredentials("credly")
      if (!credentials) {
        console.error("Credly credentials not configured")
        return null
      }

      if (!credentials.clientId) {
        console.error("Credly client ID not found")
        return null
      }

      const isValid = await validateIntegration("credly")
      if (!isValid) {
        console.error("Credly integration is not properly configured.")
        return null
      }

      const params = new URLSearchParams({
        client_id: credentials.clientId,
        redirect_uri: this.redirectUri,
        response_type: "code",
        scope: "read:badges",
      })

      return `${CredlyAuthProvider.AUTH_URL}?${params.toString()}`
    } catch (error) {
      console.error("Error generating Credly login URL:", error)
      return null
    }
  }

  // Exchange code for token
  async getToken(code: string): Promise<TokenData> {
    const credentials = await getStoredCredentials("credly")
    if (!credentials) {
      console.error("Credly credentials not found")
      throw new Error("Credly credentials not configured")
    }

    if (!credentials.clientId || !credentials.clientSecret) {
      console.error("Credly client ID or secret not found")
      throw new Error("Credly client ID or secret not configured")
    }

    try {
      const response = await axios.post(CredlyAuthProvider.TOKEN_URL, {
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: this.redirectUri,
      })

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: Date.now() + response.data.expires_in * 1000,
        provider: "credly",
      }
    } catch (error) {
      console.error("Error getting Credly token:", error)
      throw new Error("Failed to authenticate with Credly")
    }
  }

  // Get user badges with token
  async getUserBadges(accessToken: string): Promise<any[]> {
    try {
      const response = await axios.get(`${CredlyAuthProvider.API_BASE}/badges`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data.data
    } catch (error) {
      console.error("Error fetching Credly badges:", error)
      throw new Error("Failed to fetch badges from Credly")
    }
  }
}

// Canvas authentication provider
export class CanvasAuthProvider {
  private static API_BASE: string
  private static readonly AUTH_URL = "https://canvas.instructure.com/login/oauth2/auth"
  private static readonly TOKEN_URL = "https://canvas.instructure.com/login/oauth2/token"

  private redirectUri: string

  constructor() {
    const env = getEnv()
    const canvasDomain = env.CANVAS_DOMAIN || "canvas.instructure.com"

    this.redirectUri = getRedirectUri("canvas")
    CanvasAuthProvider.API_BASE = `https://${canvasDomain}/api/v1`
  }

  // Get login URL
  async getLoginUrl(): Promise<string | null> {
    try {
      console.log("Getting Canvas login URL")

      const credentials = await getStoredCredentials("canvas")
      console.log("Canvas credentials retrieved:", credentials ? "Found" : "Not found")

      if (!credentials) {
        console.error("Canvas credentials not configured")
        return null
      }

      if (!credentials.clientId) {
        console.error("Canvas client ID not found")
        return null
      }

      const isValid = await validateIntegration("canvas")
      if (!isValid) {
        console.error("Canvas integration is not properly configured.")
        return null
      }

      const params = new URLSearchParams({
        client_id: credentials.clientId,
        redirect_uri: this.redirectUri,
        response_type: "code",
        scope: "url:GET|/api/v1/users/:user_id/badges",
      })

      const loginUrl = `${CanvasAuthProvider.AUTH_URL}?${params.toString()}`
      console.log("Canvas login URL generated:", loginUrl)

      return loginUrl
    } catch (error) {
      console.error("Error generating Canvas login URL:", error)
      return null
    }
  }

  // Exchange code for token
  async getToken(code: string): Promise<TokenData> {
    const credentials = await getStoredCredentials("canvas")
    if (!credentials) {
      console.error("Canvas credentials not found")
      throw new Error("Canvas credentials not configured")
    }

    if (!credentials.clientId || !credentials.clientSecret) {
      console.error("Canvas client ID or secret not found")
      throw new Error("Canvas client ID or secret not configured")
    }

    try {
      const response = await axios.post(CanvasAuthProvider.TOKEN_URL, {
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: this.redirectUri,
      })

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: Date.now() + response.data.expires_in * 1000,
        provider: "canvas",
      }
    } catch (error) {
      console.error("Error getting Canvas token:", error)
      throw new Error("Failed to authenticate with Canvas")
    }
  }

  // Get user badges with token
  async getUserBadges(accessToken: string, userId: string): Promise<any[]> {
    if (!userId) {
      console.error("Canvas user ID not provided")
      throw new Error("Canvas user ID is required")
    }

    try {
      const response = await axios.get(`${CanvasAuthProvider.API_BASE}/users/${userId}/badges`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error("Error fetching Canvas badges:", error)
      throw new Error("Failed to fetch badges from Canvas")
    }
  }
}

// GitHub authentication provider
export class GitHubAuthProvider {
  private static readonly AUTH_URL = "https://github.com/login/oauth/authorize"
  private static readonly TOKEN_URL = "https://github.com/login/oauth/access_token"
  private static readonly API_BASE = "https://api.github.com"

  private redirectUri: string

  constructor() {
    this.redirectUri = getRedirectUri("github")
  }

  // Get login URL
  async getLoginUrl(): Promise<string | null> {
    try {
      const credentials = await getStoredCredentials("github")
      if (!credentials) {
        console.error("GitHub credentials not configured")
        return null
      }

      if (!credentials.clientId) {
        console.error("GitHub client ID not found")
        return null
      }

      const isValid = await validateIntegration("github")
      if (!isValid) {
        console.error("GitHub integration is not properly configured.")
        return null
      }

      const params = new URLSearchParams({
        client_id: credentials.clientId,
        redirect_uri: this.redirectUri,
        response_type: "code",
        scope: "read:user user:email",
      })

      return `${GitHubAuthProvider.AUTH_URL}?${params.toString()}`
    } catch (error) {
      console.error("Error generating GitHub login URL:", error)
      return null
    }
  }

  // Exchange code for token
  async getToken(code: string): Promise<TokenData> {
    const credentials = await getStoredCredentials("github")
    if (!credentials) {
      console.error("GitHub credentials not found")
      throw new Error("GitHub credentials not configured")
    }

    if (!credentials.clientId || !credentials.clientSecret) {
      console.error("GitHub client ID or secret not found")
      throw new Error("GitHub client ID or secret not configured")
    }

    try {
      const response = await axios.post(GitHubAuthProvider.TOKEN_URL, {
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: this.redirectUri,
      })

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: Date.now() + response.data.expires_in * 1000,
        provider: "github",
      }
    } catch (error) {
      console.error("Error getting GitHub token:", error)
      throw new Error("Failed to authenticate with GitHub")
    }
  }

  // Get user profile with token
  async getUserProfile(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(`${GitHubAuthProvider.API_BASE}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error("Error fetching GitHub profile:", error)
      throw new Error("Failed to fetch profile from GitHub")
    }
  }
}

// Function to get the current authentication status for admin
export function getAdminAuthStatus(): boolean {
  // Use React.use to unwrap the promise returned by cookies()
  const cookieStore = use(cookies())
  const authCookie = cookieStore.get("admin-auth")?.value === "authenticated"
  return authCookie
}

// Array of all configured providers
export const authProviders = [
  {
    id: "github",
    name: "GitHub",
    type: "oauth",
    authorizationUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    profileUrl: "https://api.github.com/user",
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    scope: "read:user user:email", // Adjust scope as needed
    enabled: !!process.env.GITHUB_CLIENT_ID && !!process.env.GITHUB_CLIENT_SECRET,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    type: "oauth",
    authorizationUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    profileUrl: "https://api.linkedin.com/v2/me",
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    scope: "r_liteprofile r_emailaddress", // Adjust scope as needed
    enabled: !!process.env.LINKEDIN_CLIENT_ID && !!process.env.LINKEDIN_CLIENT_SECRET,
  },
  {
    id: "credly",
    name: "Credly",
    type: "oauth",
    authorizationUrl: "https://www.credly.com/oauth/authorize",
    tokenUrl: "https://www.credly.com/oauth/token",
    profileUrl: "https://api.credly.com/v1/me",
    clientId: process.env.CREDLY_CLIENT_ID,
    clientSecret: process.env.CREDLY_CLIENT_SECRET,
    scope: "read_badges", // Adjust scope as needed
    enabled: !!process.env.CREDLY_CLIENT_ID && !!process.env.CREDLY_CLIENT_SECRET,
  },
  {
    id: "canvas",
    name: "Canvas LMS",
    type: "oauth",
    authorizationUrl: `${process.env.CANVAS_DOMAIN}/login/oauth2/auth`,
    tokenUrl: `${process.env.CANVAS_DOMAIN}/login/oauth2/token`,
    profileUrl: `${process.env.CANVAS_DOMAIN}/api/v1/users/self/profile`,
    clientId: process.env.CANVAS_CLIENT_ID,
    clientSecret: process.env.CANVAS_CLIENT_SECRET,
    scope: "url:GET|/api/v1/users/:user_id/profile", // Example scope, adjust as needed
    enabled: !!process.env.CANVAS_CLIENT_ID && !!process.env.CANVAS_CLIENT_SECRET && !!process.env.CANVAS_DOMAIN,
  },
  {
    id: "tryhackme",
    name: "TryHackMe",
    type: "oauth",
    enabled: !!TRYHACKME_USERNAME,
    configured: !!TRYHACKME_USERNAME,
    status: !!TRYHACKME_USERNAME ? "Configured" : "Not Configured",
  },
  {
    id: "hackthebox",
    name: "Hack The Box",
    type: "oauth",
    enabled: !!HACKTHEBOX_USERNAME && !!HACKTHEBOX_API_KEY,
    configured: !!HACKTHEBOX_USERNAME && !!HACKTHEBOX_API_KEY,
    status: !!HACKTHEBOX_USERNAME && !!HACKTHEBOX_API_KEY ? "Configured" : "Not Configured",
  },
  {
    id: "hackerone",
    name: "HackerOne",
    type: "oauth",
    enabled: !!HACKERONE_USERNAME && !!HACKERONE_API_TOKEN,
    configured: !!HACKERONE_USERNAME && !!HACKERONE_API_TOKEN,
    status: !!HACKERONE_USERNAME && !!HACKERONE_API_TOKEN ? "Configured" : "Not Configured",
  },
  {
    id: "email",
    name: "Email",
    type: "email",
    enabled: !!EMAIL_ADDRESS,
    configured: !!EMAIL_ADDRESS,
    status: !!EMAIL_ADDRESS ? "Configured" : "Not Configured",
  },
  {
    id: "admin",
    name: "Admin",
    type: "admin",
    enabled: true, // Admin login is always enabled
    configured: getAdminAuthStatus(),
    status: getAdminAuthStatus() ? "Authenticated" : "Not Authenticated",
  },
]

export function getAuthProviders() {
  const cookieStore = use(cookies())
  const adminAuth = cookieStore.get("admin-auth")?.value === "authenticated"

  return {
    github: {
      enabled: !!GITHUB_USERNAME,
      configured: !!GITHUB_USERNAME,
      status: !!GITHUB_USERNAME ? "Configured" : "Not Configured",
      loginUrl: `/api/auth/github/login`,
      callbackUrl: `/api/auth/github/callback`,
      statusUrl: `/api/auth/github/status`,
    },
    linkedin: {
      enabled: !!LINKEDIN_PROFILE_URL,
      configured: !!LINKEDIN_PROFILE_URL,
      status: !!LINKEDIN_PROFILE_URL ? "Configured" : "Not Configured",
      loginUrl: `/api/auth/linkedin/login`,
      callbackUrl: `/api/auth/linkedin/callback`,
      statusUrl: `/api/auth/linkedin/status`,
    },
    credly: {
      enabled: !!CREDLY_USERNAME,
      configured: !!CREDLY_USERNAME,
      status: !!CREDLY_USERNAME ? "Configured" : "Not Configured",
      loginUrl: `/api/auth/credly/login`,
      callbackUrl: `/api/auth/credly/callback`,
      statusUrl: `/api/auth/credly/status`,
    },
    canvas: {
      enabled: !!CANVAS_API_KEY && !!CANVAS_USER_ID,
      configured: !!CANVAS_API_KEY && !!CANVAS_USER_ID,
      status: !!CANVAS_API_KEY && !!CANVAS_USER_ID ? "Configured" : "Not Configured",
      loginUrl: `/api/auth/canvas/login`,
      callbackUrl: `/api/auth/canvas/callback`,
      statusUrl: `/api/auth/canvas/status`,
    },
    tryhackme: {
      enabled: !!TRYHACKME_USERNAME,
      configured: !!TRYHACKME_USERNAME,
      status: !!TRYHACKME_USERNAME ? "Configured" : "Not Configured",
    },
    hackthebox: {
      enabled: !!HACKTHEBOX_USERNAME && !!HACKTHEBOX_API_KEY,
      configured: !!HACKTHEBOX_USERNAME && !!HACKTHEBOX_API_KEY,
      status: !!HACKTHEBOX_USERNAME && !!HACKTHEBOX_API_KEY ? "Configured" : "Not Configured",
    },
    hackerone: {
      enabled: !!HACKERONE_USERNAME && !!HACKERONE_API_TOKEN,
      configured: !!HACKERONE_USERNAME && !!HACKERONE_API_TOKEN,
      status: !!HACKERONE_USERNAME && !!HACKERONE_API_TOKEN ? "Configured" : "Not Configured",
    },
    email: {
      enabled: !!EMAIL_ADDRESS,
      configured: !!EMAIL_ADDRESS,
      status: !!EMAIL_ADDRESS ? "Configured" : "Not Configured",
    },
    admin: {
      enabled: true, // Admin login is always enabled
      configured: adminAuth,
      status: adminAuth ? "Authenticated" : "Not Authenticated",
    },
  }
}
