import { HeroSection } from "@/components/hero-section"
import { ProjectsShowcase } from "@/components/projects-showcase"
import { SkillsSection } from "@/components/skills-section"
import { CertificationsSection } from "@/components/certifications-section"
import { CTFSection } from "@/components/ctf-section"
import { DigitalBadgesSection } from "@/components/digital-badges-section"
import { getSiteInfo, getProjects, getSkills, getCertifications, getCTFEvents, getDigitalBadges } from "@/lib/data"
import { initializeApplication } from "@/lib/init"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteInfo = await getSiteInfo()

    return {
      title: `${siteInfo.name} - ${siteInfo.title}`,
      description: siteInfo.description,
      keywords: ["cybersecurity", "portfolio", "ethical hacking", "security", "penetration testing"],
      authors: [{ name: siteInfo.name }],
      creator: siteInfo.name,
      openGraph: {
        title: `${siteInfo.name} - ${siteInfo.title}`,
        description: siteInfo.description,
        url: siteInfo.siteUrl,
        siteName: siteInfo.name,
        type: "website",
        images: [
          {
            url: siteInfo.backgroundImage || "/images/background.jpeg",
            width: 1200,
            height: 630,
            alt: `${siteInfo.name} - Cybersecurity Portfolio`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${siteInfo.name} - ${siteInfo.title}`,
        description: siteInfo.description,
        images: [siteInfo.backgroundImage || "/images/background.jpeg"],
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Cybersecurity Portfolio",
      description: "Professional cybersecurity portfolio showcasing skills, projects, and achievements.",
    }
  }
}

export default async function HomePage() {
  try {
    // Initialize the application
    await initializeApplication()

    // Fetch all data
    const [siteInfo, projects, skills, certifications, ctfEvents, digitalBadges] = await Promise.all([
      getSiteInfo(),
      getProjects(),
      getSkills(),
      getCertifications(),
      getCTFEvents(),
      getDigitalBadges(),
    ])

    return (
      <div className="min-h-screen">
        <HeroSection siteInfo={siteInfo} digitalBadges={digitalBadges} />
        <ProjectsShowcase projects={projects.slice(0, 3)} />
        <SkillsSection skills={skills} />
        <CertificationsSection certifications={certifications.slice(0, 6)} />
        <CTFSection events={ctfEvents.slice(0, 3)} />
        <DigitalBadgesSection badges={digitalBadges} />
      </div>
    )
  } catch (error) {
    console.error("Error loading homepage:", error)

    // Fallback content if data loading fails
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Cybersecurity Portfolio</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Welcome to my cybersecurity portfolio. The site is initializing...
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }
}
