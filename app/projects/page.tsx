import { ProjectsShowcase } from "@/components/projects-showcase"
import { getProjects, getSiteInfo } from "@/lib/data"

export async function generateMetadata() {
  try {
    const siteInfo = await getSiteInfo()
    return {
      title: `Projects | ${siteInfo.name || "Cyber Security Portfolio"}`,
      description: "Explore my cybersecurity projects, tools, and security research work.",
      openGraph: {
        title: "Cybersecurity Projects",
        description: "Explore my cybersecurity projects, tools, and security research work.",
      },
    }
  } catch {
    return {
      title: "Projects | Cyber Security Portfolio",
      description: "Explore cybersecurity projects and security research work.",
    }
  }
}

export default async function ProjectsPage() {
  try {
    const projects = await getProjects()

    return (
      <div className="container py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Projects</h1>
          <p className="text-lg text-muted-foreground mb-8">
            A collection of my cybersecurity projects, tools, and research work.
          </p>
          <ProjectsShowcase projects={projects} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading projects:", error)
    return (
      <div className="container py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Projects</h1>
          <p className="text-muted-foreground">Unable to load projects at this time.</p>
        </div>
      </div>
    )
  }
}
