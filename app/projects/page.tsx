import type { Metadata } from "next"
import { ProjectsShowcase } from "@/components/projects-showcase"
import { getProjects, getSiteInfo } from "@/lib/data"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteInfo = await getSiteInfo()
    const projects = await getProjects()

    return {
      title: "Projects",
      description: `Explore ${siteInfo.name}'s cybersecurity projects and security research work. ${projects.length} projects showcasing expertise in penetration testing, security tools, and vulnerability research.`,
      keywords: [
        "cybersecurity projects",
        "security research",
        "penetration testing",
        "vulnerability assessment",
        "security tools",
      ],
      openGraph: {
        title: `Projects | ${siteInfo.name}`,
        description: `Explore cybersecurity projects and security research work by ${siteInfo.name}`,
        type: "website",
        images: [
          {
            url: siteInfo.backgroundImage || "/images/background.jpeg",
            width: 1200,
            height: 630,
            alt: "Cybersecurity Projects Portfolio",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `Projects | ${siteInfo.name}`,
        description: `Explore cybersecurity projects and security research work`,
        images: [siteInfo.backgroundImage || "/images/background.jpeg"],
      },
      alternates: {
        canonical: "/projects",
      },
    }
  } catch (error) {
    console.error("Error generating projects metadata:", error)
    return {
      title: "Projects",
      description: "Explore cybersecurity projects and security research work",
      keywords: ["cybersecurity projects", "security research", "penetration testing"],
    }
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Projects</h1>
        <p className="text-lg text-muted-foreground">
          Explore my cybersecurity projects, security research, and development work.
        </p>
      </div>
      <ProjectsShowcase projects={projects} />
    </div>
  )
}
