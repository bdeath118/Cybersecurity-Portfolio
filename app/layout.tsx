import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CustomThemeProvider } from "@/components/custom-theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { getSiteInfo } from "@/lib/data"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteInfo = await getSiteInfo()

    return {
      title: {
        default: siteInfo.title || "Cybersecurity Portfolio",
        template: `%s | ${siteInfo.name || "Cybersecurity Professional"}`,
      },
      description:
        siteInfo.description || "Professional cybersecurity portfolio showcasing skills, projects, and achievements",
      keywords: [
        "cybersecurity",
        "ethical hacking",
        "penetration testing",
        "security consultant",
        "vulnerability assessment",
        "network security",
        "web application security",
        siteInfo.name || "cybersecurity professional",
      ],
      authors: [{ name: siteInfo.name || "Cybersecurity Professional" }],
      creator: siteInfo.name || "Cybersecurity Professional",
      publisher: siteInfo.name || "Cybersecurity Professional",
      metadataBase: new URL(siteInfo.site_url || process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000"),
      alternates: {
        canonical: "/",
      },
      openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        title: siteInfo.title || "Cybersecurity Portfolio",
        description: siteInfo.description || "Professional cybersecurity portfolio",
        siteName: siteInfo.name || "Cybersecurity Professional",
        images: [
          {
            url: "/images/background.jpeg",
            width: 1200,
            height: 630,
            alt: `${siteInfo.name || "Cybersecurity Professional"} - Portfolio`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: siteInfo.title || "Cybersecurity Portfolio",
        description: siteInfo.description || "Professional cybersecurity portfolio",
        images: ["/images/background.jpeg"],
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
    }
  } catch (error) {
    console.error("Error generating metadata:", error)

    // Fallback metadata
    return {
      title: "Cybersecurity Portfolio",
      description: "Professional cybersecurity portfolio showcasing skills, projects, and achievements",
      keywords: ["cybersecurity", "ethical hacking", "penetration testing", "security"],
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
      <body className={inter.className}>
        <CustomThemeProvider defaultTheme="system" enableSystem attribute="class" storageKey="theme">
          {children}
          <Toaster />
        </CustomThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
