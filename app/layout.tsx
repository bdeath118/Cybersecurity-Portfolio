import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CustomThemeProvider } from "@/components/custom-theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { getSiteInfo, getPortfolioStats } from "@/lib/data"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [siteInfo, stats] = await Promise.all([getSiteInfo(), getPortfolioStats()])

    const baseUrl =
      siteInfo.site_url || process.env.NEXT_PUBLIC_SITE_URL || "https://cybersecurity-portfolio.vercel.app"

    return {
      title: {
        default: siteInfo.title || "Cybersecurity Portfolio - Digital Shield Protection",
        template: `%s | ${siteInfo.name || "Alex Johnson"}`,
      },
      description:
        siteInfo.description ||
        "Professional cybersecurity portfolio showcasing digital shield protection, ethical hacking expertise, penetration testing skills, and security consulting services.",
      keywords: [
        "cybersecurity",
        "digital shield protection",
        "ethical hacking",
        "penetration testing",
        "security consultant",
        "vulnerability assessment",
        "network security",
        "web application security",
        "digital forensics",
        "incident response",
        "OSCP",
        "CEH",
        "CISSP",
        "bug bounty",
        "CTF",
        "threat intelligence",
        siteInfo.name?.toLowerCase() || "alex johnson",
      ],
      authors: [{ name: siteInfo.name || "Alex Johnson" }],
      creator: siteInfo.name || "Alex Johnson",
      publisher: siteInfo.name || "Alex Johnson",
      metadataBase: new URL(baseUrl),
      alternates: {
        canonical: "/",
      },
      openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        title: siteInfo.title || "Cybersecurity Portfolio - Digital Shield Protection",
        description: `${siteInfo.description} • ${stats.projectsCount} Security Projects • ${stats.certificationsCount} Professional Certifications • ${stats.ctfEventsCount} CTF Achievements`,
        siteName: siteInfo.name || "Alex Johnson - Cybersecurity Professional",
        images: [
          {
            url: siteInfo.background_url || "/images/background.jpeg",
            width: 1200,
            height: 630,
            alt: `${siteInfo.name || "Alex Johnson"} - Cybersecurity Portfolio Background with Digital Shield Protection`,
          },
          {
            url: siteInfo.avatar_url || "/images/avatar-photo.jpg",
            width: 400,
            height: 400,
            alt: `${siteInfo.name || "Alex Johnson"} - Professional Cybersecurity Expert Profile Photo`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: siteInfo.title || "Cybersecurity Portfolio - Digital Shield Protection",
        description: `${siteInfo.description} • ${stats.projectsCount} Projects • ${stats.certificationsCount} Certifications • Expert in Digital Shield Protection`,
        images: [siteInfo.background_url || "/images/background.jpeg"],
        creator: siteInfo.twitter ? `@${siteInfo.twitter.split("/").pop()}` : undefined,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      },
      other: {
        "theme-color": siteInfo.theme_color || "#0ea5e9",
        "color-scheme": "dark light",
        "msapplication-TileColor": siteInfo.theme_color || "#0ea5e9",
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)

    // Fallback metadata
    return {
      title: "Cybersecurity Portfolio - Digital Shield Protection",
      description:
        "Professional cybersecurity portfolio showcasing digital shield protection, ethical hacking expertise, penetration testing skills, and security consulting services.",
      keywords: [
        "cybersecurity",
        "digital shield protection",
        "ethical hacking",
        "penetration testing",
        "security",
        "OSCP",
        "CEH",
      ],
      metadataBase: new URL("https://cybersecurity-portfolio.vercel.app"),
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/avatar-photo.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <CustomThemeProvider defaultTheme="dark" enableSystem attribute="class" storageKey="theme">
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
        </CustomThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
