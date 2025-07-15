import { Suspense } from "react"
import { HeroSection } from "@/components/hero-section"
import { SkillsSection } from "@/components/skills-section"
import { ProjectsShowcase } from "@/components/projects-showcase"
import { CertificationsSection } from "@/components/certifications-section"
import { CTFSection } from "@/components/ctf-section"
import { DigitalBadgesSection } from "@/components/digital-badges-section"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getSiteInfo, getProjects, getSkills, getCertifications, getCTFEvents, getDigitalBadges } from "@/lib/data"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [siteInfo, projects, skills, certifications, ctfEvents, digitalBadges] = await Promise.all([
      getSiteInfo(),
      getProjects(),
      getSkills(),
      getCertifications(),
      getCTFEvents(),
      getDigitalBadges(),
    ])

    const projectCount = projects.length
    const skillCount = skills.length
    const certCount = certifications.length

    return {
      title: `${siteInfo.name} - ${siteInfo.title}`,
      description: `${siteInfo.description} Featuring ${projectCount} projects, ${skillCount} skills, and ${certCount} certifications.`,
      keywords: [
        "cybersecurity portfolio",
        "ethical hacking",
        "penetration testing",
        "security projects",
        "CTF competitions",
        "security certifications",
        siteInfo.name.toLowerCase().replace(" ", "-"),
        ...skills.slice(0, 5).map((skill) => skill.name.toLowerCase()),
      ],
      openGraph: {
        title: `${siteInfo.name} - Cybersecurity Portfolio`,
        description: `Professional cybersecurity portfolio with ${projectCount} projects and ${certCount} certifications`,
        type: "website",
        images: [
          {
            url: "/images/background.jpeg",
            width: 1200,
            height: 630,
            alt: `${siteInfo.name} - Cybersecurity Portfolio`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${siteInfo.name} - Cybersecurity Portfolio`,
        description: `Professional cybersecurity portfolio with ${projectCount} projects and ${certCount} certifications`,
      },
    }
  } catch (error) {
    console.error("Error generating homepage metadata:", error)
    return {
      title: "Cybersecurity Portfolio",
      description: "Professional cybersecurity portfolio showcasing projects, skills, and achievements",
    }
  }
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="animate-pulse">
        <div className="h-96 bg-muted rounded-lg mb-8"></div>
        <div className="space-y-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function HomePage() {
  try {
    const [siteInfo, projects, skills, certifications, ctfEvents, digitalBadges] = await Promise.all([
      getSiteInfo(),
      getProjects(),
      getSkills(),
      getCertifications(),
      getCTFEvents(),
      getDigitalBadges(),
    ])

    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8 space-y-16">
          <Suspense fallback={<LoadingSkeleton />}>
            <HeroSection siteInfo={siteInfo} />
            <SkillsSection skills={skills} />
            <ProjectsShowcase projects={projects.slice(0, 6)} />
            <CertificationsSection certifications={certifications} />
            <CTFSection ctfEvents={ctfEvents.slice(0, 4)} />
            <DigitalBadgesSection badges={digitalBadges.slice(0, 6)} />
          </Suspense>
        </main>
        <SiteFooter />
      </div>
    )
  } catch (error) {
    console.error("Error loading homepage:", error)

    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold mb-4">Cybersecurity Portfolio</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Professional cybersecurity portfolio showcasing skills and projects
            </p>
            <div className="text-sm text-muted-foreground">Loading content...</div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }
}
