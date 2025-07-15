"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider } from "next-themes"
import { getSiteInfo, type SiteInfo } from "@/lib/data"

interface CustomThemeContextType {
  siteInfo: SiteInfo | null
  loading: boolean
  refreshSiteInfo: () => Promise<void>
}

const CustomThemeContext = createContext<CustomThemeContextType>({
  siteInfo: null,
  loading: true,
  refreshSiteInfo: async () => {},
})

export function useCustomTheme() {
  const context = useContext(CustomThemeContext)
  if (!context) {
    throw new Error("useCustomTheme must be used within a CustomThemeProvider")
  }
  return context
}

interface CustomThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
  enableSystem?: boolean
  attribute?: string
  storageKey?: string
}

export function CustomThemeProvider({
  children,
  defaultTheme = "dark",
  enableSystem = true,
  attribute = "class",
  storageKey = "theme",
}: CustomThemeProviderProps) {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshSiteInfo = async () => {
    try {
      setLoading(true)
      const info = await getSiteInfo()
      setSiteInfo(info)

      // Apply custom CSS variables if theme color is set
      if (info.theme_color) {
        document.documentElement.style.setProperty("--primary", info.theme_color)
        document.documentElement.style.setProperty("--primary-foreground", getContrastColor(info.theme_color))
      }
    } catch (error) {
      console.error("Failed to fetch site info:", error)
      // Set fallback site info
      setSiteInfo({
        name: "Alex Johnson",
        title: "Cybersecurity Professional & Ethical Hacker",
        description:
          "Professional cybersecurity portfolio showcasing digital shield protection and ethical hacking expertise",
        email: "alex.johnson@cybersec.dev",
        site_url: "https://cybersecurity-portfolio.vercel.app",
        avatar_url: "/images/avatar-photo.jpg",
        background_url: "/images/background.jpeg",
        theme_color: "#0ea5e9",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshSiteInfo()
  }, [])

  return (
    <CustomThemeContext.Provider
      value={{
        siteInfo,
        loading,
        refreshSiteInfo,
      }}
    >
      <ThemeProvider
        defaultTheme={defaultTheme}
        enableSystem={enableSystem}
        attribute={attribute}
        storageKey={storageKey}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
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
