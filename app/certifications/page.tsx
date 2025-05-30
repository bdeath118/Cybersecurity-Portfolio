import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCertifications } from "@/lib/data"
import Link from "next/link"

export async function generateMetadata() {
  return {
    title: "Certifications | Cyber Security Portfolio",
    description: "View my cybersecurity certifications and qualifications",
  }
}

export default async function CertificationsPage() {
  const certifications = await getCertifications()

  return (
    <div className="container py-12 md:py-24 px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Certifications</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Industry-recognized credentials and qualifications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <Card key={cert.id} className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center gap-4">
              {cert.logo ? (
                <Image
                  src={cert.logo || "/placeholder.svg"}
                  alt={cert.name}
                  width={64}
                  height={64}
                  className="rounded-md"
                />
              ) : (
                <div className="p-2 bg-primary/10 rounded-full">
                  <Award className="h-10 w-10 text-primary" />
                </div>
              )}
              <div>
                <CardTitle className="text-xl">{cert.name}</CardTitle>
                <CardDescription>{cert.issuer}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex justify-between">
                <Badge variant="outline">Issued: {cert.date}</Badge>
                {cert.expiryDate && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  >
                    Expires: {cert.expiryDate}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{cert.description}</p>
              {cert.credentialUrl && (
                <Link href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Verify Credential
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {certifications.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No certifications yet</h3>
          <p className="text-muted-foreground">Certifications will appear here once they are added.</p>
        </div>
      )}
    </div>
  )
}
