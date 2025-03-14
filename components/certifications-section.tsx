import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award } from "lucide-react"
import { getCertifications } from "@/lib/data"

export async function CertificationsSection() {
  const certifications = await getCertifications()

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Certifications</h2>
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
                    width={48}
                    height={48}
                    className="rounded-md"
                  />
                ) : (
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-lg">{cert.name}</CardTitle>
                  <CardDescription>{cert.issuer}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex justify-between mb-2">
                  <Badge variant="outline">{cert.date}</Badge>
                  {cert.expiryDate && (
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    >
                      Expires: {cert.expiryDate}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{cert.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

