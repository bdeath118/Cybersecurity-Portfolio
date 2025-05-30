import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ChevronRight } from "lucide-react"
import { getProjects } from "@/lib/data"

export async function generateMetadata() {
  return {
    title: "Projects | Cyber Security Portfolio",
    description: "Explore my cybersecurity projects, tools, and security research",
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container py-12 md:py-24 px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Projects</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Cybersecurity projects, tools, and security research
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col h-full">
            <CardHeader>
              {project.image && (
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                  <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                </div>
              )}
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.summary}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge variant="outline">+{project.technologies.length - 3} more</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Link href={`/projects/${project.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  View Details <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {project.githubUrl && (
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="icon" variant="outline">
                    <Github className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {project.liveUrl && (
                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="icon" variant="outline">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <p className="text-muted-foreground">Projects will appear here once they are added.</p>
        </div>
      )}
    </div>
  )
}
