import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flag, Trophy, Users, ChevronRight } from "lucide-react"
import { getCTFEvents } from "@/lib/data"

export async function CTFSection() {
  const ctfEvents = await getCTFEvents(3)

  return (
    <section className="py-12 md:py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">CTF Competitions</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Capture The Flag events and cybersecurity challenges
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ctfEvents.map((event) => (
            <Card key={event.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{event.name}</CardTitle>
                  <Badge
                    variant={
                      event.difficulty === "Easy"
                        ? "outline"
                        : event.difficulty === "Medium"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {event.difficulty}
                  </Badge>
                </div>
                <CardDescription>{event.date}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Team: {event.team}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Rank: {event.rank} of {event.totalTeams}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Flags Captured: {event.flagsCaptured}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/ctf/${event.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/ctf">
            <Button size="lg">View All CTF Events</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

