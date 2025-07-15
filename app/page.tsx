import { Suspense } from "react"
import { HeroSection } from "@/components/hero-section"
import { SkillsSection } from "@/components/skills-section"
import { ProjectsShowcase } from "@/components/projects-showcase"
import { CertificationsSection } from "@/components/certifications-section"
import { CTFSection } from "@/components/ctf-section"
import { DigitalBadgesSection } from "@/components/digital-badges-section"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { getSiteInfo, getPortfolioStats } from "@/lib/data"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [siteInfo, stats] = await Promise.all([getSiteInfo(), getPortfolioStats()])

    const description = `${siteInfo.description} • Featuring ${stats.projectsCount} security projects, ${stats.certificationsCount} professional certifications, and ${stats.ctfEventsCount} CTF achievements.`

    return {
      title: siteInfo.title || "Cybersecurity Portfolio",
      description,
      openGraph: {
        title: siteInfo.title || "Cybersecurity Portfolio",
        description,
        images: [
          {
            url: siteInfo.background_url || "/images/background.jpeg",
            width: 1200,
            height: 630,
            alt: "Cybersecurity Portfolio - Professional Background",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: siteInfo.title || "Cybersecurity Portfolio",
        description,
        images: [siteInfo.background_url || "/images/background.jpeg"],
      },
    }
  } catch (error) {
    console.error("Error generating page metadata:", error)
    return {
      title: "Cybersecurity Portfolio",
      description: "Professional cybersecurity portfolio showcasing skills, projects, and achievements",
    }
  }
}

function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center space-y-4">
        <div className="h-12 bg-muted rounded w-96 mx-auto"></div>
        <div className="h-6 bg-muted rounded w-64 mx-auto"></div>
        <div className="h-4 bg-muted rounded w-80 mx-auto"></div>
      </div>
    </section>
  )
}

function LoadingSection({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <LoadingSpinner />
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* Skills Section */}
      <Suspense fallback={<LoadingSection />}>
        <SkillsSection />
      </Suspense>

      {/* Featured Projects */}
      <Suspense fallback={<LoadingSection />}>
        <ProjectsShowcase />
      </Suspense>

      {/* Certifications */}
      <Suspense fallback={<LoadingSection />}>
        <CertificationsSection />
      </Suspense>

      {/* CTF Events */}
      <Suspense fallback={<LoadingSection />}>
        <CTFSection />
      </Suspense>

      {/* Digital Badges */}
      <Suspense fallback={<LoadingSection />}>
        <DigitalBadgesSection />
      </Suspense>
    </div>
  )
}
