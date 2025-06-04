import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Github, Linkedin } from "lucide-react"
import { getSiteInfo } from "@/lib/data"
import Link from "next/link"

export async function generateMetadata() {
  try {
    const siteInfo = await getSiteInfo()
    return {
      title: `Contact | ${siteInfo.name || "Cyber Security Portfolio"}`,
      description: `Get in touch with ${siteInfo.name || "me"} for cybersecurity opportunities and collaborations.`,
      openGraph: {
        title: "Contact",
        description: `Get in touch for cybersecurity opportunities and collaborations.`,
      },
    }
  } catch {
    return {
      title: "Contact | Cyber Security Portfolio",
      description: "Get in touch for cybersecurity opportunities and collaborations.",
    }
  }
}

export default async function ContactPage() {
  try {
    const siteInfo = await getSiteInfo()

    return (
      <div className="container py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Interested in cybersecurity collaboration or have questions about my work? I'd love to hear from you.
          </p>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">The best way to reach me for professional inquiries.</p>
                <Link href={`mailto:${siteInfo.email}`}>
                  <Button className="gap-2">
                    <Mail className="h-4 w-4" />
                    {siteInfo.email}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {siteInfo.github && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    GitHub
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Check out my open-source projects and contributions.</p>
                  <Link href={siteInfo.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2">
                      <Github className="h-4 w-4" />
                      View GitHub Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {siteInfo.linkedin && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Linkedin className="h-5 w-5" />
                    LinkedIn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Connect with me professionally and see my career journey.
                  </p>
                  <Link href={siteInfo.linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2">
                      <Linkedin className="h-4 w-4" />
                      Connect on LinkedIn
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading contact page:", error)
    return (
      <div className="container py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Get In Touch</h1>
          <p className="text-muted-foreground">Contact information is currently unavailable.</p>
        </div>
      </div>
    )
  }
}
