import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CustomThemeProvider } from "@/components/custom-theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cybersecurity Portfolio",
  description:
    "Professional cybersecurity portfolio showcasing skills, projects, and achievements in ethical hacking and security consulting.",
  keywords: ["cybersecurity", "ethical hacking", "penetration testing", "security consulting", "portfolio"],
  authors: [{ name: "Cybersecurity Professional" }],
  creator: "Cybersecurity Professional",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.SITE_URL || "https://cybersecurity-portfolio.vercel.app",
    title: "Cybersecurity Portfolio",
    description: "Professional cybersecurity portfolio showcasing skills, projects, and achievements",
    siteName: "Cybersecurity Portfolio",
    images: [
      {
        url: "/images/background.jpeg",
        width: 1200,
        height: 630,
        alt: "Cybersecurity Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cybersecurity Portfolio",
    description: "Professional cybersecurity portfolio showcasing skills, projects, and achievements",
    images: ["/images/background.jpeg"],
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
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CustomThemeProvider>
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
