import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { CustomThemeProvider } from "@/components/custom-theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata() {
  return {
    title: "Cyber Security Portfolio",
    description: "A portfolio showcasing cybersecurity projects, skills, certifications, and CTF events",
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: "Cyber Security Portfolio",
      description: "A portfolio showcasing cybersecurity projects, skills, certifications, and CTF events",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Cyber Security Portfolio",
      description: "A portfolio showcasing cybersecurity projects, skills, certifications, and CTF events",
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CustomThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </CustomThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
