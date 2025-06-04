import { cookies } from "next/headers"
import axios from "axios"
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
  cookies().set(`${provider}-token`, JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
  })
}

// Get stored token
export function getToken(provider: string): TokenData | null {
  const tokenCookie = cookies().get(`${provider}-token`)
  if (!tokenCookie) return null

  try {
    return JSON.parse(tokenCookie.value) as TokenData
  } catch {
    return null
  }
}

// Clear token on logout
export function clearToken(provider: string) {
  cookies().delete(`${provider}-token`)
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
