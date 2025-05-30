import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Flag, Trophy, Users, Calendar, Clock } from "lucide-react"
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
      title: `${event.name} | CTF Events`,
      description: event.description || `CTF event: ${event.name}`,
      openGraph: {
        title: event.name,
        description: event.description || `CTF event: ${event.name}`,
      },
    }
  } catch (error) {
    return {
      title: "CTF Event | Cyber Security Portfolio",
      description: "CTF event details",
    }
  }
}

export default async function CTFEventPage({ params }: { params: { id: string } }) {
  const event = await getCTFEvent(params.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="container py-12 md:py-24 px-4 md:px-6">
      <div className="mb-8">
        <Link href="/ctf">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to CTF Events
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{event.name}</h1>
            <div className="flex items-center gap-4 mt-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <Badge
                variant={
                  event.difficulty === "Easy" ? "outline" : event.difficulty === "Medium" ? "secondary" : "destructive"
                }
              >
                {event.difficulty}
              </Badge>
            </div>
          </div>

          {event.description && (
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>{event.description}</p>
            </div>
          )}

          {event.challenges && event.challenges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Challenges Completed</CardTitle>
                <CardDescription>Individual challenges solved during this CTF</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {event.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{challenge.name}</h4>
                        <p className="text-sm text-muted-foreground">{challenge.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{challenge.points} pts</div>
                        <Badge variant="outline" className="text-xs">
                          {challenge.difficulty}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Team</div>
                  <div className="text-sm text-muted-foreground">{event.team}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Final Rank</div>
                  <div className="text-sm text-muted-foreground">
                    {event.rank} of {event.totalTeams}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Flag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Flags Captured</div>
                  <div className="text-sm text-muted-foreground">{event.flagsCaptured}</div>
                </div>
              </div>

              {event.duration && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Duration</div>
                    <div className="text-sm text-muted-foreground">{event.duration}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {event.writeupUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={event.writeupUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full gap-2">
                    <Flag className="h-4 w-4" />
                    View Writeup
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
