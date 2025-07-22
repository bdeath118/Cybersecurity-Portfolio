"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CTFEvent } from "@/lib/types"

interface CTFSectionProps {
  ctfEvents: CTFEvent[]
}

export function CTFSection({ ctfEvents }: CTFSectionProps) {
  const sortedCTFEvents = [...ctfEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <section id="ctf-events" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">CTF Engagements</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Highlights from my participation in Capture The Flag (CTF) competitions, showcasing practical
              problem-solving and technical skills.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sortedCTFEvents.map((event) => (
            <Card key={event.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{event.name}</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">{event.platform}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Date: {new Date(event.date).toLocaleDateString()}
                  </p>
                  {event.rank && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Rank: <Badge variant="secondary">{event.rank}</Badge>
                    </p>
                  )}
                  {event.score && <p className="text-sm text-gray-600 dark:text-gray-300">Score: {event.score}</p>}
                  {event.challenges_solved && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Challenges Solved: {event.challenges_solved}
                    </p>
                  )}
                  {event.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-200 mt-2">{event.description}</p>
                  )}
                </div>
                {event.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    View Event Details
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
