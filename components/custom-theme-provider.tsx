"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { SiteInfo } from "@/lib/types"

interface CustomThemeContextType {
  siteInfo: SiteInfo | null
  loading: boolean
}

const CustomThemeContext = createContext<CustomThemeContextType>({
  siteInfo: null,
  loading: true,
})

export function useCustomTheme() {
  return useContext(CustomThemeContext)
}

export function CustomThemeProvider({
  children,
  defaultTheme = "system",
  ...props
}: {
  children: React.ReactNode
  defaultTheme?: string
}) {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSiteInfo() {
      try {
        const response = await fetch("/api/site-info")
        const data = await response.json()
        setSiteInfo(data)
      } catch (error) {
        console.error("Error fetching site info:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSiteInfo()
  }, [])

  useEffect(() => {
    if (siteInfo?.theme) {
      // Apply custom theme colors to CSS variables
      const root = document.documentElement

      root.style.setProperty("--primary", siteInfo.theme.primaryColor)
      root.style.setProperty("--primary-foreground", getContrastColor(siteInfo.theme.primaryColor))

      root.style.setProperty("--secondary", siteInfo.theme.secondaryColor)
      root.style.setProperty("--secondary-foreground", getContrastColor(siteInfo.theme.secondaryColor))

      root.style.setProperty("--background", siteInfo.theme.backgroundColor)
      root.style.setProperty("--foreground", siteInfo.theme.textColor)
    }

    // Apply background image if available
    if (siteInfo?.backgroundImage) {
      const opacity = siteInfo.backgroundOpacity !== undefined ? siteInfo.backgroundOpacity / 100 : 1

      // Create and apply the background image styles
      const backgroundStyles = document.createElement("style")
      backgroundStyles.id = "custom-background-styles"

      // Remove any existing background styles
      const existingStyles = document.getElementById("custom-background-styles")
      if (existingStyles) {
        existingStyles.remove()
      }

      backgroundStyles.innerHTML = `
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('${siteInfo.backgroundImage}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: ${opacity};
          z-index: -1;
          pointer-events: none;
        }
      `

      document.head.appendChild(backgroundStyles)
    }
  }, [siteInfo])

  return (
    <CustomThemeContext.Provider value={{ siteInfo, loading }}>
      <NextThemesProvider defaultTheme={defaultTheme} enableSystem {...props}>
        {children}
      </NextThemesProvider>
    </CustomThemeContext.Provider>
  )
}

// Helper function to determine contrasting text color
function getContrastColor(hexColor: string): string {
  // Remove the hash if it exists
  hexColor = hexColor.replace("#", "")

  // Parse the color
  const r = Number.parseInt(hexColor.substr(0, 2), 16)
  const g = Number.parseInt(hexColor.substr(2, 2), 16)
  const b = Number.parseInt(hexColor.substr(4, 2), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return black or white based on luminance
  return luminance > 0.5 ? "#000000" : "#ffffff"
}

