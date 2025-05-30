import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, Github } from "lucide-react"
import { getProject } from "@/lib/data"

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const project = await getProject(params.id)
    if (!project) {
      return {
        title: "Project Not Found | Cyber Security Portfolio",
        description: "The requested project could not be found.",
      }
    }

    return {
      title: `${project.title} | Cyber Security Portfolio`,
      description: project.summary || project.description,
      openGraph: {
        title: project.title,
        description: project.summary || project.description,
        images: project.image ? [{ url: project.image }] : [],
      },
    }
  } catch (error) {
    return {
      title: "Project | Cyber Security Portfolio",
      description: "Cybersecurity project details",
    }
  }
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="container py-12 md:py-24 px-4 md:px-6">
      <div className="mb-8">
        <Link href="/projects">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{project.title}</h1>
            <p className="text-xl text-muted-foreground mt-4">{project.summary}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>{project.description}</p>
          </div>

          <div className="flex gap-4">
            {project.githubUrl && (
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2">
                  <Github className="h-4 w-4" />
                  View Code
                </Button>
              </Link>
            )}
            {project.liveUrl && (
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {project.image && (
            <Card className="overflow-hidden">
              <div className="relative h-64 md:h-96">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              </div>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              {project.category && (
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  <Badge>{project.category}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
