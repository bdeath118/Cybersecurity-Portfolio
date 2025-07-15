import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Github, ExternalLink, ArrowLeft } from "lucide-react"
import { getProject, getSiteInfo } from "@/lib/data"

interface ProjectPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  try {
    const project = await getProject(params.id)
    const siteInfo = await getSiteInfo()

    if (!project) {
      return {
        title: "Project Not Found",
        description: "The requested project could not be found",
      }
    }

    return {
      title: project.title,
      description: project.summary || project.description.substring(0, 160),
      keywords: [...project.technologies, "cybersecurity", "project", "security"],
      openGraph: {
        title: `${project.title} | ${siteInfo.name}`,
        description: project.summary || project.description.substring(0, 160),
        type: "article",
        publishedTime: project.date,
        authors: [siteInfo.name],
        tags: project.technologies,
        images: project.image
          ? [
              {
                url: project.image,
                width: 1200,
                height: 630,
                alt: project.title,
              },
            ]
          : [
              {
                url: siteInfo.backgroundImage || "/images/background.jpeg",
                width: 1200,
                height: 630,
                alt: project.title,
              },
            ],
      },
      twitter: {
        card: "summary_large_image",
        title: project.title,
        description: project.summary || project.description.substring(0, 160),
        images: [project.image || siteInfo.backgroundImage || "/images/background.jpeg"],
      },
      alternates: {
        canonical: `/projects/${params.id}`,
      },
    }
  } catch (error) {
    console.error("Error generating project metadata:", error)
    return {
      title: "Project",
      description: "View project details",
    }
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="container py-12 px-4">
      <Link href="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Link>

      {project.image && (
        <div className="relative h-[300px] md:h-[400px] w-full mb-8 rounded-lg overflow-hidden">
          <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="flex items-center text-muted-foreground mb-8">
          <Calendar className="h-4 w-4 mr-2" />
          <span>
            {new Date(project.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="text-lg font-medium mb-4">{project.summary}</p>

          {project.description.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {project.features && project.features.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <ul className="space-y-2 mb-8">
              {project.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {project.challenges && project.challenges.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Challenges & Solutions</h2>
            <div className="space-y-6 mb-8">
              {project.challenges.map((challenge, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="font-bold mb-2">Challenge:</h3>
                    <p className="mb-4">{challenge.challenge}</p>
                    <h3 className="font-bold mb-2">Solution:</h3>
                    <p>{challenge.solution}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <Separator className="my-8" />

        <div className="flex flex-wrap gap-4">
          {project.githubUrl && (
            <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Github className="h-4 w-4" />
                View Source Code
              </Button>
            </Link>
          )}

          {project.liveUrl && (
            <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View Live Project
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
