"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider } from "next-themes"
import { getSiteInfo, type SiteInfo } from "@/lib/data"

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

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSiteInfo()
      .then((data) => {
        setSiteInfo(data)

        // Apply custom CSS variables if theme color is set
        if (data.theme_color) {
          document.documentElement.style.setProperty("--primary", data.theme_color)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <CustomThemeContext.Provider value={{ siteInfo, loading }}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </CustomThemeContext.Provider>
  )
}
