"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { Certification } from "@/lib/types"

interface CertificationsSectionProps {
  certifications: Certification[]
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  const sortedCertifications = [...certifications].sort((a, b) => {
    const dateA = new Date(a.issue_date || a.expiration_date || "1970-01-01").getTime()
    const dateB = new Date(b.issue_date || b.expiration_date || "1970-01-01").getTime()
    return dateB - dateA // Sort by most recent first
  })

  return (
    <section id="certifications" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Certifications</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              My professional certifications demonstrating validated expertise in various cybersecurity domains.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sortedCertifications.map((cert) => (
            <Card key={cert.id} className="flex flex-col h-full">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                {cert.image_url && (
                  <Image
                    src={cert.image_url || "/placeholder.svg"}
                    alt={`${cert.name} logo`}
                    width={64}
                    height={64}
                    className="rounded-lg object-contain"
                  />
                )}
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold">{cert.name}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{cert.issuer}</p>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between pt-4">
                <div className="space-y-2">
                  {cert.issue_date && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Issued: {new Date(cert.issue_date).toLocaleDateString()}
                    </p>
                  )}
                  {cert.expiration_date && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Expires: {new Date(cert.expiration_date).toLocaleDateString()}
                    </p>
                  )}
                  {cert.credential_id && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">Credential ID: {cert.credential_id}</p>
                  )}
                  {cert.category && (
                    <Badge variant="secondary" className="mt-2">
                      {cert.category}
                    </Badge>
                  )}
                </div>
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
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
