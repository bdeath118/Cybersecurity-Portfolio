import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { CustomThemeProvider } from "@/components/custom-theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getSiteInfo } from "@/lib/data"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata() {
  try {
    const siteInfo = await getSiteInfo();

    return {
      title: siteInfo.name ? `${siteInfo.name} | Cyber Security Portfolio` : "Cyber Security Portfolio",
      description:
        siteInfo.description || "A portfolio showcasing cybersecurity projects, skills, certifications, and CTF events",
      generator: "Next.js",
      icons: {
        icon: siteInfo.icon || "/favicon.ico",
      },
      openGraph: {
        title: siteInfo.name ? `${siteInfo.name} | Cyber Security Portfolio` : "Cyber Security Portfolio",
        description:
          siteInfo.description ||
          "A portfolio showcasing cybersecurity projects, skills, certifications, and CTF events",
        type: "website",
        images: [
          {
            url: siteInfo.backgroundImage || "/images/background.jpeg",
            width: 1200,
            height: 630,
            alt: "Cybersecurity Portfolio",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: siteInfo.name ? `${siteInfo.name} | Cyber Security Portfolio` : "Cyber Security Portfolio",
        description:
          siteInfo.description ||
          "A portfolio showcasing cybersecurity projects, skills, certifications, and CTF events",
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error);

    return {
      title: "Cyber Security Portfolio",
      description: "A portfolio showcasing cybersecurity projects, skills, certifications, and CTF events",
      generator: "Next.js",
      icons: {
        icon: "/favicon.ico",
      },
    }
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
