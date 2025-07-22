"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import type { DigitalBadge } from "@/lib/types"

interface DigitalBadgesSectionProps {
  digitalBadges: DigitalBadge[]
}

export function DigitalBadgesSection({ digitalBadges }: DigitalBadgesSectionProps) {
  const sortedBadges = [...digitalBadges].sort((a, b) => {
    const dateA = new Date(a.issue_date || "1970-01-01").getTime()
    const dateB = new Date(b.issue_date || "1970-01-01").getTime()
    return dateB - dateA // Sort by most recent first
  })

  return (
    <section id="digital-badges" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Digital Badges</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Recognitions and achievements earned through various learning platforms and challenges.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sortedBadges.map((badge) => (
            <Card key={badge.id} className="flex flex-col h-full">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                {badge.image_url && (
                  <Image
                    src={badge.image_url || "/placeholder.svg"}
                    alt={`${badge.name} badge`}
                    width={64}
                    height={64}
                    className="rounded-lg object-contain"
                  />
                )}
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold">{badge.name}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{badge.issuer}</p>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between pt-4">
                <div className="space-y-2">
                  {badge.issue_date && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Issued: {new Date(badge.issue_date).toLocaleDateString()}
                    </p>
                  )}
                  {badge.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-200 mt-2">{badge.description}</p>
                  )}
                </div>
                {badge.credential_url && (
                  <a
                    href={badge.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    View Credential
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
