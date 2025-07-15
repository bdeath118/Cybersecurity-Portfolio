"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface SiteInfo {
  name?: string
  title?: string
  description?: string
  email?: string
  theme?: {
    primary?: string
    secondary?: string
    accent?: string
    background?: string
    foreground?: string
  }
  background_image?: string
  background_opacity?: number
}

interface CustomThemeContextType {
  siteInfo: SiteInfo | null
  loading: boolean
  error: string | null
}

const CustomThemeContext = createContext<CustomThemeContextType>({
  siteInfo: null,
  loading: true,
  error: null,
})

export function useCustomTheme() {
  return useContext(CustomThemeContext)
}

interface CustomThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
  enableSystem?: boolean
  attribute?: string
  value?: any
  storageKey?: string
  forcedTheme?: string
  disableTransitionOnChange?: boolean
}

export function CustomThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  attribute = "class",
  storageKey = "theme",
  disableTransitionOnChange = false,
  ...props
}: CustomThemeProviderProps) {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()

  // Check if we're on an admin page
  const isAdminPage = pathname?.startsWith("/admin") || false

  useEffect(() => {
    async function fetchSiteInfo() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/site-info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch site info: ${response.status}`)
        }

        const data = await response.json()
        setSiteInfo(data)
      } catch (err) {
        console.error("Error fetching site info:", err)
        setError(err instanceof Error ? err.message : "Unknown error")

        // Use fallback site info
        setSiteInfo({
          name: "Cybersecurity Professional",
          title: "Cybersecurity Portfolio",
          description: "Professional cybersecurity portfolio",
          email: "contact@example.com",
          theme: {
            primary: "#3b82f6",
            secondary: "#1e40af",
            accent: "#06b6d4",
            background: "#ffffff",
            foreground: "#1f2937",
          },
          background_image: "/images/background.jpeg",
          background_opacity: 0.7,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSiteInfo()
  }, [])

  useEffect(() => {
    if (!siteInfo || isAdminPage) return

    // Apply custom theme colors to CSS variables
    const root = document.documentElement

    if (siteInfo.theme) {
      if (siteInfo.theme.primary) {
        root.style.setProperty("--primary", siteInfo.theme.primary)
        root.style.setProperty("--primary-foreground", getContrastColor(siteInfo.theme.primary))
      }

      if (siteInfo.theme.secondary) {
        root.style.setProperty("--secondary", siteInfo.theme.secondary)
        root.style.setProperty("--secondary-foreground", getContrastColor(siteInfo.theme.secondary))
      }

      if (siteInfo.theme.accent) {
        root.style.setProperty("--accent", siteInfo.theme.accent)
        root.style.setProperty("--accent-foreground", getContrastColor(siteInfo.theme.accent))
      }

      if (siteInfo.theme.background) {
        root.style.setProperty("--background", siteInfo.theme.background)
      }

      if (siteInfo.theme.foreground) {
        root.style.setProperty("--foreground", siteInfo.theme.foreground)
      }
    }
  }, [siteInfo, isAdminPage])

  useEffect(() => {
    // Skip background application for admin pages
    if (isAdminPage) {
      // Remove any existing background styles for admin pages
      const existingStyle = document.getElementById("custom-background-style")
      if (existingStyle) {
        existingStyle.remove()
      }
      return
    }

    // Apply background image for non-admin pages
    if (siteInfo?.background_image) {
      // Validate URL to prevent errors
      const isValidUrl = (url: string) => {
        try {
          // Skip blob URLs and placeholder URLs
          if (url.includes("blob:") || url.includes("placeholder") || url.includes("your_")) {
            return false
          }

          // Check if it's a valid URL or relative path
          if (url.startsWith("http") || url.startsWith("/")) {
            return true
          }

          return false
        } catch {
          return false
        }
      }

      if (isValidUrl(siteInfo.background_image)) {
        const opacity = siteInfo.background_opacity !== undefined ? siteInfo.background_opacity : 0.7

        // Create or update style element
        let styleElement = document.getElementById("custom-background-style")
        if (!styleElement) {
          styleElement = document.createElement("style")
          styleElement.id = "custom-background-style"
          document.head.appendChild(styleElement)
        }

        styleElement.textContent = `
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('${siteInfo.background_image}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
            opacity: ${opacity};
            z-index: -1;
            pointer-events: none;
          }
        `
      }
    }

    // Cleanup function
    return () => {
      if (isAdminPage) {
        const styleElement = document.getElementById("custom-background-style")
        if (styleElement) {
          styleElement.remove()
        }
      }
    }
  }, [siteInfo, isAdminPage])

  const contextValue: CustomThemeContextType = {
    siteInfo,
    loading,
    error,
  }

  return (
    <CustomThemeContext.Provider value={contextValue}>
      <NextThemesProvider
        defaultTheme={defaultTheme}
        enableSystem={enableSystem}
        attribute={attribute}
        storageKey={storageKey}
        disableTransitionOnChange={disableTransitionOnChange}
        {...props}
      >
        {children}
      </NextThemesProvider>
    </CustomThemeContext.Provider>
  )
}

// Helper function to determine contrasting text color
function getContrastColor(hexColor: string): string {
  // Remove the hash if it exists
  const color = hexColor.replace("#", "")

  // Parse the color
  const r = Number.parseInt(color.substr(0, 2), 16)
  const g = Number.parseInt(color.substr(2, 2), 16)
  const b = Number.parseInt(color.substr(4, 2), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return black or white based on luminance
  return luminance > 0.5 ? "#000000" : "#ffffff"
}

// Export the provider as default for backward compatibility
export default CustomThemeProvider
