import { ProjectsShowcase } from "@/components/projects-showcase"
import { getProjects } from "@/lib/data"

export async function generateMetadata() {
  return {
    title: "Projects | Cyber Security Portfolio",
    description: "Explore my cybersecurity projects and security research work",
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <ProjectsShowcase projects={projects} />
    </div>
  )
}
