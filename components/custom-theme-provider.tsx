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
        const response = await fetch("/api/site-info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setSiteInfo(data)
      } catch (error) {
        console.error("Error fetching site info:", error)
        // Use fallback site info
        setSiteInfo({
          id: "fallback",
          name: "Cybersecurity Professional",
          title: "Cybersecurity Specialist",
          description: "Passionate about cybersecurity and ethical hacking.",
          email: "contact@example.com",
          backgroundOpacity: 0.7,
          theme: {
            primaryColor: "#3b82f6",
            secondaryColor: "#1e40af",
            backgroundColor: "#ffffff",
            textColor: "#000000",
          },
        })
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

      if (siteInfo.theme.primaryColor) {
        root.style.setProperty("--primary", siteInfo.theme.primaryColor)
        root.style.setProperty("--primary-foreground", getContrastColor(siteInfo.theme.primaryColor))
      }

      if (siteInfo.theme.secondaryColor) {
        root.style.setProperty("--secondary", siteInfo.theme.secondaryColor)
        root.style.setProperty("--secondary-foreground", getContrastColor(siteInfo.theme.secondaryColor))
      }

      if (siteInfo.theme.backgroundColor) {
        root.style.setProperty("--background", siteInfo.theme.backgroundColor)
      }

      if (siteInfo.theme.textColor) {
        root.style.setProperty("--foreground", siteInfo.theme.textColor)
      }
    }

    // COMPLETELY SKIP background image application on admin pages
    const isAdminPage = typeof window !== "undefined" && window.location.pathname.includes("/admin")

    if (isAdminPage) {
      // Remove any existing background styles on admin pages
      const existingStyles = document.getElementById("custom-background-styles")
      if (existingStyles) {
        existingStyles.remove()
      }
      return // Exit early for admin pages
    }

    // Apply background image ONLY on non-admin pages
    if (siteInfo?.backgroundImage) {
      const opacity = siteInfo.backgroundOpacity !== undefined ? siteInfo.backgroundOpacity / 100 : 0.8

      // Create and apply the background image styles
      const backgroundStyles = document.createElement("style")
      backgroundStyles.id = "custom-background-styles"

      // Remove any existing background styles
      const existingStyles = document.getElementById("custom-background-styles")
      if (existingStyles) {
        existingStyles.remove()
      }

      // Only apply background if the image URL is valid and not a blob URL
      try {
        if (!siteInfo.backgroundImage.startsWith("blob:")) {
          const imageUrl = siteInfo.backgroundImage.startsWith("http")
            ? siteInfo.backgroundImage
            : new URL(siteInfo.backgroundImage, window.location.origin).href

          backgroundStyles.innerHTML = `
            body::before {
              content: '';
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: url('${imageUrl}');
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
              background-attachment: fixed;
              opacity: ${opacity};
              z-index: -1;
              pointer-events: none;
            }
          `
          document.head.appendChild(backgroundStyles)
        }
      } catch (error) {
        console.warn("Invalid background image URL:", siteInfo.backgroundImage)
      }
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
