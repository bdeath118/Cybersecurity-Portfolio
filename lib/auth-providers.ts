import { cookies } from "next/headers"
import axios from "axios"

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
    const { getDecryptedCredentials } = await import("@/app/api/admin/credentials/route")
    return await getDecryptedCredentials(platform)
  } catch (error) {
    console.error(`Error getting ${platform} credentials:`, error)
    return null
  }
}

// Credly authentication provider
export class CredlyAuthProvider {
  private static readonly AUTH_URL = "https://www.credly.com/oauth/authorize"
  private static readonly TOKEN_URL = "https://www.credly.com/oauth/token"
  private static readonly API_BASE = "https://api.credly.com/v1"

  private redirectUri =
    `${process.env.SITE_URL || "https://cybersecurity-portfolio-bdeath118.vercel.app"}/api/auth/credly/callback`

  // Get login URL
  async getLoginUrl(): Promise<string | null> {
    const credentials = await getStoredCredentials("credly")
    if (!credentials) return null

    const params = new URLSearchParams({
      client_id: credentials.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: "read:badges",
    })

    return `${CredlyAuthProvider.AUTH_URL}?${params.toString()}`
  }

  // Exchange code for token
  async getToken(code: string): Promise<TokenData> {
    const credentials = await getStoredCredentials("credly")
    if (!credentials) {
      throw new Error("Credly credentials not configured")
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

  // Refresh token
  async refreshToken(refreshToken: string): Promise<TokenData> {
    const credentials = await getStoredCredentials("credly")
    if (!credentials) {
      throw new Error("Credly credentials not configured")
    }

    try {
      const response = await axios.post(CredlyAuthProvider.TOKEN_URL, {
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      })

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: Date.now() + response.data.expires_in * 1000,
        provider: "credly",
      }
    } catch (error) {
      console.error("Error refreshing Credly token:", error)
      throw new Error("Failed to refresh Credly token")
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
  private static readonly AUTH_URL = "https://canvas.instructure.com/login/oauth2/auth"
  private static readonly TOKEN_URL = "https://canvas.instructure.com/login/oauth2/token"
  private static readonly API_BASE = "https://canvas.instructure.com/api/v1"

  private redirectUri =
    `${process.env.SITE_URL || "https://cybersecurity-portfolio-bdeath118.vercel.app"}/api/auth/canvas/callback`

  // Get login URL
  async getLoginUrl(): Promise<string | null> {
    const credentials = await getStoredCredentials("canvas")
    if (!credentials) return null

    const params = new URLSearchParams({
      client_id: credentials.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: "url:GET|/api/v1/users/:user_id/badges",
    })

    return `${CanvasAuthProvider.AUTH_URL}?${params.toString()}`
  }

  // Exchange code for token
  async getToken(code: string): Promise<TokenData> {
    const credentials = await getStoredCredentials("canvas")
    if (!credentials) {
      throw new Error("Canvas credentials not configured")
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

  // Refresh token
  async refreshToken(refreshToken: string): Promise<TokenData> {
    const credentials = await getStoredCredentials("canvas")
    if (!credentials) {
      throw new Error("Canvas credentials not configured")
    }

    try {
      const response = await axios.post(CanvasAuthProvider.TOKEN_URL, {
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      })

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: Date.now() + response.data.expires_in * 1000,
        provider: "canvas",
      }
    } catch (error) {
      console.error("Error refreshing Canvas token:", error)
      throw new Error("Failed to refresh Canvas token")
    }
  }

  // Get user badges with token
  async getUserBadges(accessToken: string, userId: string): Promise<any[]> {
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

// LinkedIn authentication provider
export class LinkedInAuthProvider {
  private static readonly AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization"
  private static readonly TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"
  private static readonly API_BASE = "https://api.linkedin.com/v2"

  private redirectUri =
    `${process.env.SITE_URL || "https://cybersecurity-portfolio-bdeath118.vercel.app"}/api/auth/linkedin/callback`

  // Get login URL
  async getLoginUrl(): Promise<string | null> {
    const credentials = await getStoredCredentials("linkedin")
    if (!credentials) return null

    const params = new URLSearchParams({
      client_id: credentials.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: "r_liteprofile r_emailaddress r_basicprofile",
    })

    return `${LinkedInAuthProvider.AUTH_URL}?${params.toString()}`
  }

  // Exchange code for token
  async getToken(code: string): Promise<TokenData> {
    const credentials = await getStoredCredentials("linkedin")
    if (!credentials) {
      throw new Error("LinkedIn credentials not configured")
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
