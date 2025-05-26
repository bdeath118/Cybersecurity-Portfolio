import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Flag, Trophy, Users, CheckCircle, XCircle } from "lucide-react"
import { getCTFEventById, getCTFEvents } from "@/lib/data"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const event = await getCTFEventById(params.id)

  if (!event) {
    return {
      title: "CTF Event Not Found",
    }
  }

  return {
    title: `${event.name} | Cyber Security Portfolio`,
    description: `Details about my participation in the ${event.name} CTF competition`,
  }
}

export async function generateStaticParams() {
  const events = await getCTFEvents()

  return events.map((event) => ({
    id: event.id,
  }))
}

export default async function CTFEventPage({ params }: { params: { id: string } }) {
  const event = await getCTFEventById(params.id)

  if (!event) {
    notFound()
  }

  return (
    <div className="container py-12 md:py-24 px-4 md:px-6">
      <Link
        href="/ctf"
        className="inline-flex items-center mb-8 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to CTF Events
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">{event.name}</h1>
              <Badge
                variant={
                  event.difficulty === "Easy" ? "outline" : event.difficulty === "Medium" ? "secondary" : "destructive"
                }
                className="text-base py-1 px-3"
              >
                {event.difficulty}
              </Badge>
            </div>
            <p className="text-muted-foreground">{event.date}</p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>{event.description}</p>
          </div>

          {event.challenges && event.challenges.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Challenges</h2>
              <div className="grid gap-4">
                {event.challenges.map((challenge) => (
                  <Card key={challenge.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">{challenge.name}</CardTitle>
                      <Badge>{challenge.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {challenge.solved ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span>{challenge.solved ? "Solved" : "Unsolved"}</span>
                        </div>
                        <Badge variant="outline">{challenge.points} points</Badge>
                      </div>
                      {challenge.description && (
                        <p className="mt-2 text-sm text-muted-foreground">{challenge.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Event Stats</CardTitle>
              <CardDescription>Performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Ranking</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Position</span>
                  <span className="font-bold">
                    {event.rank} of {event.totalTeams}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Percentile</span>
                  <span className="font-bold">{Math.round((1 - event.rank / event.totalTeams) * 100)}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Flags Captured</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span className="font-bold">{event.flagsCaptured}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Team</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Name</span>
                  <span className="font-bold">{event.team}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
