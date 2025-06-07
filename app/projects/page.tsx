import { getProjects } from "@/lib/data"

export async function generateMetadata() {
  return {
    title: "Projects | Cyber Security Portfolio",
    description: "Browse my cybersecurity projects and research",
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>
      {/* Projects content */}
    </div>
  )
}
