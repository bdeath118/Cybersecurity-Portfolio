import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import { cn } from "@/lib/utils"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CustomThemeProvider } from "@/components/custom-theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar" // Import SidebarProvider
import { getSiteInfo } from "@/lib/data" // Import getSiteInfo for metadata

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteInfo()
  return {
    title: {
      default: siteInfo.seo_title,
      template: `%s | ${siteInfo.site_name}`,
    },
    description: siteInfo.seo_description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    openGraph: {
      title: siteInfo.seo_title,
      description: siteInfo.seo_description,
      url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      siteName: siteInfo.site_name,
      images: [
        {
          url: siteInfo.social_image_url || "/placeholder.svg?height=630&width=1200",
          width: 1200,
          height: 630,
          alt: siteInfo.seo_title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteInfo.seo_title,
      description: siteInfo.seo_description,
      images: [siteInfo.social_image_url || "/placeholder.svg?height=630&width=1200"],
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    // Add other metadata as needed
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <CustomThemeProvider
          attribute="class"
          defaultTheme="dark" // Default to dark theme for cybersecurity aesthetic
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </SidebarProvider>
          <Toaster />
        </CustomThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
