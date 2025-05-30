import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Trophy, Users, Flag, ArrowLeft, ExternalLink } from "lucide-react"
import { getCTFEvent } from "@/lib/data"

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const event = await getCTFEvent(params.id)

    if (!event) {
      return {
        title: "CTF Event Not Found | Cyber Security Portfolio",
        description: "The requested CTF event could not be found.",
      }
    }

    return {
      title: `${event.name} CTF | Cyber Security Portfolio`,
      description: event.description
        ? event.description.substring(0, 160)
        : `Details about the ${event.name} CTF competition`,
      openGraph: {
        title: `${event.name} CTF`,
        description: event.description
          ? event.description.substring(0, 160)
          : `Details about the ${event.name} CTF competition`,
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "CTF Event | Cyber Security Portfolio",
      description: "View Capture The Flag event details",
    }
  }
}

export default async function CTFEventPage({ params }: { params: { id: string } }) {
  const event = await getCTFEvent(params.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="container py-12 px-4">
      <Link href="/ctf" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to CTF Events
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">{event.name}</h1>
          <Badge
            variant={
              event.difficulty === "Easy" ? "outline" : event.difficulty === "Medium" ? "secondary" : "destructive"
            }
            className="text-sm"
          >
            {event.difficulty}
          </Badge>
        </div>

        <div className="flex items-center text-muted-foreground mb-8">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{event.date}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {event.rank} <span className="text-sm font-normal text-muted-foreground">of {event.totalTeams}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{event.team}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Flag className="h-4 w-4 mr-2 text-green-500" />
                Flags Captured
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{event.flagsCaptured}</p>
            </CardContent>
          </Card>
        </div>

        {event.description && (
          <div className="prose dark:prose-invert max-w-none mb-8">
            <h2 className="text-2xl font-bold mb-4">Event Description</h2>
            {event.description.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}

        {event.challenges && event.challenges.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Challenges Solved</h2>
            <div className="space-y-4 mb-8">
              {event.challenges.map((challenge, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{challenge.name}</h3>
                      <Badge>{challenge.category}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{challenge.description}</p>
                    {challenge.points && (
                      <div className="text-sm">
                        <span className="font-medium">Points:</span> {challenge.points}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {event.learnings && event.learnings.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Key Learnings</h2>
            <ul className="space-y-2 mb-8">
              {event.learnings.map((learning, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>{learning}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <Separator className="my-8" />

        {event.ctfUrl && (
          <Link href={event.ctfUrl} target="_blank" rel="noopener noreferrer">
            <Button className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Visit CTF Platform
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
