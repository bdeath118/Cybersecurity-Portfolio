import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"
import { getProjectById, getProjects } from "@/lib/data"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id)

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: `${project.title} | Cyber Security Portfolio`,
    description: project.summary,
  }
}

export async function generateStaticParams() {
  const projects = await getProjects()

  return projects.map((project) => ({
    id: project.id,
  }))
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="container py-12 md:py-24 px-4 md:px-6">
      <Link
        href="/projects"
        className="inline-flex items-center mb-8 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={project.image || "/placeholder.svg?height=400&width=800"}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{project.title}</h1>
            <p className="mt-2 text-muted-foreground">{project.date}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            {project.demoUrl && (
              <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </Button>
              </Link>
            )}

            {project.githubUrl && (
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <Github className="h-4 w-4" />
                  View Code
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold">Project Overview</h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>{project.description}</p>
        </div>
      </div>
    </div>
  )
}
